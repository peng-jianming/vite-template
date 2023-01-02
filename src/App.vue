<script setup lang="ts">
import { Field } from "src/dependencies/Field/Field";
import ccc from "src/module/template/Form.vue";
import bbb from "src/module/template/Table.vue";
import aaa from "src/module/template/FormList.vue";
import { onMounted, ref } from "vue";
import { testApi } from "src/dependencies/api/index";
const config = [
  new Field({
    prop: "a",
    label: "测试a",
    type: "input",
    formItemInline: true,
    formItemWidth: "300px",
    required: true,
  }),
  new Field({
    prop: "b",
    label: "测试b",
    type: "input",
    formItemInline: true,
  }),
  new Field({
    prop: "c",
    label: "测试c",
    type: "input",
  }),
];
const formRef = ref();
onMounted(() => {
  formRef.value.resetDefaultValue();
});
const handleSubmit = async () => {
  const result = await formRef.value.submit();
  console.log(result);
};
const params = ref({
  a: 1,
});
const handleClick = async () => {
  const data = await testApi();
  console.log(data, "=====");
};
</script>

<template>
  <div>
    <div @click="handleClick">测试</div>
    <ccc ref="formRef" :configs="config" labelPosition="top" :params="params" />
    <el-button @click="handleSubmit">提交</el-button>
    <bbb :configs="config" :datas="[{}, {}]" />
    <aaa :configs="config" />
  </div>
</template>

<style lang="scss" scoped>
.logo {
  text-decoration: dashed;
  height: 10em;
  padding: 10em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
