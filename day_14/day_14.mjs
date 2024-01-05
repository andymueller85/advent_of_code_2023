import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => r.split(''))

const columnLoad = col => {
  let columnLoad = 0

  const sections = col
    .join('')
    .split('#')
    .map(s => s.split(''))

  sections.forEach((section, sectionI) => {
    if (section.includes('O')) {
      const idx = section.findIndex(s => s !== 'O')
      const stoneCount = idx === -1 ? section.length : idx
      const firstIndex =
        sectionI === 0
          ? 0
          : sections.reduce((acc, cur, i) => acc + (i < sectionI ? cur.length : 0), 0) + sectionI

      for (let i = 0; i < stoneCount; i++) {
        columnLoad += col.length - (firstIndex + i)
      }
    }
  })

  return columnLoad
}

const calculateLoad = grid => {
  return swapXY(grid).reduce((acc, cur) => {
    return acc + columnLoad(cur)
  }, 0)
}

const swapXY = grid =>
  Array.from({ length: grid[0].length }, (_, i) => i).map(c => grid.map(r => r[c]))

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

const partA = fileName => calculateLoad(rollNorth(parseInput(fileName)))

const partB = fileName => {
  let grid = parseInput(fileName)

  for (let i = 0; i < 1000000000; i++) {
    grid = rollNorth(grid)
    grid = rollWest(grid)
    grid = rollSouth(grid)
    grid = rollEast(grid)

    if (i % 10000000 === 0) {
      console.log('index', i)
      grid.forEach(r => console.log(r.join('')))
      console.log('load', calculateLoad(grid))
      console.log('\n')
    }
  }

  return calculateLoad(grid)
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
