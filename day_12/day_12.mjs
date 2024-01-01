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

const partA = fileName =>
  parseInput(fileName).reduce((acc, { damaged, info }) => {
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

const cache = {}
const trimStart = str =>
  str.startsWith('.')
    ? str
        .split(/(?<=\.)(?=[^.])/)
        .slice(1)
        .join('')
    : str

const findCombinations = (row, groups) => {
  const line = row + ' ' + groups.join(',')
  if (cache[line]) {
    return cache[line]
  }

  if (groups.length === 0) {
    return row.includes('#') ? 0 : 1
  }

  if (row.length - groups.reduce((a, b) => a + b) - groups.length + 1 < 0) {
    return 0
  }

  const damagedOrUnknown = !row.slice(0, groups[0]).includes('.')

  if (row.length === groups[0]) {
    return damagedOrUnknown ? 1 : 0
  }

  const count =
    (row[0] != '#' ? findCombinations(trimStart(row.slice(1)), groups) : 0) +
    (damagedOrUnknown && row[groups[0]] != '#'
      ? findCombinations(trimStart(row.slice(groups[0] + 1)), groups.slice(1))
      : 0)

  cache[line] = count

  return count
}

const partB = fileName => {
  const input = parseInput(fileName)

  const expandedInput = input.map(({ damaged, info }) => {
    let expandedDamaged = []
    let expandedInfo = []

    for (let i = 0; i < 5; i++) {
      expandedDamaged.push(...damaged)
      expandedInfo.push(...info)
      if (i < 4) {
        expandedDamaged.push('?')
      }
    }

    return { damaged: expandedDamaged, info: expandedInfo }
  })

  // shamelessly borrowed answer from https://github.com/hiimjustin000/advent-of-code/blob/master/2023/day12/part2.js
  return expandedInput.reduce((acc, { damaged, info }) => {
    return acc + findCombinations(damaged.join(''), info)
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

// process('A', 21, partA)
process('B', 525152, partB)
