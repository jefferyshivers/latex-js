export type Class<T = {}> = (typeof Function & {prototype: T});
