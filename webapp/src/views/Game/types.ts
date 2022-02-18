export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export type ClientData = {
  [key: string]: string;
};
