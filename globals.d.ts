declare module "*.txt" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.scss" {
  const content: { [key: string]: string };
  export default content;
}

declare interface ObjectConstructor {
  keys<T, K extends keyof T>(o: T): K[]
  entries<T, K extends keyof T>(o: { [s in K]: T[K] }): [K, T[K]][]
}