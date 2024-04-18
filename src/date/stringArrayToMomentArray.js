import { stringToMoment } from './stringToMoment';
export default function stringArrayToMomentArray(value, valueFormat) {
    return value.map(val => stringToMoment(val, valueFormat));
}
export { stringArrayToMomentArray };
