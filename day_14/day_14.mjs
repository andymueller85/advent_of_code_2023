import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => r.split(''))

const shiftNorth = col => {
  let cursor = 0
  let nextCubePos = col.findIndex(a => a === '#')
  if (nextCubePos === -1) {
    nextCubePos = col.length
  }
  let columnLoad = 0
  let go = true
  let lastTime = false

  while (go) {
    if (lastTime) go = false
    const roundStoneCount = col.slice(cursor, nextCubePos).filter(a => a === 'O').length

    for (let i = 0; i < roundStoneCount; i++) {
      columnLoad += col.length - cursor - i
    }

    const nextCubeOffset = col.slice(nextCubePos + 1).findIndex(a => a === '#')

    cursor = nextCubePos + 1
    if (nextCubeOffset === -1) {
      nextCubePos = col.length
      lastTime = true
    } else {
      nextCubePos += 1 + nextCubeOffset
    }
  }

  return columnLoad
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
