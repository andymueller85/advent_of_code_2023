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

const partA = fileName => {
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

  const sortFn = ([handA], [handB]) => {
    const index = handA.findIndex((card, i) => card !== handB[i])
    return ranks[handA[index]] - ranks[handB[index]]
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
  const ranks = {
    A: 13,
    K: 12,
    Q: 11,
    T: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    4: 4,
    3: 3,
    2: 2,
    J: 1
  }

  const sortFn = ([handA], [handB]) => {
    const index = handA.findIndex((card, i) => card !== handB[i])
    return ranks[handA[index]] - ranks[handB[index]]
  }

  const getCounts = hand => ({
    ...getKey(hand, 'A', 'aces'),
    ...getKey(hand, 'K', 'kings'),
    ...getKey(hand, 'Q', 'queens'),
    ...getKey(hand, 'T', 'tens'),
    ...getKey(hand, '9', 'nines'),
    ...getKey(hand, '8', 'eights'),
    ...getKey(hand, '7', 'sevens'),
    ...getKey(hand, '6', 'sixes'),
    ...getKey(hand, '5', 'fives'),
    ...getKey(hand, '4', 'fours'),
    ...getKey(hand, '3', 'threes'),
    ...getKey(hand, '2', 'twos'),
    ...getKey(hand, 'J', 'jokers')
  })

  const isFiveOfAKind = hand => {
    const counts = getCounts(hand)
    const jokerCount = counts.jokers || 0
    const { jokers, ...countsWithoutJokers } = counts

    return jokerCount == 5 || Object.values(countsWithoutJokers).some(v => v + jokerCount === 5)
  }

  const isFourOfAKind = hand => {
    const counts = getCounts(hand)
    const jokerCount = counts.jokers || 0
    const { jokers, ...countsWithoutJokers } = counts
    const values = Object.values(countsWithoutJokers)

    return !isFiveOfAKind(hand) && values.some(v => v + jokerCount === 4)
  }

  const isFullHouse = hand => {
    const counts = getCounts(hand)
    const { jokers, ...countsWithoutJokers } = counts
    const keys = Object.keys(countsWithoutJokers)
    const values = Object.values(countsWithoutJokers)
    const jokerCount = counts.jokers || 0

    return (
      !isFiveOfAKind(hand) &&
      !isFourOfAKind(hand) &&
      ((jokerCount === 0 && values.some(v => v === 3) && values.some(v => v === 2)) ||
        (jokerCount > 0 && keys.length === 2))
    )
  }

  const isThreeOfAKind = hand => {
    const counts = getCounts(hand)
    const { jokers, ...countsWithoutJokers } = counts
    const values = Object.values(countsWithoutJokers)
    const jokerCount = counts.jokers || 0

    return (
      !isFullHouse(hand) &&
      !isFourOfAKind(hand) &&
      !isFiveOfAKind(hand) &&
      values.some(v => v + jokerCount === 3)
    )
  }

  const isTwoPair = hand => {
    const counts = getCounts(hand)
    const { jokers, ...countsWithoutJokers } = counts

    const values = Object.values(countsWithoutJokers)
    const jokerCount = counts.jokers || 0

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
    const { jokers, ...countsWithoutJokers } = counts
    const jokerCount = counts.jokers || 0

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
process('B', 5905, partB)
