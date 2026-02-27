const Stats = ({ time = 400 }) => {
  return (
    <div className="top-0">
      <div className="fixed left-0 p-4">
      <div className="text-white">MARIO</div>
      <div className="text-white">000000</div>
      </div>

      <div className="fixed right-0 p-4 text-right">
        <div className="text-white">TIME</div>
        <div className="text-white">{time}</div>
      </div>
    </div>
  )
}

export default Stats
