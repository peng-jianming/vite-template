<template>
  <el-table
    ref="axTableRef"
    v-loading="props.loading"
    :data="props.datas"
    v-bind="attrs"
    :header-cell-style="props.headerCellStyle"
    :cell-style="props.cellStyle"
    @selection-change="handleSelectionChange"
  >
    <slot name="pre"></slot>
    <el-table-column v-if="props.showIndex" label="序号" type="index" />
    <el-table-column v-if="props.selection" label="全选" type="selection" />
    <el-table-column
      v-for="{
        prop,
        label,
        listComponent,
        enums,
        displayProp,
        isHtml,
        labelWidth,
        hideTooltip,
        sep,
        ...arg
      } in props.configs"
      :key="prop"
      v-bind="arg"
      :show-overflow-tooltip="!hideTooltip"
      :width="labelWidth"
      :label="label"
    >
      <template #default="{ row, $index }">
        <component
          :is="listComponent"
          v-if="listComponent"
          :ref="listComponent && prop"
          v-model="row[prop]"
          :prop="prop"
          :data="row"
          :index="$index"
          :datas="props.datas"
          v-bind="{
            ...attrs,
            ...arg,
          }"
          @reload="handleReload"
        />
        <!-- html的字段显示 -->
        <span v-else-if="isHtml" v-html="row[prop]"></span>
        <!--专用显示字段-->
        <span v-else-if="displayProp">{{ mapDefault(row[displayProp]) }}</span>
        <!--使用枚举格式化数组字段信息-->
        <span v-else-if="enums && Array.isArray(row[prop])">{{
          mapDefault(getListEnumsValue(enums, row[prop], sep))
        }}</span>
        <!--使用枚举显示字段信息-->
        <span v-else-if="enums">{{
          mapDefault(getEnumsValue(enums, row[prop]))
        }}</span>
        <!--默认显示-->
        <span v-else>{{ mapDefault(mapArray(row[prop], sep)) }}</span>
      </template>
    </el-table-column>
    <!--可以增加额外的列-->
    <slot></slot>
    <template #append>
      <slot name="append"></slot>
    </template>
    <template #empty>
      <slot name="empty"></slot>
    </template>
  </el-table>
</template>

<script lang="ts" setup>
import { Field } from "src/dependencies/Field/Field";
import { useAttrs, PropType, ref, getCurrentInstance } from "vue";
import { isFullEmpty } from "../utils/params";
import {
  getEnumsValue,
  getListEnumsValue,
} from "src/module/utils/getEnumsValue";
import { isArray, isFunction } from "lodash";
const props = defineProps({
  configs: {
    type: Array as PropType<Field[]>,
    default() {
      return [];
    },
  },
  datas: {
    type: Array,
    default() {
      return [];
    },
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showIndex: {
    type: Boolean,
    default: false,
  },
  selection: {
    type: Boolean,
    default: false,
  },
  headerCellStyle: {
    type: Object,
    default() {
      return { background: "#f5f7fa", color: "#232323" };
    },
  },
  cellStyle: {
    type: Object,
    default() {
      return {};
    },
  },
});
const emits = defineEmits(["selection-change", "reload"]);
const attrs = useAttrs();
const axTableRef = ref();
const mapDefault = (val: any) => {
  return isFullEmpty(val) ? "--" : val;
};
const mapArray = (val: any, sep = ";") => {
  return Array.isArray(val) ? val.join(sep) : val;
};

const handleReload = (data: any) => {
  emits("reload", data);
};

const handleSelectionChange = (row: any) => {
  emits("selection-change", row);
};

const instance = getCurrentInstance();
const submit = () => {
  const eleRefs: Record<string, any> = instance ? instance.refs : {};
  Object.values(eleRefs)
    .filter((eleRef) => Array.isArray(eleRef))
    .forEach((Refs) => {
      Refs.forEach((eleRef: any) => {
        eleRef.submit && eleRef.submit();
      });
    });
};
defineExpose({
  axTableRef,
  submit,
});
</script>

<style lang="less"></style>
