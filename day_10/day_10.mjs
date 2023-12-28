import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(l => l.split('').map(pipe => ({ pipe, isInLoop: false })))

const pipeMap = {
  '|': ['N', 'S'],
  '-': ['E', 'W'],
  L: ['N', 'E'],
  J: ['N', 'W'],
  7: ['S', 'W'],
  F: ['S', 'E']
}

const northNeighbor = (grid, r, c) => (r > 0 ? grid[r - 1][c].pipe : '.')
const eastNeighbor = (grid, r, c) => (c < grid[r].length - 1 ? grid[r][c + 1].pipe : '.')
const southNeighbor = (grid, r, c) => (r < grid.length - 1 ? grid[r + 1][c].pipe : '.')
const westNeighbor = (grid, r, c) => (c > 0 ? grid[r][c - 1].pipe : '.')
const isConnection = (pipe, dir) => pipeMap[pipe] && pipeMap[pipe].includes(dir)

const findFirstConnection = (grid, r, c) => {
  if (isConnection(northNeighbor(grid, r, c), 'S')) return { row: r - 1, col: c, cameFrom: 'S' }
  if (isConnection(eastNeighbor(grid, r, c), 'W')) return { row: r, col: c + 1, cameFrom: 'W' }
  if (isConnection(southNeighbor(grid, r, c), 'N')) return { row: r + 1, col: c, cameFrom: 'N' }
  if (isConnection(westNeighbor(grid, r, c), 'E')) return { row: r, col: c - 1, cameFrom: 'E' }
}

const getPipeShape = (grid, r, c) => {
  const connections = []
  if (isConnection(northNeighbor(grid, r, c), 'S')) connections.push('N')
  if (isConnection(eastNeighbor(grid, r, c), 'W')) connections.push('E')
  if (isConnection(southNeighbor(grid, r, c), 'N')) connections.push('S')
  if (isConnection(westNeighbor(grid, r, c), 'E')) connections.push('W')

  if (connections.length !== 2) throw new Error('ruh roh')

  return Object.entries(pipeMap).find(([_, v]) => connections.every(c => v.includes(c)))[0]
}

const getNorthNodes = (grid, row, col) =>
  grid.slice(0, row).map((_, rowI, subGrid) => subGrid[rowI][col])
const getSouthNodes = (grid, row, col) =>
  grid.slice(row + 1).map((_, rowI, subGrid) => subGrid[rowI][col])
const getWestNodes = (grid, row, col) => grid[row].slice(0, col)
const getEastNodes = (grid, row, col) => grid[row].slice(col + 1)

const makeFilterFn =
  (straightPipe, dir) =>
  ({ pipe, isInLoop }) =>
    isInLoop && pipe !== straightPipe && pipeMap[pipe].includes(dir)

const getNSCrossingsCount = nodes =>
  nodes.filter(({ pipe, isInLoop }) => isInLoop && pipe === '-').length +
  Math.min(nodes.filter(makeFilterFn('-', 'W')).length, nodes.filter(makeFilterFn('-', 'E')).length)

const getEWCrossingsCount = nodes =>
  nodes.filter(({ pipe, isInLoop }) => isInLoop && pipe === '|').length +
  Math.min(nodes.filter(makeFilterFn('|', 'N')).length, nodes.filter(makeFilterFn('|', 'S')).length)

const isOdd = val => val % 2 !== 0
const isInsideLoop = (grid, row, col) =>
  !grid[row][col].isInLoop &&
  isOdd(getNSCrossingsCount(getNorthNodes(grid, row, col))) &&
  isOdd(getNSCrossingsCount(getSouthNodes(grid, row, col))) &&
  isOdd(getEWCrossingsCount(getWestNodes(grid, row, col))) &&
  isOdd(getEWCrossingsCount(getEastNodes(grid, row, col)))

const getStartCoordinates = grid => {
  const startRow = grid.findIndex(r => r.some(({ pipe }) => pipe === 'S'))
  return { startRow, startCol: grid[startRow].findIndex(({ pipe }) => pipe === 'S') }
}

const makeLoop = (grid, row, col, cameFrom) => {
  let stepCount = 1

  while (grid[row][col].pipe !== 'S') {
    grid[row][col].isInLoop = true
    switch (pipeMap[grid[row][col].pipe].find(e => e !== cameFrom)) {
      case 'N':
        row--
        cameFrom = 'S'
        break
      case 'E':
        col++
        cameFrom = 'W'
        break
      case 'S':
        row++
        cameFrom = 'N'
        break
      case 'W':
        col--
        cameFrom = 'E'
        break
    }
    stepCount++
  }

  // convert S to pipe
  grid[row][col] = getPipeShape(grid, row, col)
  return stepCount
}

const partA = fileName => {
  const grid = parseInput(fileName)
  const { startRow, startCol } = getStartCoordinates(grid)
  const { row, col, cameFrom } = findFirstConnection(grid, startRow, startCol)

  return Math.ceil(makeLoop(grid, row, col, cameFrom) / 2)
}

const partB = fileName => {
  const grid = parseInput(fileName)
  const { startRow, startCol } = getStartCoordinates(grid)
  let { row, col, cameFrom } = findFirstConnection(grid, startRow, startCol)
  makeLoop(grid, row, col, cameFrom)

  return grid.reduce(
    (acc, curRow, curRowI) =>
      acc + curRow.filter((_, curColI) => isInsideLoop(grid, curRowI, curColI)).length,
    0
  )
}

const process = (part, expectedAnswer, fn, sampleInput) => {
  const sampleAnswer = fn(sampleInput, fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_10/input.txt', fn))
}

process('A', 4, partA, './day_10/sample_input.txt')
process('B', 10, partB, './day_10/sample_input2.txt')
