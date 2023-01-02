export const AccessMode = Object.freeze({
  READWRITEONCE: "ReadWriteOnce",
  READONLYMANY: "ReadOnlyMany",
  READWRITEMANY: "ReadWriteMany",
  // READWRITEONCEPOD: 'ReadWriteOncePod',
});

export default [
  { name: "单主机读写", value: AccessMode.READWRITEONCE },
  { name: "多主机读写", value: AccessMode.READWRITEMANY },
  { name: "多主机只读", value: AccessMode.READONLYMANY },
  // { name: '单主机只写', value: AccessMode.READWRITEONCEPOD },
];
