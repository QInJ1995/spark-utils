export function formatWithReq(value, reqRule){
  return value.replace(reqRule.srcReq, reqRule.descReq)
}

export default formatWithReq
