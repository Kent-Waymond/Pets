import { CommonComponentSizes, CommonComponentStates } from './variable';

// 通用state 用于控制组件type
export type ComponentStateType = typeof CommonComponentStates[number];
// 通用组件size 用于控制组件size
export type ComponentSizeType = typeof CommonComponentSizes[number];
