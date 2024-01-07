import * as fs from 'fs'

const parseInput = fileName => fs.readFileSync(fileName, 'utf8').trim().split(',')

const hash = str => {
  let val = 0

  str.split('').forEach(char => {
    val += char.charCodeAt(0)
    val *= 17
    val %= 256
  })

  return val
}

const partA = fileName => parseInput(fileName).reduce((acc, cur) => acc + hash(cur), 0)

const partB = fileName => {
  const input = parseInput(fileName)
  const boxes = {}

  input.forEach(step => {
    const label = step.slice(
      0,
      step.split('').findIndex(s => ['-', '='].includes(s))
    )

    const box = hash(label)
    const lenses = boxes[box]

    if (step.includes('=')) {
      const focalLength = parseInt(step.split('=')[1])
      if (lenses) {
        const lens = lenses.find(l => l.label === label)

        if (lens) {
          lens.focalLength = focalLength
        } else {
          lenses.push({ label, focalLength })
        }
      } else {
        boxes[box] = [{ label, focalLength }]
      }
    } else if (lenses) {
      const lensIndex = lenses.findIndex(l => l.label === label)

      if (lensIndex >= 0) {
        boxes[box] = [...lenses.slice(0, lensIndex), ...lenses.slice(lensIndex + 1)]
      }
    }
  })

  return Object.entries(boxes).reduce((sum, [boxNum, lenses]) => {
    return (
      sum +
      lenses.reduce(
        (acc, { focalLength }, i) => acc + (parseInt(boxNum) + 1) * (i + 1) * focalLength,
        0
      )
    )
  }, 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_15/sample_input.txt', fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_15/input.txt', fn))
}

process('A', 1320, partA)
process('B', 145, partB)
