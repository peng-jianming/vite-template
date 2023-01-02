export type enumsType = {
  id?: number | string;
  value: number | string;
  name?: string;
}[];
export type showConditionType = (context: any) => boolean;
export type validateMethodType = (
  callback: any,
  value?: any,
  params?: any,
  data?: any
) => void;

export interface FieldInterface {
  prop: string;
  label: string;
  type?: string;
  enums?: enumsType;
  props?: string[];
  required?: boolean;
  requiredMessage?: string;
  formItemWidth?: string;
  formItemInline?: boolean;
  labelWidth?: string;
  displayProp?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: any;
  editComponent?: any;
  listComponent?: any;
  validateMethod?: validateMethodType;
  showCondition?: showConditionType;
  [prop: string]: any;
}
const RESERVED_WORDS = [
  // 唯一区分key,:key,后端数据结构key
  "prop",
  // 中文文案
  "label",
  // 具有展示key时优先获取展示key
  "displayProp",
  // 多key依赖
  "props",
  // 是否必填
  "required",
  // 必填验证提示语
  "requiredMessage",
  // 类型，具体类型查看form.vue
  "type",
  // 枚举
  "enums",
  "disabled",
  "placeholder",
  // 默认值，使用Form使用resetDefaultValue时才用到
  "defaultValue",
  // label宽度(表格表头的宽度)
  "labelWidth",
  // 表单组件占用宽度
  "formItemWidth",
  // 表单组件是否一行展示
  "formItemInline",
  // 自定义校验方法, 根据Form表单自定义校验规则在里面调用callback进行错误和通过,与required独立
  "validateMethod",
  // 展示模版(table)使用listComponent
  "listComponent",
  // 编辑模版(form)使用editComponent
  "editComponent",
  // 函数,字段显示的控制
  "showCondition",
];
// 字段类
export class Field {
  prop: string;
  label: string;
  type?: string;
  enums?: enumsType;
  props?: string[];
  required?: boolean;
  requiredMessage?: string;
  formItemWidth?: string;
  formItemInline?: boolean;
  labelWidth?: string;
  displayProp?: string;
  defaultValue?: any;
  editComponent?: any;
  listComponent?: any;
  disabled?: boolean;
  placeholder?: string;
  validateMethod?: validateMethodType;
  showCondition: showConditionType;
  tip: string;
  [prop: string]: any;
  constructor(config: FieldInterface) {
    this.prop = config.prop;
    this.label = config.label;
    this.props = config.props;
    this.displayProp = config.displayProp;
    this.required = config.required;
    this.requiredMessage = config.requiredMessage;
    this.type = config.type;
    this.enums = config.enums;
    this.defaultValue = config.defaultValue;
    this.placeholder = config.placeholder;
    this.labelWidth = config.labelWidth;
    this.formItemWidth = config.formItemWidth;
    this.formItemInline = config.formItemInline;
    this.formItemMRWidth = config.formItemMRWidth;
    this.editComponent = config.editComponent;
    this.listComponent = config.listComponent;
    this.validateMethod = config.validateMethod;
    this.tip = config.tip;
    // 默认情况为永久展示
    this.showCondition = () => true;
  }

  clone(): Field {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  setShowCondition(showCondition: showConditionType) {
    this.showCondition = showCondition;
    return this;
  }

  isShow(context: any) {
    return this.showCondition(context);
  }

  setProp(prop: string) {
    this.prop = prop;
    return this;
  }

  setLabel(label: string) {
    this.label = label;
    return this;
  }

  setRequired() {
    this.required = true;
    return this;
  }

  resetRequired() {
    this.required = undefined;
    delete this.required;
    return this;
  }

  setRequiredMessage(requiredMessage: string) {
    this.requiredMessage = requiredMessage;
    return this;
  }

  resetRequireMessage() {
    this.requiredMessage = undefined;
    delete this.requiredMessage;
    return this;
  }

  setDisplayProp(displayProp: string) {
    this.displayProp = displayProp;
    return this;
  }

  resetDisplayProp() {
    this.displayProp = undefined;
    delete this.displayProp;
    return this;
  }

  setProps(props: string[]) {
    this.props = props;
    return this;
  }

  resetProps() {
    this.props = undefined;
    delete this.props;
    return this;
  }

  setType(type: string) {
    this.type = type;
    return this;
  }

  resetType() {
    this.type = undefined;
    delete this.type;
    return this;
  }

  setEnums(enums: enumsType) {
    this.enums = enums;
    return this;
  }

  resetEnums() {
    this.enums = undefined;
    delete this.enums;
    return this;
  }

  setDefaultValue(defaultValue: any) {
    this.defaultValue = defaultValue;
    return this;
  }

  resetDefaultValue() {
    this.defaultValue = undefined;
    delete this.defaultValue;
    return this;
  }

  setLabelWidth(labelWidth: string) {
    this.labelWidth = labelWidth;
    return this;
  }

  resetLabelWidth() {
    this.labelWidth = undefined;
    delete this.labelWidth;
    return this;
  }

  setFormItemWidth(formItemWidth: string) {
    this.formItemWidth = formItemWidth;
    return this;
  }

  resetFormItemWidth() {
    this.formItemWidth = undefined;
    delete this.formItemWidth;
    return this;
  }

  setFormItemInline() {
    this.formItemInline = true;
    return this;
  }

  resetFormItemInline() {
    this.formItemInline = false;
    return this;
  }

  setPlaceholder(placeholder: string) {
    this.placeholder = placeholder;
    return this;
  }

  resetPlaceholder() {
    this.placeholder = undefined;
    delete this.placeholder;
    return this;
  }

  setDisabled() {
    this.disabled = true;
    return this;
  }

  resetDisabled() {
    this.disabled = undefined;
    delete this.disabled;
    return this;
  }

  setValidateMethod(validateMethod: validateMethodType) {
    this.validateMethod = validateMethod;
    return this;
  }

  resetValidateMethod() {
    this.validateMethod = undefined;
    delete this.validateMethod;
    return this;
  }

  setListComponent(listComponent: any) {
    this.listComponent = listComponent;
    return this;
  }

  resetListComponent() {
    this.listComponent = undefined;
    delete this.listComponent;
    return this;
  }

  setEditComponent(editComponent: any) {
    this.editComponent = editComponent;
    return this;
  }

  resetEditComponent() {
    this.editComponent = undefined;
    delete this.editComponent;
    return this;
  }

  // 自定义字段不能覆盖已定义的字段
  setCustomize(key: string, value: any) {
    if (!RESERVED_WORDS.includes(key)) this[key] = value;
    return this;
  }

  resetCustomize(key: string) {
    if (!RESERVED_WORDS.includes(key)) {
      this[key] = undefined;
      delete this[key];
    }
    return this;
  }
}
