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

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_05/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_05/input.txt'))
}

process('A', 35, partA)
// process('B', 30, partB)
