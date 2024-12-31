import useStore from "../../utils/store";
import s from "./LiveScoreboard.module.scss";

const LiveScoreboard = () => {
  const { results } = useStore();

  return (
    <div className={s.scoreboard}>
      <h1>Top Scores</h1>
      <div className={s.results}>
        <div className={s.header}>
          <span>Name</span>
          <span>Score</span>
          <span>Deaths</span>
        </div>
        {results.slice(0, 5).map((result, i) => (
          <div className={s.result} key={result.name + i}>
            <span>{result.name}</span>
            <span>{result.score}</span>
            <span>{result.death}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveScoreboard; 