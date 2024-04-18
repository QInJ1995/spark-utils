import { moment } from './getMoment';
export default function momentToString(value, valueFormat) {
    // @ts-ignore
    return moment.isMoment(value) ? value.format(valueFormat) : value;
}
export { momentToString };
