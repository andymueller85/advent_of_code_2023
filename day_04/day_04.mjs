import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const partA = fileName =>
  parseInput(fileName).reduce((acc, rawRow) => {
    const [rawCard, rawWinningNumbers] = rawRow.split(' | ')
    const [_, rawTicketNumbers] = rawCard.split(': ')
    const parsedTicketNumbers = rawTicketNumbers.replaceAll('  ', ' ').split(' ')
    const parsedWinningNumbers = rawWinningNumbers.replaceAll('  ', ' ').split(' ')
    const winners = parsedTicketNumbers.filter(num => parsedWinningNumbers.includes(num))

    return acc + Math.floor(2 ** (winners.length - 1))
  }, 0)

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_04/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_04/input.txt'))
}

process('A', 13, partA)
// process('B', 467835, partB)
