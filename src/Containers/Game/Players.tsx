import * as React from 'react'
import { useTypedSelector } from 'Redux'

const Players = () => {
  const colors = ['Red', 'Coffee', 'Blue', 'Green']
  const { players } = useTypedSelector(state => state.gameController)
  const renderPlayers = []
  for (var id in players) {
    const { x, y } = players[id]
    renderPlayers.push(
      <div
        key={id}
        style={{
          top: `${y * 2}vw`,
          left: `${x * 2}vw`,
        }}
        className={`Player ${colors[Number(id) % 4]}`}
      />
    )
  }
  return <>{renderPlayers}</>
}

export default Players
