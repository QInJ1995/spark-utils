import parseUrlParams from '../src/parseUrlParams.js'

test("parseUrlParams('wwww.adc.com?p1=1&p2=2') === {p1: 1, p2: 2}", () => {
    expect(parseUrlParams('wwww.adc.com?p1=1&p2=2')).toStrictEqual({ p1: '1', p2: '2' })
})

test("parseUrlParams() === {}", () => {
    expect(parseUrlParams()).toStrictEqual({})
})

test("parseUrlParams('wwww.adc.com&p1=1&p2=2) === {}", () => {
    expect(parseUrlParams('wwww.adc.com&p1=1&p2=2')).toStrictEqual({})
})