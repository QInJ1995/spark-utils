import staticStrUndefined from './staticStrUndefined'
 
var staticDocument = typeof document === staticStrUndefined ? 0 : document

export default staticDocument
