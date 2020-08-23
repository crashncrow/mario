export function processArray(arr) {
  let result = []
  
  let c = 1
  arr.forEach((x, index, elements) => {
    if(x !== elements[index + 1]) {
      result.push({color: x, count: (c)})
      c = 1
    } else {
      c++
    }
  })

  return result
}

export function processFullArray(arr) {
  let fullResult = []

  arr.forEach((e) => {
    let result = []
    
    let c = 1
    e.forEach((x, index, elements) => {
      if(x !== elements[index + 1]) {
        result.push({color: x, count: (c)})
        c = 1
      } else {
        c++
      }
    })

    fullResult.push(result)
  })

  return fullResult
}