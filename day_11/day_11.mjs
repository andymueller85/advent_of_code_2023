import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(l => l.split(''))

const swapXY = grid => grid[0].map((_, i) => grid.map(r => r[i]))

const expandRows = grid => {
  let expandedGrid = []
  grid.forEach(r => {
    expandedGrid.push(r)
    if (r.every(s => s === '.')) expandedGrid.push(r)
  })
  return expandedGrid
}

const getGalaxyCoordinates = grid => {
  const coordinates = []
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '#') coordinates.push([r, c])
    }
  }
  return coordinates
}

const getDistance = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])

const getDistances = coordinates =>
  coordinates.slice(1).reduce((acc, cur) => acc + getDistance(coordinates[0], cur), 0)

const partA = fileName => {
  const grid = parseInput(fileName)
  const expandedGrid = swapXY(expandRows(swapXY(expandRows(grid))))
  const galaxies = getGalaxyCoordinates(expandedGrid)

  return galaxies.reduce((acc, _, i) => acc + getDistances(galaxies.slice(i)), 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_11/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_11/input.txt'))
}

process('A', 374, partA)
