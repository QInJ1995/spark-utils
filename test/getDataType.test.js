import getDataType from '../src/getDataType.js'

test('getDataType(2)===number', () => {
    expect(getDataType(2)).toBe("number")
})

test('getDataType({a:1})===object', () => {
    expect(getDataType({a:1})).toBe("object")
})

test('getDataType([1,2,3])===array', () => {
    expect(getDataType([1,2,3])).toBe("array")
})