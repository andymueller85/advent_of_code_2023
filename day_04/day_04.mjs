import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const splitOnWS = str => str.split(/\s/g).filter(s => s !== '')

const partA = fileName =>
  parseInput(fileName).reduce((acc, rawRow) => {
    const [rawCard, rawWinningNumbers] = rawRow.split(' | ')
    const [_, rawTicketNumbers] = rawCard.split(': ')
    const parsedTicketNumbers = splitOnWS(rawTicketNumbers)
    const parsedWinningNumbers = splitOnWS(rawWinningNumbers)
    const winners = parsedTicketNumbers.filter(num => parsedWinningNumbers.includes(num))

    return acc + Math.floor(2 ** (winners.length - 1))
  }, 0)

const partB = fileName => {
  const rawRows = parseInput(fileName)

  const ticketMap = {}
  for (let i = 1; i <= rawRows.length; i++) {
    ticketMap[i] = { numCards: 1, winners: 0 }
  }

  rawRows.forEach(rawRow => {
    const [rawCard, rawWinningNumbers] = rawRow.split(' | ')
    const [rawCardNumber, rawTicketNumbers] = rawCard.split(': ')
    const parsedTicketNumbers = splitOnWS(rawTicketNumbers)
    const parsedWinningNumbers = splitOnWS(rawWinningNumbers)
    const winners = parsedTicketNumbers.filter(num => parsedWinningNumbers.includes(num))
    const cardNumber = parseInt(splitOnWS(rawCardNumber)[1])

    ticketMap[cardNumber].winners = winners.length
    for (let i = cardNumber + 1; i <= cardNumber + winners.length; i++) {
      ticketMap[i].numCards += ticketMap[cardNumber].numCards
    }
  })
  return Object.values(ticketMap).reduce((acc, cur) => acc + cur.numCards, 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_04/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_04/input.txt'))
}

process('A', 13, partA)
process('B', 30, partB)
