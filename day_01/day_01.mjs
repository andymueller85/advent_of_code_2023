import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const isNumeric = n => !isNaN(parseInt(n))

const digits = [
  { name: '1', val: '1' },
  { name: '2', val: '2' },
  { name: '3', val: '3' },
  { name: '4', val: '4' },
  { name: '5', val: '5' },
  { name: '6', val: '6' },
  { name: '7', val: '7' },
  { name: '8', val: '8' },
  { name: '9', val: '9' },
  { name: '0', val: '0' },
  { name: 'one', val: '1' },
  { name: 'two', val: '2' },
  { name: 'three', val: '3' },
  { name: 'four', val: '4' },
  { name: 'five', val: '5' },
  { name: 'six', val: '6' },
  { name: 'seven', val: '7' },
  { name: 'eight', val: '8' },
  { name: 'nine', val: '9' },
  { name: 'zero', val: '0' }
]

const findDigit = (str, sortFn) =>
  digits
    .map(d => ({ digit: d.val, pos: str.indexOf(d.name) }))
    .filter(d => d.pos > -1)
    .sort(sortFn)[0].digit

const partA = fileName =>
  parseInput(fileName)
    .map(l => {
      const lineAsArr = l.split('')
      return parseInt(`${lineAsArr.find(isNumeric)}${lineAsArr.reverse().find(isNumeric)}`)
    })
    .reduce((acc, cur) => acc + cur, 0)

const partB = fileName =>
  parseInput(fileName)
    .map(l =>
      parseInt(`${findDigit(l, (a, b) => a.pos - b.pos)}${findDigit(l, (a, b) => b.pos - a.pos)}`)
    )
    .reduce((acc, cur) => acc + cur, 0)

const process = (part, sampleFile, expectedAnswer, fn) => {
  const sampleAnswer = fn(sampleFile)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_01/input.txt'))
}

process('A', './day_01/sample_input_a.txt', 142, partA)
process('B', './day_01/sample_input_b.txt', 281, partB)
