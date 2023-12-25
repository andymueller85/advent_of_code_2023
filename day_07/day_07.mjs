import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(l => l.split(' '))
    .map(([hand, rank]) => [hand.split(''), parseInt(rank)])

const getKey = (hand, card, cardName) =>
  hand.some(c => c === card) && { [cardName]: hand.filter(c => c === card).length }

const ranks = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  9: 8,
  8: 7,
  7: 6,
  6: 5,
  5: 4,
  4: 3,
  3: 2,
  2: 1
}

const getCounts = hand => ({
  ...getKey(hand, 'A', 'aces'),
  ...getKey(hand, 'K', 'kings'),
  ...getKey(hand, 'Q', 'queens'),
  ...getKey(hand, 'J', 'jacks'),
  ...getKey(hand, 'T', 'tens'),
  ...getKey(hand, '9', 'nines'),
  ...getKey(hand, '8', 'eights'),
  ...getKey(hand, '7', 'sevens'),
  ...getKey(hand, '6', 'sixes'),
  ...getKey(hand, '5', 'fives'),
  ...getKey(hand, '4', 'fours'),
  ...getKey(hand, '3', 'threes'),
  ...getKey(hand, '2', 'twos')
})

// Five of a kind, where all five cards have the same label: AAAAA
// Four of a kind, where four cards have the same label and one card has a different label: AA8AA
// Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
// Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
// Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
// One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
// High card, where all cards' labels are distinct: 23456

const isFiveOfAKind = hand => Object.keys(getCounts(hand)).length === 1

const isFourOfAKind = hand => {
  const counts = getCounts(hand)
  return Object.keys(counts).length === 2 && Object.values(counts).some(v => v === 4)
}

const isFullHouse = hand => {
  const counts = getCounts(hand)
  return (
    Object.keys(counts).length === 2 &&
    Object.values(counts).some(v => v === 3) &&
    Object.values(counts).some(v => v === 2)
  )
}

const isThreeOfAKind = hand => {
  const counts = getCounts(hand)
  return (
    Object.keys(counts).length === 3 &&
    Object.values(counts).some(v => v === 3) &&
    Object.values(counts).some(v => v === 1)
  )
}

const isTwoPair = hand => {
  const counts = getCounts(hand)
  return Object.keys(counts).length === 3 && Object.values(counts).filter(v => v === 2).length === 2
}

const isPair = hand => Object.keys(getCounts(hand)).length === 4

const isHighCard = hand => Object.keys(getCounts(hand)).length === 5

const sortFn = ([handA], [handB]) => {
  const index = handA.findIndex((card, i) => card !== handB[i])
  return ranks[handA[index]] - ranks[handB[index]]
}

const partA = fileName => {
  const hands = parseInput(fileName)
  return [
    ...hands.filter(([hand]) => isHighCard(hand)).sort(sortFn),
    ...hands.filter(([hand]) => isPair(hand)).sort(sortFn),
    ...hands.filter(([hand]) => isTwoPair(hand)).sort(sortFn),
    ...hands.filter(([hand]) => isThreeOfAKind(hand)).sort(sortFn),
    ...hands.filter(([hand]) => isFullHouse(hand)).sort(sortFn),
    ...hands.filter(([hand]) => isFourOfAKind(hand)).sort(sortFn),
    ...hands.filter(([hand]) => isFiveOfAKind(hand)).sort(sortFn)
  ].reduce((acc, cur, i) => acc + cur[1] * (i + 1), 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_07/sample_input.txt', fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_07/input.txt', fn))
}

process('A', 6440, partA)
