function helperCreateTreeFunc (handle) {
  return function (obj, iterate, options, context) {
    const opts = options || {}
    const optChildren = opts.children || 'children'
    return handle(null, obj, iterate, context, [], [], optChildren, opts)
  }
}

export default helperCreateTreeFunc
