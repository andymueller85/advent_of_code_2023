import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => r.split('').map(w => parseInt(w)))

// solution borrowed from https://github.com/hiimjustin000/advent-of-code/tree/master/2023/day17
const findPath = (fileName, min, max) => {
  const input = parseInput(fileName)
  const graph = {}
  let result = Infinity

  const walk = (neighbor, heat) => {
    if (heat >= Math.min(graph[neighbor].heat, result)) return
    if (neighbor.split('l')[1] == `(${input[0].length - 1},${input.length - 1})`) {
      result = heat
      return
    }
    graph[neighbor].heat = heat

    Object.keys(graph[neighbor].neighbors).forEach(key => {
      walk(key, heat + graph[neighbor].neighbors[key])
    })
  }

  const neighborSum = (length, fn) => Array.from({ length }, fn).reduce((a, b) => a + b)
  const key = (dir, x, y) => `${dir}(${x},${y})`
  const H = 'horizontal'
  const V = 'vertical'

  input.forEach((r, rI) => {
    r.forEach((_, cI) => {
      const vertical = (graph[key(V, cI, rI)] = { heat: Infinity, neighbors: {} })
      const horizontal = (graph[key(H, cI, rI)] = { heat: Infinity, neighbors: {} })
      for (let i = min; i <= max; i++) {
        if (rI + i >= 0 && rI + i < input.length)
          vertical.neighbors[key(H, cI, rI + i)] = neighborSum(i, (_, j) => input[rI + j + 1][cI])
        if (rI - i >= 0 && rI - i < input.length)
          vertical.neighbors[key(H, cI, rI - i)] = neighborSum(i, (_, j) => input[rI - j - 1][cI])
        if (cI + i >= 0 && cI + i < input[0].length)
          horizontal.neighbors[key(V, cI + i, rI)] = neighborSum(i, (_, j) => input[rI][cI + j + 1])
        if (cI - i >= 0 && cI - i < input[0].length)
          horizontal.neighbors[key(V, cI - i, rI)] = neighborSum(i, (_, j) => input[rI][cI - j - 1])
      }
    })
  })

  const startingNeighbors = {
    ...graph[key(H, 0, 0)].neighbors,
    ...graph[key(V, 0, 0)].neighbors
  }

  Object.keys(startingNeighbors).forEach(neighbor => {
    walk(neighbor, startingNeighbors[neighbor])
  })

  return result
}

const process = (part, expectedAnswer, min, max) => {
  const sampleAnswer = findPath('./day_17/sample_input.txt', min, max)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, findPath('./day_17/input.txt', min, max))
}

process('A', 102, 1, 3)
process('B', 94, 4, 10)
