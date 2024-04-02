import { promiseResultHandle, debounce, clone } from "../../dist/spark-utils";

(function() {
  // 克隆测试
  const deepCloneData = clone({ a: { b: [1, 2, 3, 4] }, c: '1', d: true }, true)
  console.log("🚀 ~ deepCloneData:", deepCloneData)

  return

  // 防抖测试
  const btn = document.querySelector("#btn");
  let onDebounce =  debounce(() => {
      console.log("🚀 ~ debounce ~ debounce:", "debounce执行了");
      onDebounce.cancel()
    }, 1000, true);
  btn.onclick = () => {
    onDebounce();
  };

  // promiseResultHandle 测试
  const promise = Promise.resolve({data: {resultData: []}, serviceSuccess: true, code: 200});
  promiseResultHandle({promise,  resultKey: 'data.resultData', verifyConfig: {code: 200, serviceSuccess: true},}).then(res => {
      console.log("🚀 ~ promiseResultHandle ~ res:", res)
  })

})()


