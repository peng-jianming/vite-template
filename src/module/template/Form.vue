<template>
  <el-form
    ref="ruleFormRef"
    v-loading="props.loading"
    :model="params"
    :label-width="props.labelWidth"
    :label-position="props.labelPosition"
  >
    <template
      v-for="{
        prop,
        label,
        type,
        enums,
        required,
        labelWidth,
        formItemWidth,
        formItemInline,
        editComponent,
        formItemMRWidth,
        tip,
        ...arg
      } in props.configs"
      :key="prop"
    >
      <el-form-item
        :label="label"
        :prop="prop"
        :label-width="labelWidth"
        :style="{ width: formItemWidth, marginRight: formItemMRWidth }"
        :class="{
          [props.labelPosition === 'top'
            ? 'template-form--inline-block'
            : 'template-form--inline-flex']: formItemInline,
          'required-icon': required,
        }"
        :rules="[
          {
            validator: validateMethod,
            trigger: ['blur'],
          },
        ]"
      >
        <template #label="row">
          <span>{{ row.label }}</span>
          <el-tooltip v-if="tip" :content="tip" placement="top">
            <span
              style="margin-left: 2px"
              class="icon iconfont icon-tishi"
            ></span>
          </el-tooltip>
        </template>
        <slot :name="prop">
          <el-select
            v-if="type === 'select' && enums"
            v-model="params[prop]"
            v-bind="arg"
          >
            <el-option
              v-for="{ value, name } in enums"
              :key="value"
              :value="value"
              :label="name"
            />
          </el-select>
          <el-checkbox-group
            v-else-if="type === 'checkbox' && enums"
            v-model="params[prop]"
            v-bind="arg"
          >
            <el-checkbox
              v-for="{ value, name } in enums"
              :key="value"
              :label="value"
              >{{ name }}</el-checkbox
            >
          </el-checkbox-group>
          <el-radio-group
            v-else-if="type === 'radio' && enums"
            v-bind="arg"
            v-model="params[prop]"
          >
            <el-radio
              v-for="{ value, name } in enums"
              :key="value"
              :label="value"
              v-bind="arg"
              >{{ name }}</el-radio
            >
          </el-radio-group>
          <el-radio-group
            v-else-if="type === 'radioButton' && enums"
            v-bind="arg"
            v-model="params[prop]"
          >
            <el-radio-button
              v-for="{ value, name } in enums"
              :key="value"
              :label="value"
              >{{ name }}</el-radio-button
            >
          </el-radio-group>
          <component
            :is="editComponent || `el-${type}`"
            v-else
            :ref="editComponent && prop"
            :form-ref="ruleFormRef"
            :prop="prop"
            :props="props"
            :model-value="params[prop]"
            :data="params"
            v-bind="{ ...arg, ...attrs }"
            @update:model-value="handleValueChange(prop, $event)"
          />
        </slot>
      </el-form-item>
    </template>
  </el-form>
</template>

<script lang="ts" setup>
import { Field } from "src/dependencies/Field/Field";
import { getCurrentInstance, PropType, ref, toRefs, useAttrs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { isFunction } from "lodash";
import type { FormInstance } from "element-plus";
import { isFullEmpty, filterEmpty } from "../utils/params";
const route = useRoute();
const router = useRouter();
const props = defineProps({
  // ????????????
  configs: {
    type: Array as PropType<Field[]>,
    default() {
      return [];
    },
  },
  // ????????????
  params: {
    type: Object,
    default() {
      return ref({});
    },
  },
  // ????????????????????????
  initData: {
    type: Object,
    default() {
      return {};
    },
  },
  // ???????????????,??????????????????
  isCancelValidate: {
    type: Boolean,
    default: false,
  },
  // ?????????????????????,????????????????????????
  isFilterEmpty: {
    type: Boolean,
    default: false,
  },
  labelWidth: {
    type: String,
    default: "80px",
  },
  labelPosition: {
    type: String,
    default: "right",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["before-submit", "submit"]);
const attrs = useAttrs();

const { params } = toRefs(props);

const ruleFormRef = ref<FormInstance>();
const instance = getCurrentInstance();
const submit = () => {
  return new Promise((resolve, reject) => {
    emits("before-submit");

    // ??????????????????
    const eleRefs: Record<string, any> = instance ? instance.refs : {};
    Object.values(eleRefs)
      .filter((eleRef) => eleRef && eleRef[0] && isFunction(eleRef[0].submit))
      .forEach((eleRef) => {
        eleRef[0] && eleRef[0].submit();
      });
    // ????????????
    if (props.isCancelValidate) {
      emits("submit");
      resolve(props.isFilterEmpty ? filterEmpty(params.value) : params.value);
    } else {
      ruleFormRef.value?.validate((valid) => {
        if (valid) {
          emits("submit");
          resolve(
            props.isFilterEmpty ? filterEmpty(params.value) : params.value
          );
        } else {
          reject("????????????");
        }
      });
    }
  });
};

const validateMethod = (rule: any, value: any, callback: any) => {
  const currentField: Field = props.configs.find(
    ({ prop }) => prop === rule.fullField
  );
  if (currentField) {
    // ?????????????????????
    if (currentField.validateMethod) {
      currentField.validateMethod(
        callback,
        params.value[currentField.prop],
        params.value,
        props.initData
      );
    } else if (
      // ????????????
      // ????????????,??????????????????
      // ????????????(??????props?????????),??????????????????????????????,????????????????????????
      currentField.required &&
      (currentField.props
        ? !currentField.props.every((prop) => !isFullEmpty(params.value[prop]))
        : isFullEmpty(params.value[currentField.prop]))
    ) {
      callback(
        new Error(currentField.requiredMessage || `${currentField.label}??????`)
      );
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const handleValueChange = (prop: string, value: any) => {
  params.value[prop] = value;
};
const resetDefaultValue = () => {
  router.isReady().then(() => {
    props.configs.forEach(({ prop, props: _props = [], defaultValue }) => {
      const keys: string[] = _props.includes(prop)
        ? _props
        : _props.concat(prop);
      keys.forEach((_prop, index) => {
        // ???????????????????????????uriValue???????????????defaultValue
        let value =
          Array.isArray(defaultValue) && _props.length > 0
            ? defaultValue[index]
            : defaultValue;
        // ???????????????????????????
        const uriValue = route.query[_prop];
        if (!isFullEmpty(uriValue)) value = uriValue;
        params.value[prop] =
          value === undefined ? undefined : JSON.parse(JSON.stringify(value));
      });
    });
  });

  // ??????????????????
  const eleRefs: Record<string, any> = instance ? instance.refs : {};
  Object.values(eleRefs)
    .filter((eleRef) => eleRef && eleRef[0] && isFunction(eleRef[0].reset))
    .forEach((eleRef) => {
      eleRef[0] && eleRef[0].reset();
    });
};

defineExpose({
  submit,
  resetDefaultValue,
});
</script>

<style lang="scss">
.required-icon {
  .el-form-item__label:before {
    content: "*";
    color: #b88230;
    margin-right: 4px;
  }
}
.template-form--inline-block {
  display: inline-block !important;
  margin-right: 10px;
}
.template-form--inline-flex {
  display: inline-flex !important;
}
.ax-form {
  .el-form-item__label {
    word-break: break-all;
  }
  .el-input,
  .el-input__inner,
  .el-select,
  .el-autocomplete {
    width: 100%;
  }
  .el-input-number {
    width: 100%;
    input {
      text-align: left;
    }
  }
}
</style>
