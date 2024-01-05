import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => r.split(''))

const columnLoad = col => col.reduce((acc, cur, i) => acc + (cur === 'O' ? col.length - i : 0), 0)

const calculateLoad = grid => swapXY(grid).reduce((acc, cur) => acc + columnLoad(cur), 0)

const swapXY = grid => Array.from({ length: grid[0].length }).map((_, i) => grid.map(r => r[i]))

const roll = col => {
  const sections = col
    .join('')
    .split('#')
    .map(s => s.split(''))

  const rolledSections = sections.map(s => {
    const stoneCount = s.filter(a => a === 'O').length
    return 'O'.repeat(stoneCount) + '.'.repeat(s.length - stoneCount)
  })

  return rolledSections.join('#').split('')
}

const rollNorth = grid => {
  let columns = []
  for (let i = 0; i < grid[0].length; i++) {
    columns.push(roll(grid.map(r => r[i])))
  }

  return swapXY(columns)
}

const rollEast = grid => grid.map(r => roll(r.reverse()).reverse())

const rollSouth = grid => {
  let columns = []
  for (let i = 0; i < grid[0].length; i++) {
    columns.push(roll(grid.map(r => r[i]).reverse()).reverse())
  }

  return swapXY(columns)
}

const rollWest = grid => grid.map(roll)

const rollGrid = grid => rollEast(rollSouth(rollWest(rollNorth(grid))))

const partA = fileName => calculateLoad(rollNorth(parseInput(fileName)))

const partB = fileName => {
  const ONE_BILLION = 1000000000
  const cache = {}
  let grid = parseInput(fileName)

  for (let i = 0; i < ONE_BILLION; i++) {
    grid = rollGrid(grid)
    const cacheKey = grid.flat().join('')

    if (cache[cacheKey]) {
      for (let j = 0; j < (ONE_BILLION - (j + 1)) % (i - cache[cacheKey]); j++) {
        grid = rollGrid(grid)
      }

      return calculateLoad(grid)
    }

    cache[cacheKey] = i
  }
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
process('B', 64, partB)
