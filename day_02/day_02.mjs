import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const TOTAL_RED_COUNT = 12
const TOTAL_GREEN_COUNT = 13
const TOTAL_BLUE_COUNT = 14

const partB = fileName => {
  const gameResults = parseInput(fileName).map(game => {
    let redMin = 0
    let greenMin = 0
    let blueMin = 0

    const splitGame = game.split(': ')

    const [_, gameNumber] = splitGame[0].split(' ')
    const cubeSets = splitGame[1].split('; ')

    cubeSets.forEach(set => {
      set.split(', ').forEach(cube => {
        const [count, color] = cube.split(' ')
        const parsedCount = parseInt(count)
        switch (color) {
          case 'red':
            if (parsedCount > redMin) redMin = parsedCount
            break
          case 'green':
            if (parsedCount > greenMin) greenMin = parsedCount
            break
          case 'blue':
            if (parsedCount > blueMin) blueMin = parsedCount
            break
        }
      })
    })

    return { gameNumber, redMin, greenMin, blueMin }
  })

  const ignoreZero = val => (val === 0 ? 1 : val)

  return gameResults.reduce(
    (acc, cur) => acc + ignoreZero(cur.redMin) * ignoreZero(cur.greenMin) * ignoreZero(cur.blueMin),
    0
  )
}

const partA = fileName => {
  const gameResults = parseInput(fileName).map(game => {
    let possible = true

    const splitGame = game.split(': ')

    const [_, gameNumber] = splitGame[0].split(' ')
    const cubeSets = splitGame[1].split('; ')

    cubeSets.forEach(set => {
      set.split(', ').forEach(cube => {
        const [count, color] = cube.split(' ')
        switch (color) {
          case 'red':
            if (count > TOTAL_RED_COUNT) possible = false
            break
          case 'green':
            if (count > TOTAL_GREEN_COUNT) possible = false
            break
          case 'blue':
            if (count > TOTAL_BLUE_COUNT) possible = false
            break
        }
      })
    })

    return { gameNumber, possible }
  })

  return gameResults.reduce((acc, cur) => acc + (cur.possible ? parseInt(cur.gameNumber) : 0), 0)
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
