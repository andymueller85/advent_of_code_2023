import * as fs from 'fs'

const parseInput = fileName => fs.readFileSync(fileName, 'utf8').trim().split(',')

const partA = fileName =>
  parseInput(fileName).reduce((acc, cur) => {
    let val = 0

    cur.split('').forEach(char => {
      val += char.charCodeAt(0)
      val *= 17
      val %= 256
    })

    return acc + val
  }, 0)

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_15/sample_input.txt', fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_15/input.txt', fn))
}

process('A', 1320, partA)
