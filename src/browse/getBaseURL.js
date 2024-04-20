import staticLocation from '../constant/static/staticLocation'
import helperGetLocatOrigin from '../helpers/helperGetLocatOrigin'
import lastIndexOf from '../array/lastIndexOf'

function getBaseURL () {
  if (staticLocation) {
    var pathname = staticLocation.pathname
    var lastIndex = lastIndexOf(pathname, '/') + 1
    return helperGetLocatOrigin() + (lastIndex === pathname.length ? pathname : pathname.substring(0, lastIndex))
  }
  return ''
}

export default getBaseURL
