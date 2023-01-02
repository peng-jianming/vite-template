<template>
  <edit-dialog-component
    v-bind="attrs"
    :width="width"
    btn-is-text
    @submit="submit"
    @open="open"
    @opened="opened"
    @close="close"
  >
    <form-component
      ref="formRef"
      v-loading="loading"
      v-bind="attrs"
      :configs="configs"
      :params="params"
      :init-data="props.data"
    >
      <slot></slot>
    </form-component>
  </edit-dialog-component>
</template>

<script lang="ts" setup>
import { Fields } from "src/dependencies/Field/Fields";
import { nextTick, ref, computed, useAttrs } from "vue";
import EditDialogComponent from "./EditDialog.vue";
import FormComponent from "./Form.vue";
import { useEditData } from "../hooks/useEditData";
import { filterNotInConfigs } from "../utils/params";
const props = defineProps({
  fieldsConfig: {
    type: Fields,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  isResetParams: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "55%",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["submit", "close", "open", "opened"]);
const attrs = useAttrs();
const { params, resetParams } = useEditData(props);
const configs = computed(() =>
  props.fieldsConfig.getFields({
    params: params.value,
    data: props.data,
  })
);
const formRef = ref<InstanceType<typeof FormComponent> | null>(null);

const submit = async (callback: any) => {
  const result = await formRef.value!.submit();
  filterNotInConfigs(configs.value, result);
  emits("submit", { result, callback });
};

const close = () => {
  emits("close");
};

const open = () => {
  nextTick(() => {
    emits("open");
  });
  if (props.isResetParams) {
    resetParams();
  }
};

const opened = () => {
  nextTick(() => {
    emits("opened");
  });
};
</script>
