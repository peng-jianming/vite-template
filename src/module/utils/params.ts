import { isEmpty, toString, trim } from "lodash";
import { Field } from "src/dependencies/Field/Field";

// 判断空值(不包括空对象,因为表单值没有对象类型的),使用lodash的toString,帮助修复isEmpty判断数字为空的情况
export const isFullEmpty = (value: any): boolean => {
  return isEmpty(toString(value)) || trim(value as string) === "";
};

export function filterEmpty(data: any) {
  const params = JSON.parse(JSON.stringify(data));
  // 移除空数组或空字符串参数
  Object.keys(params)
    // 值为空、数组长度为0、时间格式0000-00-00 00:00:00设置默认值为undefined
    .filter(
      (key) => isFullEmpty(params[key]) || params[key] === "0000-00-00 00:00:00"
    )
    .forEach((key) => {
      params[key] = undefined;
      delete params[key];
    });
  return params;
}

// 移除不在配置文件中的数据
export function filterNotInConfigs(configs: Field[] = [], params: any = {}) {
  const configKeys = configs.reduce<string[]>(
    (propKeys, { prop, props = [] }) => propKeys.concat(prop).concat(props),
    []
  );
  Object.keys(params)
    .filter((key) => !configKeys.includes(key))
    .forEach((key) => {
      params[key] = undefined;
      delete params[key];
    });
  return params;
}
