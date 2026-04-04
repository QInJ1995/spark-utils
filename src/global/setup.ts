import setupDefaults from '../constant/setup/setupDefaults' 
import assign from '../object/assign'

function setup (options) {
  return assign(setupDefaults, options)
}

export default setup