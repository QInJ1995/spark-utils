import { promiseResultHandle } from '../../index.js';

const promise = Promise.resolve({data: {resultData: []}, serviceSuccess: true, code: 200});

promiseResultHandle({promise,  resultKey: 'data.resultData', verifyConfig: {code: 200, serviceSuccess: true},}).then(res => {
    console.log("🚀 ~ promiseResultHandle ~ res:", res)
})
