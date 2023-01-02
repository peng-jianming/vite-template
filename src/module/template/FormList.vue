<template>
  <el-form
    :label-width="props.labelWidth"
    :label-position="props.labelPosition"
  >
    <template
      v-for="{
        prop,
        label,
        enums,
        labelWidth,
        formItemWidth,
        formItemInline,
        displayProp,
        isHtml,
        sep,
        listComponent,
        ...arg
      } in props.configs"
      :key="prop"
    >
      <el-form-item
        :label="label"
        :prop="prop"
        :label-width="labelWidth"
        :style="{ width: formItemWidth }"
        :class="{
          'template-form-list-inline-block': formItemInline,
        }"
      >
        <slot :name="prop">
          <component
            :is="listComponent"
            v-if="listComponent"
            :prop="prop"
            :model-value="data[prop]"
            :data="data"
            v-bind="{ ...arg, ...attrs }"
            @reload="handleReload"
          />
          <!-- html的字段显示 -->
          <span v-else-if="isHtml" v-html="props.data[prop]"></span>
          <!--专用显示字段-->
          <span v-else-if="displayProp">{{
            mapDefault(props.data[displayProp])
          }}</span>
          <!--使用枚举格式化数组字段信息-->
          <span v-else-if="enums && Array.isArray(props.data[prop])">{{
            mapDefault(getListEnumsValue(enums, props.data[prop], sep))
          }}</span>
          <!--使用枚举显示字段信息-->
          <span v-else-if="enums">{{
            mapDefault(getEnumsValue(enums, props.data[prop]))
          }}</span>
          <!--默认显示-->
          <span v-else>{{ mapDefault(mapArray(props.data[prop], sep)) }}</span>
        </slot>
      </el-form-item>
    </template>
  </el-form>
</template>

<script lang="ts" setup>
import { Field } from "src/dependencies/Field/Field";
import { PropType, useAttrs, reactive } from "vue";
import {
  getEnumsValue,
  getListEnumsValue,
} from "src/module/utils/getEnumsValue";
import { isFullEmpty } from "../utils/params";
const props = defineProps({
  // 表单配置
  configs: {
    type: Array as PropType<Field[]>,
    default() {
      return [];
    },
  },
  // 表单数据
  data: {
    type: Object,
    default() {
      return reactive({});
    },
  },
  labelWidth: {
    type: String,
    default: "100px",
  },
  labelPosition: {
    type: String,
    default: "right",
  },
});
const emits = defineEmits(["reload"]);
const attrs = useAttrs();

const mapDefault = (val: any) => {
  return isFullEmpty(val) ? "--" : val;
};
const mapArray = (val: any, sep = ";") => {
  return Array.isArray(val) ? val.join(sep) : val;
};

const handleReload = (data: any) => {
  emits("reload", data);
};
</script>

<style lang="scss">
.template-form-list-inline-block {
  display: inline-flex !important;
}
</style>
