import * as fs from 'fs'

const splitOnWS = str => str.split(/\s/g).filter(s => s !== '')

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const getBeatRecordCount = (time, record) => {
  let count = 0
  for (let i = 1; i < time; i++) {
    count += i * (time - i) > record ? 1 : 0
  }

  return count
}

const partA = fileName => {
  const [times, distances] = parseInput(fileName)

  return splitOnWS(times.split(':')[1])
    .map((t, i) => [parseInt(t), parseInt(splitOnWS(distances.split(':')[1])[i])])
    .reduce((acc, [time, record]) => acc * getBeatRecordCount(time, record), 1)
}

const partB = fileName => {
  const [times, distances] = parseInput(fileName)
  const parseVal = val => parseInt(splitOnWS(val.split(':')[1]).join(''))

  return getBeatRecordCount(parseVal(times), parseVal(distances))
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_06/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_06/input.txt'))
}

process('A', 288, partA)
process('B', 71503, partB)
