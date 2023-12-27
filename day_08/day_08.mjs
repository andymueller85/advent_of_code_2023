import * as fs from 'fs'

const parseInput = fileName => {
  const [rawLeftRight, rawMap] = fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n\r?\n/)
    .filter(d => d)

  const map = rawMap
    .split(/\r?\n/)
    .filter(d => d)
    .reduce((acc, cur) => {
      const [key, rawVals] = cur.split(' = ')
      const [rawLeft, rawRight] = rawVals.split(', ')

      return {
        ...acc,
        [key]: { L: rawLeft.replace('(', ''), R: rawRight.replace(')', '') }
      }
    }, {})

  return { leftRightArr: rawLeftRight.split(''), map }
}

const partA = fileName => {
  const { leftRightArr, map } = parseInput(fileName)
  let i = 0
  let nextKey = 'AAA'

  for (; nextKey !== 'ZZZ'; i++) {
    nextKey = map[nextKey][leftRightArr[i % leftRightArr.length]]
  }

  return i
}

const partBSlow = fileName => {
  // brute force - has to go through 12 trillion iterations
  const { leftRightArr, map } = parseInput(fileName)
  let i = 0
  let nextKeys = Object.keys(map).filter(k => k.endsWith('A'))

  for (; nextKeys.some(k => !k.endsWith('Z')); i++) {
    nextKeys = nextKeys.map(nk => map[nk][leftRightArr[i % leftRightArr.length]])
  }

  return i
}

const partB2 = fileName => {
  // much faster. find LCM of each path's count
  const { leftRightArr, map } = parseInput(fileName)
  const gcd = (a, b) => (a > 0 ? gcd(b % a, a) : b)
  const lcm = (a, b) => (a * b) / gcd(a, b)
  const getCount = k => {
    let i = 0
    for (; !k.endsWith('Z'); i++) {
      k = map[k][leftRightArr[i % leftRightArr.length]]
    }
    return i
  }

  return Object.keys(map)
    .filter(k => k.endsWith('A'))
    .map(getCount)
    .reduce(lcm)
}

const process = (part, expectedAnswer, fn, sampleFile) => {
  const sampleAnswer = fn(sampleFile)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_08/input.txt'))
}

process('A', 2, partA, './day_08/sample_input.txt')
// process('BSlow', 6, partBSlow, './day_08/sample_input2.txt')
process('B', 6, partB2, './day_08/sample_input2.txt')
