import staticStrUndefined from './staticStrUndefined'
 
const staticWindow = typeof window === staticStrUndefined ? 0 : window

export default staticWindow
