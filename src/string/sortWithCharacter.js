import { DescOrAsc } from './descOrAsc';
/**
 * 按拼音/字母排序
 * @param data
 * @param option
 */
export function sortWithCharacter(data, option = {
    locale: 'zh',
    rule: DescOrAsc.asc,
}) {
    var _a, _b;
    option.locale = (_a = option.locale) !== null && _a !== void 0 ? _a : 'zh';
    option.rule = (_b = option.rule) !== null && _b !== void 0 ? _b : DescOrAsc.asc;
    return data.sort((a, b) => {
        var _a;
        const result = a.toString().localeCompare(b.toString(), (_a = option.locale) !== null && _a !== void 0 ? _a : 'zh', { numeric: true, sensitivity: 'base' });
        if (option.rule === DescOrAsc.desc) {
            return 0 - result;
        }
        return result;
    });
}
export default sortWithCharacter;
