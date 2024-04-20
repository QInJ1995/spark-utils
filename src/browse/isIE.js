export default function isIE() {
    // eslint-disable-next-line
    // @ts-ignore
    return !!window.ActiveXObject || 'ActiveXObject' in window;
}
export { isIE };
