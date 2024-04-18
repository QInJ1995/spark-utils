import { momentToString } from './momentToString';
export default function momentArrayToStringArray(value, valueFormat) {
    return value.map(val => {
        // @ts-ignore
        return momentToString(val, valueFormat);
    });
}
export { momentArrayToStringArray };
