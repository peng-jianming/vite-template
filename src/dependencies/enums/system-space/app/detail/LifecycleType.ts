export const LifecycleType = Object.freeze({
  START_BEFORE: "START_BEFORE",
  START_AFTER: "START_AFTER",
});

export default [
  { name: "启动前处理", value: LifecycleType.START_BEFORE },
  { name: "启动后处理", value: LifecycleType.START_AFTER },
];
