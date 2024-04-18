import { moment } from './getMoment';
export default function stringToMoment(value, valueFormat) {
    return value
        ? moment(value, valueFormat)
        : null;
}
export { stringToMoment };
