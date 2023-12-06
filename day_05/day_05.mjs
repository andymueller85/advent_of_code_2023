import * as fs from 'fs'

const parseInput = fileName => {
  const blocks = fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n\r?\n/)
    .filter(d => d)

  return {
    seeds: blocks[0].split(': ')[1].split(' '),
    maps: blocks.slice(1).map(block =>
      block
        .split(/\r?\n/)
        .slice(1)
        .map(mapLine => mapLine.split(' '))
    )
  }
}

const partA = fileName => {
  const { seeds, maps } = parseInput(fileName)
  let ranges = []
  let locationNumbers = []

  seeds.forEach(seed => {
    let nextNumber = parseInt(seed)
    maps.forEach(map => {
      map.forEach(([destinationRangeStart, sourceRangeStart, rangeLength]) => {
        const destinationRangeStartInt = parseInt(destinationRangeStart)
        const sourceRangeStartInt = parseInt(sourceRangeStart)
        const rangeLengthInt = parseInt(rangeLength)

        ranges.push({
          start: sourceRangeStartInt,
          end: sourceRangeStartInt + rangeLengthInt - 1,
          offset: destinationRangeStartInt - sourceRangeStartInt
        })
      })

      const nextNumberRange = ranges.find(r => nextNumber >= r.start && nextNumber <= r.end)
      nextNumber = nextNumberRange === undefined ? nextNumber : nextNumber + nextNumberRange.offset
      ranges = []
    })

    locationNumbers.push(parseInt(nextNumber))
  })

  return Math.min(...locationNumbers)
}

const partB = fileName => {
  const { seeds, maps } = parseInput(fileName)
  let ranges = []
  let lowestPerPair = []
  let answer = 0

  const seedPairs = []
  let seedPairHolder = {}
  seeds.forEach((seed, i) => {
    if (i % 2 === 0) {
      seedPairHolder.start = parseInt(seed)
    } else {
      seedPairHolder.length = parseInt(seed)
      seedPairs.push(seedPairHolder)
      seedPairHolder = {}
    }
  })

  seedPairs.forEach((pair, i) => {
    let expandedSeeds = []
    for (let j = pair.start; j < pair.start + pair.length; j++) {
      expandedSeeds.push(j)
    }

    let thisPairAnswer = 0
    expandedSeeds.forEach((seed, i, arr) => {
      let nextNumber = parseInt(seed)

      maps.forEach(map => {
        map.forEach(([destinationRangeStart, sourceRangeStart, rangeLength]) => {
          const destinationRangeStartInt = parseInt(destinationRangeStart)
          const sourceRangeStartInt = parseInt(sourceRangeStart)
          const rangeLengthInt = parseInt(rangeLength)

          ranges.push({
            start: sourceRangeStartInt,
            end: sourceRangeStartInt + rangeLengthInt - 1,
            offset: destinationRangeStartInt - sourceRangeStartInt
          })
        })

        const nextNumberRange = ranges.find(r => nextNumber >= r.start && nextNumber <= r.end)
        nextNumber =
          nextNumberRange === undefined ? nextNumber : nextNumber + nextNumberRange.offset
        ranges = []
      })

      if (thisPairAnswer === 0 || nextNumber < thisPairAnswer) {
        thisPairAnswer = nextNumber
      }
    })

    lowestPerPair.push(thisPairAnswer)
    thisPairAnswer = 0
    expandedSeeds = []
  })

  // first group answer: 1445869985
  return Math.min(...lowestPerPair)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_05/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_05/input.txt'))
}

process('A', 35, partA)
process('B', 46, partB)
