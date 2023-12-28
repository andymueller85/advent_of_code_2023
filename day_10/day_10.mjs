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

const findFirstConnection = (grid, r, c) => {
  const north = r > 0 ? grid[r - 1][c].pipe : '.'
  if (pipeMap[north] && pipeMap[north].includes('S')) return { row: r - 1, col: c, cameFrom: 'S' }
  const east = c < grid[r].length - 1 ? grid[r][c + 1].pipe : '.'
  if (pipeMap[east] && pipeMap[east].includes('W')) return { row: r, col: c + 1, cameFrom: 'W' }
  const south = r < grid.length - 1 ? grid[r + 1][c].pipe : '.'
  if (pipeMap[south] && pipeMap[south].includes('N')) return { row: r + 1, col: c, cameFrom: 'N' }
  const west = c > 0 ? grid[r][c - 1].pipe : '.'
  if (pipeMap[west] && pipeMap[west].includes('E')) return { row: r, col: c - 1, cameFrom: 'E' }
}

const getPipeShape = (grid, r, c) => {
  const connections = []
  const north = r > 0 ? grid[r - 1][c].pipe : '.'
  if (pipeMap[north] && pipeMap[north].includes('S')) connections.push('N')
  const east = c < grid[r].length - 1 ? grid[r][c + 1].pipe : '.'
  if (pipeMap[east] && pipeMap[east].includes('W')) connections.push('E')
  const south = r < grid.length - 1 ? grid[r + 1][c].pipe : '.'
  if (pipeMap[south] && pipeMap[south].includes('N')) connections.push('S')
  const west = c > 0 ? grid[r][c - 1].pipe : '.'
  if (pipeMap[west] && pipeMap[west].includes('E')) connections.push('W')

  if (connections.length !== 2) throw new Error('ruh roh')

  return Object.entries(pipeMap).find(([_, v]) => connections.every(c => v.includes(c)))[0]
}

const partA = fileName => {
  const grid = parseInput(fileName)
  const startRow = grid.findIndex(r => r.some(({ pipe }) => pipe === 'S'))
  const startCol = grid[startRow].findIndex(({ pipe }) => pipe === 'S')
  let { row, col, cameFrom } = findFirstConnection(grid, startRow, startCol)
  let stepCount = 1

  while (grid[row][col].pipe !== 'S') {
    let nextDir = pipeMap[grid[row][col].pipe].find(e => e !== cameFrom)
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

const getNorthNodes = (grid, row, col) => {
  return grid.slice(0, row).map((_, rowI, subGrid) => subGrid[rowI][col])
}
const getSouthNodes = (grid, row, col) => {
  return grid.slice(row + 1).map((_, rowI, subGrid) => subGrid[rowI][col])
}
const getWestNodes = (grid, row, col) => {
  return grid[row].slice(0, col)
}
const getEastNodes = (grid, row, col) => {
  return grid[row].slice(col + 1)
}

const getNSCrossingsCount = nodes => {
  let crossingsCount = 0
  crossingsCount += nodes.filter(({ pipe, isInLoop }) => isInLoop && pipe === '-').length

  const westBends = nodes.filter(
    ({ pipe, isInLoop }) => isInLoop && pipe !== '-' && pipeMap[pipe].includes('W')
  ).length
  const eastBends = nodes.filter(
    ({ pipe, isInLoop }) => isInLoop && pipe !== '-' && pipeMap[pipe].includes('E')
  ).length
  crossingsCount += Math.min(westBends, eastBends)

  return crossingsCount
}

const getEWCrossingsCount = nodes => {
  let crossingsCount = 0
  crossingsCount += nodes.filter(({ pipe, isInLoop }) => isInLoop && pipe === '|').length

  const northBends = nodes.filter(
    ({ pipe, isInLoop }) => isInLoop && pipe !== '|' && pipeMap[pipe].includes('N')
  ).length
  const southBends = nodes.filter(
    ({ pipe, isInLoop }) => isInLoop && pipe !== '|' && pipeMap[pipe].includes('S')
  ).length
  crossingsCount += Math.min(northBends, southBends)

  return crossingsCount
}

const isInsideLoop = (grid, row, col) => {
  if (grid[row][col].isInLoop) return false

  const northNodes = getNorthNodes(grid, row, col)
  const northMightBeInLoop = getNSCrossingsCount(northNodes) % 2 !== 0

  const southNodes = getSouthNodes(grid, row, col)
  const southMightBeInLoop = getNSCrossingsCount(southNodes) % 2 !== 0

  const westNodes = getWestNodes(grid, row, col)
  const westMightBeInLoop = getEWCrossingsCount(westNodes) % 2 !== 0

  const eastNodes = getEastNodes(grid, row, col)
  const eastMightBeInLoop = getEWCrossingsCount(eastNodes) % 2 !== 0

  const retval = northMightBeInLoop && southMightBeInLoop && westMightBeInLoop && eastMightBeInLoop
  return retval
}

const partB = fileName => {
  const grid = parseInput(fileName)
  const startRow = grid.findIndex(r => r.some(({ pipe }) => pipe === 'S'))
  const startCol = grid[startRow].findIndex(({ pipe }) => pipe === 'S')
  grid[startRow][startCol].isInLoop = true
  let { row, col, cameFrom } = findFirstConnection(grid, startRow, startCol)
  let stepCount = 1

  while (grid[row][col].pipe !== 'S') {
    grid[row][col].isInLoop = true
    let nextDir = pipeMap[grid[row][col].pipe].find(e => e !== cameFrom)
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

  // convert S to pipe
  grid[startRow][startCol] = getPipeShape(grid, startRow, startCol)

  return grid.reduce((rowAcc, curRow, curRowI) => {
    return (
      rowAcc +
      curRow.reduce((colAcc, _, curColI) => {
        return colAcc + (isInsideLoop(grid, curRowI, curColI) ? 1 : 0)
      }, 0)
    )
  }, 0)
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
