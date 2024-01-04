import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => r.split(''))

const shiftNorth = col => {
  const cubeIndexes = [-1]
  col.forEach((a, i) => {
    if (a === '#') cubeIndexes.push(i)
  })

  return cubeIndexes.reduce(
    (acc, cur, i, arr) =>
      acc +
      Array.from(
        { length: col.slice(Math.max(cur, 0), arr[i + 1]).filter(a => a === 'O').length },
        (_, i) => i
      ).reduce((a, b) => a + col.length - (cur + 1) - b, 0),
    0
  )
}

const partA = fileName => {
  const grid = parseInput(fileName)
  let totalLoad = 0
  for (let i = 0; i < grid[0].length; i++) {
    const columnLoad = shiftNorth(grid.map(r => r[i]))
    totalLoad += columnLoad
  }

  return totalLoad
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_14/sample_input.txt', fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_14/input.txt', fn))
}

process('A', 136, partA)
