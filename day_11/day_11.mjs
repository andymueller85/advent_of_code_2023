import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(l => l.split(''))

const getGalaxyCoordinates = grid => {
  const coordinates = []
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '#') coordinates.push([r, c])
    }
  }
  return coordinates
}

const getDistance = (a, b, grid, expansionFactor) => {
  const reducer = (acc, cur) => acc + (cur.every(s => s === '.') ? expansionFactor : 1)
  const vertDistance = grid.slice(a[0] + 1, b[0] + 1).reduce(reducer, 0)

  const start = Math.min(a[1], b[1]) + 1
  const end = Math.max(a[1], b[1]) + 1

  const horDistance = grid[0]
    .slice(start, end)
    .map((_, cIndex) => grid.map((_, rIndex) => grid[rIndex][cIndex + start]))
    .reduce(reducer, 0)

  return vertDistance + horDistance
}

const getDistances = (coordinates, expansionFactor, grid) =>
  coordinates.slice(1).reduce((acc, cur) => {
    return acc + getDistance(coordinates[0], cur, grid, expansionFactor)
  }, 0)

const caclulateCosmicExpansion = (fileName, expansionFactor) => {
  const grid = parseInput(fileName)

  return getGalaxyCoordinates(grid).reduce(
    (acc, _, i, arr) => acc + getDistances(arr.slice(i), expansionFactor, grid),
    0
  )
}

const process = (part, expectedAnswer, expansionFactor) => {
  const sampleAnswer = caclulateCosmicExpansion('./day_11/sample_input.txt', expansionFactor)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(
    `part ${part} real answer`,
    caclulateCosmicExpansion('./day_11/input.txt', expansionFactor)
  )
}

process('A', 374, 2)
process('B', 82000210, 1000000)
