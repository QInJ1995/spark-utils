export default function isIE() {
   
    // @ts-ignore
  return !!window.ActiveXObject || 'ActiveXObject' in window;
}
export { isIE, };
