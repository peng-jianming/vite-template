export const StorageAllocationMode = Object.freeze({
  CREATEPVC: "CREATEPVC",
  REFPVC: "REFPVC",
  CONFIGMAPMOUNT: "CONFIGMAPMOUNT",
  SECRETIONS: "SECRETMOUNT",
});

export default [
  { name: "新建PVC", value: StorageAllocationMode.CREATEPVC },
  { name: "已有PVC", value: StorageAllocationMode.REFPVC },
  { name: "ConfigMap", value: StorageAllocationMode.CONFIGMAPMOUNT },
  { name: "Secret", value: StorageAllocationMode.SECRETIONS },
];
