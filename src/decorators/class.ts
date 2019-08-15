export const seal = (constructor: Function) => {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}
