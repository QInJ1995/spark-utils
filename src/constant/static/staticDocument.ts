import staticStrUndefined from './staticStrUndefined'
 
const staticDocument = typeof document === staticStrUndefined ? 0 : document

export default staticDocument
