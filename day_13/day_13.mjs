import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n\r?\n/)
    .map(p =>
      p
        .split(/\r?\n/)
        .filter(d => d)
        .map(r => r.split(''))
    )

const arrEqual = (a, b) => a.every((v, i) => v === b[i])

const isReflection = (a, b) => {
  const reversedA = a.slice().reverse()
  const shorterArr = a.length < b.length ? reversedA : b
  const longerArr = a.length >= b.length ? reversedA : b

  return shorterArr.every((v, i) => {
    return arrEqual(v, longerArr[i])
  })
}

const swapXY = grid =>
  Array.from({ length: grid[0].length }, (_, i) => i).map(c => grid.map(r => r[c]))

const findMirror = pattern => {
  for (let i = 1; i < pattern.length; i++) {
    const upperPattern = pattern.slice(0, i)
    const lowerPattern = pattern.slice(i)

    if (isReflection(upperPattern, lowerPattern)) {
      return i
    }
  }

  return 0
}

const partA = fileName => {
  const patterns = parseInput(fileName)

  return patterns.reduce((acc, pattern, i, arr) => {
    const horizontalMirror = findMirror(pattern)
    const verticalMirror = findMirror(swapXY(pattern))
    return acc + horizontalMirror * 100 + verticalMirror
  }, 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_13/sample_input.txt', fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_13/input.txt', fn))
}

process('A', 405, partA)
