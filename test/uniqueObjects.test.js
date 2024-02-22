import uniqueObjects from '../src/uniqueObjects.js'

test("uniqueObjects([{a: 1, b: 3}, {a: 1}, {a: 2}], 'a') === [{a: 1, b: 3}, {a: 2}]", () => {
    expect(uniqueObjects([{a: 1, b: 3}, {a: 1}, {a: 2}], 'a')).toStrictEqual([{a: 1, b: 3}, {a: 2}])
})