import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(l => {
      const [damaged, info] = l.split(' ')
      return { damaged: damaged.split(''), info: info.split(',').map(i => parseInt(i)) }
    })

const fitsPattern = (testStrArr, pattern) => {
  let groups = []

  let hashCount = 0
  testStrArr.forEach(char => {
    if (char !== '#' && hashCount > 0) {
      groups.push(hashCount)
      hashCount = 0
    } else if (char === '#') hashCount++
  })
  if (hashCount > 0) groups.push(hashCount)

  return groups.length === pattern.length && groups.every((g, i) => g === pattern[i])
}

const partA = fileName => {
  const input = parseInput(fileName)

  return input.reduce((acc, cur) => {
    const { damaged, info } = cur
    const qCount = damaged.filter(d => d === '?').length

    let iterationCount = 0
    for (let i = 0; i < 2 ** qCount; i++) {
      const binary = i.toString(2).padStart(qCount, '0').split('')

      let binaryIndex = 0
      const testStrArr = damaged.map(c => {
        if (c !== '?') return c

        binaryIndex++
        return binary[binaryIndex - 1] === '0' ? '.' : '#'
      })

      if (fitsPattern(testStrArr, info)) iterationCount++
    }
    return acc + iterationCount
  }, 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_12/sample_input.txt', fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_12/input.txt', fn))
}

process('A', 21, partA)
