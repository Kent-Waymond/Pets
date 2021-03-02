import { CommonComponentStates } from '../_common/variable';

export type ComputeClassesType = {
  [key: string]: boolean;
};
// 根据type生成class 数组
export function ComputeTypeClasses(
  prefix: string,
  suffix?: string,
  type?: string,
  types?: string[],
): ComputeClassesType[] {
  const classes: ComputeClassesType[] = [];
  if (type) {
    const typesArr = types instanceof Array ? types : CommonComponentStates;
    for (let item of typesArr) {
      if (item === 'default') {
        continue;
      } else {
        const classitem: ComputeClassesType = {};
        let typeclassname = prefix ? `${prefix}-${item}` : item;
        typeclassname = suffix ? `${typeclassname}-${suffix}` : typeclassname;
        classitem[typeclassname] = item === type;
        classes.push(classitem);
      }
    }
  }

  return classes;
}
