<template>
  <el-button
    :type="btnType"
    :style="btnStyle"
    :icon="btnIcon"
    :disabled="btnDisabled"
    :size="btnSize"
    :text="btnIsText"
    :round="btnIsRound"
    :loading="btnLoading"
    @click.stop.prevent="validRender"
  >
    <slot name="btnText">{{ btnText }}</slot>
  </el-button>
  <el-dialog
    v-model="isShow"
    append-to-body
    v-bind="attrs"
    custom-class="ax-dialog"
    :destroy-on-close="true"
    @open="opened"
    @close="close"
  >
    <template #title>
      <slot name="header">
        <div class="dialog-header">
          <div class="dialog-header-title">{{ title }}</div>
        </div>
      </slot>
    </template>
    <slot :close="close" :submit="submit"></slot>
    <template v-if="isShowHandleButton" #footer>
      <div
        :style="{ display: 'flex', 'justify-content': handleBtnFlexPosition }"
      >
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">{{ submitText }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, toRefs, useAttrs, nextTick } from "vue";
const props = defineProps({
  btnIcon: {
    type: [String, Object],
    default: "",
  },
  btnDisabled: {
    type: Boolean,
    default: false,
  },
  btnIsRound: {
    type: Boolean,
    default: false,
  },
  btnText: {
    type: [String, Number],
    default: "",
  },
  btnType: {
    type: String,
    default: "primary",
  },
  btnStyle: {
    type: Object,
    default() {
      return {};
    },
  },
  btnSize: {
    type: String,
    default: "default",
  },
  isShowHandleButton: {
    type: Boolean,
    default: true,
  },
  submitText: {
    type: String,
    default: "确定",
  },
  btnIsText: {
    type: Boolean,
    default: false,
  },
  btnLoading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  handleBtnFlexPosition: {
    type: String,
    default: "end",
  },
  isValidRender: {
    type: Boolean,
    default: false,
  },
  validRenderFun: {
    type: Function,
  },
});
const emits = defineEmits(["open", "opened", "close", "submit"]);
const attrs = useAttrs();
const {
  btnIcon,
  btnDisabled,
  btnText,
  btnType,
  btnStyle,
  btnSize,
  submitText,
  isShowHandleButton,
  isValidRender,
  validRenderFun,
} = toRefs(props);
const isShow = ref(false);

const validRender = () => {
  if (isValidRender.value) {
    validRenderFun.value().then(open);
  } else {
    open();
  }
};
const open = () => {
  isShow.value = true;
  emits("open");
};
const opened = () => {
  nextTick(() => {
    emits("opened");
  });
};
const close = () => {
  isShow.value = false;
  emits("close");
};

const submit = () => {
  emits("submit", close);
};
defineExpose({
  close,
});
</script>

<style lang="less">
.ax-dialog {
  border-radius: 10px;
  overflow: hidden;
  .el-dialog__headerbtn {
    top: 0;
  }
  .el-dialog__header {
    padding: 0;
    background-color: #f5f6fa;
    margin-right: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .dialog-header {
    height: 50px;
    margin-right: 0;
    padding: 10px 0 10px 20px;
    border-radius: 8px 8px 0 0;
    &-title {
      font-size: 14px;
      font-weight: 600;
      color: #232323;
      overflow: hidden;
      line-height: 32px;
      float: left;
    }
  }
}
</style>
