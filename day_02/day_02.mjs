import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const TOTAL_RED_COUNT = 12
const TOTAL_GREEN_COUNT = 13
const TOTAL_BLUE_COUNT = 14

const maxCount = (arr, color) =>
  Math.max(
    ...arr
      .flat()
      .filter(cube => cube.color === color)
      .map(cube => parseInt(cube.count))
  )

const partA = fileName => {
  const gameResults = parseInput(fileName).map(game => {
    const [rawGameNumber, rawSets] = game.split(': ')

    return {
      gameNumber: rawGameNumber.split(' ')[1],
      possible: rawSets
        .split('; ')
        .map(set => set.split(', ').map(cube => cube.split(' ')))
        .flat()
        .every(
          ([count, color]) =>
            (color === 'red' && count <= TOTAL_RED_COUNT) ||
            (color === 'green' && count <= TOTAL_GREEN_COUNT) ||
            (color === 'blue' && count <= TOTAL_BLUE_COUNT)
        )
    }
  })

  return gameResults.reduce((acc, cur) => acc + (cur.possible ? parseInt(cur.gameNumber) : 0), 0)
}

const partB = fileName => {
  const gameResults = parseInput(fileName).map(game => {
    const splitGame = game.split(': ')
    const parsedSets = splitGame[1].split('; ').map(set =>
      set.split(', ').map(cube => {
        const [count, color] = cube.split(' ')
        return { color, count }
      })
    )

    return {
      gameNumber: splitGame[0].split(' ')[1],
      redMax: maxCount(parsedSets, 'red'),
      greenMax: maxCount(parsedSets, 'green'),
      blueMax: maxCount(parsedSets, 'blue')
    }
  })

  return gameResults.reduce((acc, cur) => acc + cur.redMax * cur.greenMax * cur.blueMax, 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_02/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_02/input.txt'))
}

process('A', 8, partA)
process('B', 2286, partB)
