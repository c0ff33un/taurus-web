import React from 'react'
import { useTypedSelector } from 'Redux'

const CELL_SIZE = 25
const WIDTH = 625

const Grid = () => {
  const grid = useTypedSelector(state => state.gameController.grid)

  const cols = WIDTH / CELL_SIZE
  return (
    <>
      {grid.map((cell, index) => {
        const x = Math.floor(index / cols),
          y = index % cols
        const key = x.toString() + '-' + y.toString()
        var className
        if (cell) {
          className = 'Wall Cell'
        } else {
          className = 'Cell'
        }
        return <div key={key} className={className} />
      })}
    </>
  )
}

export default Grid
