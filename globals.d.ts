declare module '*.txt' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default string
}

declare module '*.jpg' {
  const content: string
  export default string
}

declare module '*.jpeg' {
  const content: string
  export default string
}

declare module '*.svg' {
  const content: React.StatelessComponent<React.SVGAttributes<SVGAElement>>
  export default content
}

declare module '*.scss' {
  const content: { [key: string]: string }
  export default content
}

declare interface ObjectConstructor {
  keys<T, K extends keyof T>(o: T): K[]
  entries<T, K extends keyof T>(o: { [s in K]: T[K] }): [K, T[K]][]
}