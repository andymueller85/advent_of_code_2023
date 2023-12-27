import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(l => l.split(' ').map(x => parseInt(x)))

const partA = fileName =>
  parseInput(fileName).reduce((sum, line) => {
    const spawnedArrays = [line]

    while (spawnedArrays[spawnedArrays.length - 1].some(v => v !== 0)) {
      spawnedArrays.push(
        spawnedArrays[spawnedArrays.length - 1]
          .map((v, i, arr) => (i < arr.length - 1 ? arr[i + 1] - v : undefined))
          .filter(v => v !== undefined)
      )
    }

    return sum + spawnedArrays.reverse().reduce((lineSum, cur) => cur[cur.length - 1] + lineSum, 0)
  }, 0)

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_09/sample_input.txt', fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_09/input.txt', fn))
}

process('A', 114, partA)
