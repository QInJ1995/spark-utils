export function formatWithIndex(value, indexRule){
  if(typeof value == 'undefined' || value == null){
    return ''
  }
  value = value.toString()
  const valueLength = value.length
  const values = value.split('')

  for(let j=0;j<indexRule.length;j++){
    let start = indexRule[j].start
    let stop = indexRule[j].stop

    if(valueLength < start){
      continue
    }

    start = start?start-1:0
    stop = stop?stop-1:values.length-1

    for(let i = start;i<valueLength && i <= stop;i++){
      values.splice(i, 1, '*')
    }
  }

  return values.join('')

}

export default formatWithIndex
