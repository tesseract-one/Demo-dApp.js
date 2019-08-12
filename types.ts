export type Nullable<T> = { [P in keyof T]: T[P] | null }
export interface IExample {
  title: string
  description: string
  content?: any
  tag: string
}

export interface INetwork {
  name: string
  endpoint: string
}