import { Field } from "./Field";

export type showConditionType = (context: any) => boolean;

export interface ContainerItemInterface {
  condition: showConditionType;
  prop: string;
  converter: (Field: Field) => void;
}

// 字段管理类
export class Fields {
  fields: Field[];
  containers: ContainerItemInterface[];
  showCondition: showConditionType;

  constructor(fields: Field[]) {
    this.fields = fields;
    this.containers = [];
    // 默认情况下展示
    this.showCondition = () => true;
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  // 显示控制
  setShowCondition(showCondition: showConditionType) {
    this.showCondition = showCondition;
    return this;
  }

  isShow(context: any) {
    return this.showCondition(context);
  }

  // 根据传入的condition函数判断是否改变字段
  registerChangeField({ condition, prop, converter }: ContainerItemInterface) {
    this.containers.push({
      condition,
      prop,
      converter,
    });
    return this;
  }

  // 对字段组进行处理,最终将数组里面的内容都变为field
  private allToField(
    fields: Field[],
    containers: ContainerItemInterface[],
    context: any
  ) {
    // 变为标准数组
    fields = [...fields];
    // 需要修改index,用for
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      // Fields内部支持塞入Fields,需要递归处理
      if (field instanceof Fields) {
        // 字段插入对应位置
        const innerFields = field.getFields(context);
        // 删除当前Fields位置,插入递归回来的field
        fields.splice(index, 1, ...innerFields);
        // 由于fields里面的field都被提取出来,需要更新下标位置
        index += innerFields.length - 1;
        // 收集每一个字段组里需要变更字段的信息
        containers = containers.concat(field.containers);
      }
    }
    return {
      fields: fields.filter((field) => field),
      containers,
    };
  }

  // 根据字段组里面收集的字段变更信息,对字段进行处理
  private transferField(
    field: Field,
    containers: ContainerItemInterface[],
    context: any
  ) {
    // 遍历变化容器,找出当前对应字段的所有变化,condition为条件,converter为变化调用的函数
    const transforms = containers
      .filter(({ prop }) => field.prop === prop)
      .filter(({ condition }) => condition(context))
      .map(({ converter }) => converter);
    if (transforms.length > 0) {
      // 克隆一份,防止原内容被改变
      field = field.clone();
      transforms.forEach((transform) => {
        // 传入参数,调用converter函数对field进行改变
        transform(field);
      });
    }
    return field;
  }

  // 主要方法
  getFields(context: any) {
    const { fields, containers } = this.allToField(
      this.fields.filter((field) => field.isShow(context)),
      this.containers,
      context
    );
    return (
      fields
        .map((field) => this.transferField(field, containers, context))
        // 对改变后的field字段再进行一次查看是否显示,改变时有可能修改了这个属性
        .filter((field) => field.isShow(context))
    );
  }
}
