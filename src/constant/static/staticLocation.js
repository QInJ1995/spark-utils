import staticStrUndefined from './staticStrUndefined'
 
var staticLocation = typeof location === staticStrUndefined ? 0 : location

export default staticLocation
