import * as fs from 'fs'
import crypto from 'crypto'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => r.split(''))

const nextCoordinates = (dir, r, c, grid) => {
  switch (dir) {
    case 'E':
      if (c < grid[0].length - 1) {
        return [r, c + 1]
      }
      break
    case 'S':
      if (r < grid.length - 1) {
        return [r + 1, c]
      }
      break
    case 'W':
      if (c > 0) {
        return [r, c - 1]
      }
      break
    case 'N':
      if (r > 0) {
        return [r - 1, c]
      }
      break
  }
  return undefined
}

const nextHeadings = (dir, char) => {
  switch (dir) {
    case 'E':
      switch (char) {
        case '/':
          return ['N']
        case '\\':
          return ['S']
        case '|':
          return ['N', 'S']
        default:
          return ['E']
      }
    case 'S':
      switch (char) {
        case '/':
          return ['W']
        case '\\':
          return ['E']
        case '-':
          return ['E', 'W']
        default:
          return ['S']
      }
    case 'W':
      switch (char) {
        case '/':
          return ['S']
        case '\\':
          return ['N']
        case '|':
          return ['N', 'S']
        default:
          return ['W']
      }
    case 'N':
      switch (char) {
        case '/':
          return ['E']
        case '\\':
          return ['W']
        case '-':
          return ['E', 'W']
        default:
          return ['N']
      }
  }
}

const partA = fileName => {
  const grid = parseInput(fileName)
  let paths = { [crypto.randomUUID()]: [{ dir: 'E', row: 0, col: -1 }] }
  const energizedTiles = []
  let energizedTilesLength = 0
  let nextEnergizedTilesLength = 1

  for (let count = 0; count <= 1 || nextEnergizedTilesLength > energizedTilesLength; count++) {
    energizedTilesLength = energizedTiles.length

    Object.entries(paths).forEach(([id, pathArr]) => {
      const { dir, row, col } = pathArr[pathArr.length - 1]
      if (
        row >= 0 &&
        col >= 0 &&
        !energizedTiles.some(
          ([curRow, curCol, curDir]) => row === curRow && col === curCol && dir === curDir
        )
      ) {
        energizedTiles.push([row, col, dir])
      }

      const next = nextCoordinates(dir, row, col, grid)
      if (next) {
        const [nextRow, nextCol] = next
        const nextDirs = nextHeadings(dir, grid[nextRow][nextCol])

        if (nextDirs.length > 1) {
          delete paths[id]
          paths[crypto.randomUUID()] = [{ dir: nextDirs[0], row: nextRow, col: nextCol }]
          paths[crypto.randomUUID()] = [{ dir: nextDirs[1], row: nextRow, col: nextCol }]
        } else if (
          !Object.values(paths).some(arr =>
            arr.some(p => p.dir === nextDirs[0] && p.row === nextRow && p.col === nextCol)
          )
        ) {
          paths[id].push({ dir: nextDirs[0], row: nextRow, col: nextCol })
        } else {
          delete paths[id]
        }
      } else {
        delete paths[id]
      }
    })

    nextEnergizedTilesLength = energizedTiles.length
    // count++
  }

  return grid.reduce(
    (outerAcc, r, rI) =>
      outerAcc +
      r.reduce(
        (innerAcc, _, cI) =>
          innerAcc + (energizedTiles.some(t => t[0] === rI && t[1] === cI) ? 1 : 0),
        0
      ),
    0
  )
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_16/sample_input.txt', fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_16/input.txt', fn))
}

process('A', 46, partA)
