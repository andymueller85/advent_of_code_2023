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

  seeds.forEach((seed, i) => {
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

  let answer = Number.MAX_SAFE_INTEGER

  seedPairs.forEach((pair, pairNum) => {
    let thisPairAnswer = 0

    for (let seed = pair.start; seed < pair.start + pair.length; seed++) {
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

      if (thisPairAnswer < answer) {
        answer = thisPairAnswer
      }

      const i = seed - pair.start
      if (i !== 0 && i % 1000000 === 0) {
        console.log({ pairNum, i: `${i / 1000000} million`, thisPairAnswer, answer })
      }
    }

    console.log(`Pair ${pairNum} answer`, thisPairAnswer)
    console.log('Overall answer', answer)
    thisPairAnswer = 0
  })

  // Got the right answer in about 12 hours: 1240035
  return answer
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
