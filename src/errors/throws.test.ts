export{}
const { describe, it } = require('mocha')
const { expect, assert } = require('chai')

const errors = require('.')
const LaTeXElement = require('../elements').LaTeXElement

describe('throws', () => {
  const throws = errors.throws

  describe('typeError', () => {
    const test = (value: any, type: any, notType: any) => {
      it(`throws a TypeError because ${value} is not instance of Number`, () => {
        expect(() => throws.typeError(value, notType)).to.throw(errors.TypeError)
      })
    
      it(`does not throw because ${value} is an instance of provided ${type}`, () => {
        expect(() => throws.typeError(value, type)).not.to.throw()
      })
    }
  
    describe('Number', () => {
      test(1, Number, String)
    })
  
    describe('String', () => {
      test('abc', String, Number)
    })
  
    describe('Array', () => {
      test(['test', 123], Array, Number)
    })
  
    describe('Date', () => {
      test(new Date(), Date, Number)
    })
  
    describe('LaTeXElement', () => {
      test(new LaTeXElement('foo'), LaTeXElement, Number)
    })
  })
})
