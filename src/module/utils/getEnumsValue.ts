type enumsType = {
  id: number | string;
  value: number | string;
  name?: string;
}[];

export const getEnumsValue = (enums: enumsType, id: string | number) => {
  const match = enums.find(({ value }) => value === id);
  return match?.value;
};

export const getListEnumsValue = (
  enums: enumsType,
  data: (number | string)[],
  sep = ";"
) => {
  return enums
    .filter(({ id }) => data.includes(id))
    .map((item) => item.value)
    .join(sep);
};
