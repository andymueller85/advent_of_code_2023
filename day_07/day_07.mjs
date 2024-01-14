import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(l => l.split(' '))
    .map(([hand, rank]) => [hand.split(''), parseInt(rank)])

const getKey = (hand, card) =>
  hand.some(c => c === card) && { [card]: hand.filter(c => c === card).length }

const sort =
  ranks =>
  ([handA], [handB]) => {
    const index = handA.findIndex((card, i) => card !== handB[i])
    return ranks[handA[index]] - ranks[handB[index]]
  }

const getCounts = hand => ({
  ...getKey(hand, 'A'),
  ...getKey(hand, 'K'),
  ...getKey(hand, 'Q'),
  ...getKey(hand, 'J'),
  ...getKey(hand, 'T'),
  ...getKey(hand, '9'),
  ...getKey(hand, '8'),
  ...getKey(hand, '7'),
  ...getKey(hand, '6'),
  ...getKey(hand, '5'),
  ...getKey(hand, '4'),
  ...getKey(hand, '3'),
  ...getKey(hand, '2')
})

const ranks = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2
}

const partA = fileName => {
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
    return (
      Object.keys(counts).length === 3 && Object.values(counts).filter(v => v === 2).length === 2
    )
  }

  const isPair = hand => Object.keys(getCounts(hand)).length === 4

  const isHighCard = hand => Object.keys(getCounts(hand)).length === 5

  const hands = parseInput(fileName)
  const sortFn = sort(ranks)

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

const partB = fileName => {
  const isFiveOfAKind = hand => {
    const counts = getCounts(hand)
    const { J, ...countsWithoutJokers } = counts
    const jokerCount = J || 0

    return jokerCount == 5 || Object.values(countsWithoutJokers).some(v => v + jokerCount === 5)
  }

  const isFourOfAKind = hand => {
    const counts = getCounts(hand)
    const { J, ...countsWithoutJokers } = counts
    const jokerCount = J || 0
    const values = Object.values(countsWithoutJokers)

    return !isFiveOfAKind(hand) && values.some(v => v + jokerCount === 4)
  }

  const isFullHouse = hand => {
    const counts = getCounts(hand)
    const { J, ...countsWithoutJokers } = counts
    const keys = Object.keys(countsWithoutJokers)
    const values = Object.values(countsWithoutJokers)
    const jokerCount = J || 0

    return (
      !isFiveOfAKind(hand) &&
      !isFourOfAKind(hand) &&
      ((jokerCount === 0 && values.some(v => v === 3) && values.some(v => v === 2)) ||
        (jokerCount > 0 && keys.length === 2))
    )
  }

  const isThreeOfAKind = hand => {
    const counts = getCounts(hand)
    const { J, ...countsWithoutJokers } = counts
    const values = Object.values(countsWithoutJokers)
    const jokerCount = J || 0

    return (
      !isFullHouse(hand) &&
      !isFourOfAKind(hand) &&
      !isFiveOfAKind(hand) &&
      values.some(v => v + jokerCount === 3)
    )
  }

  const isTwoPair = hand => {
    const counts = getCounts(hand)
    const { J, ...countsWithoutJokers } = counts
    const values = Object.values(countsWithoutJokers)
    const jokerCount = J || 0

    return (
      !isThreeOfAKind(hand) &&
      !isFullHouse(hand) &&
      !isFourOfAKind(hand) &&
      !isFiveOfAKind(hand) &&
      ((jokerCount === 0 && values.filter(v => v >= 2).length >= 2) ||
        (jokerCount === 1 && values.length <= 3) ||
        jokerCount >= 2)
    )
  }

  const isPair = hand => {
    const counts = getCounts(hand)
    const { J, ...countsWithoutJokers } = counts
    const jokerCount = J || 0

    return (
      !isTwoPair(hand) &&
      !isThreeOfAKind(hand) &&
      !isFullHouse(hand) &&
      !isFourOfAKind(hand) &&
      !isFiveOfAKind(hand) &&
      Object.values(countsWithoutJokers).some(v => v + jokerCount === 2)
    )
  }

  const isHighCard = hand =>
    !isPair(hand) &&
    !isTwoPair(hand) &&
    !isThreeOfAKind(hand) &&
    !isFullHouse(hand) &&
    !isFourOfAKind(hand) &&
    !isFiveOfAKind(hand)

  const hands = parseInput(fileName)
  const sortFn = sort({ ...ranks, J: 1 })

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
  const sampleAnswer = fn('./day_07/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_07/input.txt'))
}

process('A', 6440, partA)
process('B', 5905, partB)
