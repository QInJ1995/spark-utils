/**
 * moment转换为date
 * @returns {Date}
 * @param momentVal
 */
export default function momentToDate(momentVal, isUtc = false) {
    // @ts-ignore
    return momentVal.utc(isUtc).toDate();
}
export { momentToDate };
