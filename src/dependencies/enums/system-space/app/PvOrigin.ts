export const PvOrigin = Object.freeze({
  STORAGECLASSDYNAMIC: false,
  PVPOOLSTATIC: true,
});

export default [
  { name: "新建PV", value: PvOrigin.STORAGECLASSDYNAMIC },
  { name: "已有PV", value: PvOrigin.PVPOOLSTATIC },
];
