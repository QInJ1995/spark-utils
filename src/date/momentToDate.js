/**
 * moment转换为date
 * @returns {Date}
 * @param momentVal
 */
export default function momentToDate(momentVal) {
    // @ts-ignore
    return momentVal.utc(false).toDate();
}
export { momentToDate };
