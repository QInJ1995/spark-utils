import staticStrUndefined from './staticStrUndefined'
 
const staticLocation = typeof location === staticStrUndefined ? 0 : location

export default staticLocation
