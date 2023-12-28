import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(l => l.split(''))

const pipeMap = {
  '|': ['N', 'S'],
  '-': ['E', 'W'],
  L: ['N', 'E'],
  J: ['N', 'W'],
  7: ['S', 'W'],
  F: ['S', 'E']
}

const findFirstConnection = (grid, r, c) => {
  const north = grid[r - 1][c]
  if (pipeMap[north] && pipeMap[north].includes('S')) return { row: r - 1, col: c, cameFrom: 'S' }
  const east = grid[r][c + 1]
  if (pipeMap[east] && pipeMap[east].includes('W')) return { row: r, col: c + 1, cameFrom: 'W' }
  const south = grid[r + 1][c]
  if (pipeMap[south] && pipeMap[south].includes('N')) return { row: r + 1, col: c, cameFrom: 'N' }
  const west = grid[r][c - 1]
  if (pipeMap[west] && pipeMap[west].includes('E')) return { row: r, col: c - 1, cameFrom: 'E' }
}

const partA = fileName => {
  const grid = parseInput(fileName)
  const startRow = grid.findIndex(r => r.includes('S'))
  const startCol = grid[startRow].findIndex(c => c === 'S')
  let { row, col, cameFrom } = findFirstConnection(grid, startRow, startCol)
  let stepCount = 1

  while (grid[row][col] !== 'S') {
    let nextDir = pipeMap[grid[row][col]].find(e => e !== cameFrom)
    if (nextDir === 'N') {
      row--
      cameFrom = 'S'
    } else if (nextDir === 'E') {
      col++
      cameFrom = 'W'
    } else if (nextDir === 'S') {
      row++
      cameFrom = 'N'
    } else if (nextDir === 'W') {
      col--
      cameFrom = 'E'
    }
    stepCount++
  }

  return Math.ceil(stepCount / 2)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_10/sample_input.txt', fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_10/input.txt', fn))
}

process('A', 4, partA)
