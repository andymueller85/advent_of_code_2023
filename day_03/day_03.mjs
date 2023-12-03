import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const isSymbol = char => char !== '.' && isNaN(parseInt(char))
const isDigit = char => !isNaN(parseInt(char))

const isPartNumber = (grid, rowNum, numberIndecies) => {
  // numberIndecies: [2, 3, 4]}
  const gridWidth = grid[0].length
  const gridHeight = grid.length

  if (rowNum !== 0) {
    // check row above
    for (let i = numberIndecies[0] - 1; i <= numberIndecies[numberIndecies.length - 1] + 1; i++) {
      if (i >= 0 && i < gridWidth && isSymbol(grid[rowNum - 1][i])) {
        return true
      }
    }
  }

  if (rowNum !== gridHeight - 1) {
    // check row below
    for (let i = numberIndecies[0] - 1; i <= numberIndecies[numberIndecies.length - 1] + 1; i++) {
      if (i >= 0 && i < gridWidth && isSymbol(grid[rowNum + 1][i])) {
        return true
      }
    }
  }

  if (!numberIndecies.includes(0)) {
    // check left
    if (isSymbol(grid[rowNum][numberIndecies[0] - 1])) {
      return true
    }
  }

  if (!numberIndecies.includes(gridWidth - 1)) {
    // check right
    if (isSymbol(grid[rowNum][numberIndecies[numberIndecies.length - 1] + 1])) {
      return true
    }
  }

  return false
}

const partA = fileName => {
  const rawRows = parseInput(fileName)
  const schematic = rawRows.map(rawRow => rawRow.split(''))

  return schematic.reduce((rowAcc, curRow, rowI) => {
    let onANumber = false
    let curNumber = ''
    let numbers = []
    let numberIndecies = []

    curRow.forEach((val, colI) => {
      // find numbers and their coordinates
      if (!onANumber) {
        if (isDigit(val)) {
          // this is the first digit of a new number
          onANumber = true
          curNumber += val
          numberIndecies.push(colI)
        }
      } else {
        // we're on a number, at least in the previous iteration
        if (isDigit(val)) {
          numberIndecies.push(colI)
          curNumber += val
          if (colI === curRow.length - 1) {
            // we're on a number touching the end of the row
            numbers.push({ number: parseInt(curNumber), numberIndecies })
          }
        } else {
          // the previous iteration ended a number
          onANumber = false
          numbers.push({ number: parseInt(curNumber), numberIndecies })
          numberIndecies = []
          curNumber = ''
        }
      }
    })

    const rowSum = numbers.reduce((acc, cur) => {
      return acc + (isPartNumber(schematic, rowI, cur.numberIndecies) ? parseInt(cur.number) : 0)
    }, 0)

    return rowAcc + rowSum
  }, 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_03/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_03/input.txt'))
}

process('A', 4361, partA)
