import staticStrUndefined from './staticStrUndefined'
 
var staticWindow = typeof window === staticStrUndefined ? 0 : window

export default staticWindow
