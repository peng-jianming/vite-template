import { onMounted, ref, Ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { MessageType, OptionsType } from "./types";

const DEFAULT_MESSAGE: MessageType = {
  GET_DATA_IF_FAILED: "获取列表数据失败",
  EXPORT_DATA_IF_FAILED: "导出数据失败",
};

const DEFAULT_OPTIONS: OptionsType = {
  message: DEFAULT_MESSAGE,
};

export default function useList<
  ItemType extends object,
  FilterOption extends object
>(
  listRequestFn: any,
  filterOption: Ref<object>,
  exportRequestFn?: any,
  options = DEFAULT_OPTIONS
) {
  // 加载态
  const loading = ref(false);
  // 当前页
  const curPage = ref(1);
  // 总
  const total = ref(0);
  // 分页大小
  const pageSize = ref(10);
  // 数据
  const list = ref<ItemType[]>([]);

  const loadData = async (page = curPage.value) => {
    loading.value = true;
    try {
      const {
        data,
        meta: { total: count },
      } = await listRequestFn(pageSize.value, page, filterOption.value);
      list.value = data;
      total.value = count;
      options?.requestSuccess?.();
    } catch (error) {
      options?.message?.GET_DATA_IF_FAILED &&
        ElMessage({
          message: options.message.GET_DATA_IF_FAILED,
          type: "error",
        });
      options?.requestError?.();
    } finally {
      loading.value = false;
    }
  };

  const exportFile = async () => {
    if (!exportRequestFn && typeof exportRequestFn !== "function") {
      throw new Error("当前没有提供exportRequest函数");
    }
    try {
      const {
        data: { link },
      } = await exportRequestFn(filterOption.value);
      window.open(link);
      options?.exportSuccess?.();
    } catch (error) {
      options?.message?.EXPORT_DATA_IF_FAILED &&
        ElMessage({
          message: options.message.EXPORT_DATA_IF_FAILED,
          type: "error",
        });
      options?.exportError?.();
    }
  };

  const reset = () => {
    if (!filterOption.value) return;
    const keys = Reflect.ownKeys(filterOption.value);
    filterOption.value = {} as FilterOption;
    keys.forEach((key) => {
      Reflect.set(filterOption.value!, key, undefined);
    });
    loadData();
  };

  const reload = () => {
    loadData();
  };

  const filter = () => {
    loadData();
  };

  // 监听分页数据改变
  watch([curPage, pageSize], () => {
    loadData(curPage.value);
  });

  onMounted(() => {
    loadData(curPage.value);
  });

  return {
    loading,
    curPage,
    total,
    list,
    filterOption,
    reload,
    reset,
    filter,
    pageSize,
    exportFile,
    loadData,
  };
}
