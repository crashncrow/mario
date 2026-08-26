import { describe, expect, it } from 'vitest'
import { processArray, processFullArray } from 'libs/pixless'

describe('processArray', () => {
  it('returns an empty array for an empty input', () => {
    expect(processArray([])).toEqual([])
  })

  it('collapses a single run into one entry', () => {
    expect(processArray([5, 5, 5])).toEqual([{ color: 5, count: 3 }])
  })

  it('run-length encodes consecutive runs in order', () => {
    expect(processArray([0, 0, 0, 1, 1, 2])).toEqual([
      { color: 0, count: 3 },
      { color: 1, count: 2 },
      { color: 2, count: 1 },
    ])
  })

  it('treats every element as its own run when nothing repeats', () => {
    expect(processArray([1, 2, 3])).toEqual([
      { color: 1, count: 1 },
      { color: 2, count: 1 },
      { color: 3, count: 1 },
    ])
  })
})

describe('processFullArray', () => {
  it('applies run-length encoding independently to each row', () => {
    const matrix = [
      [0, 0, 1],
      [2, 2, 2],
    ]

    expect(processFullArray(matrix)).toEqual([
      [{ color: 0, count: 2 }, { color: 1, count: 1 }],
      [{ color: 2, count: 3 }],
    ])
  })

  it('returns an empty array for an empty matrix', () => {
    expect(processFullArray([])).toEqual([])
  })
})
