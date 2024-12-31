import s from "./GameOver.module.scss";

const GameOver = ({ replay }) => {
  const handleReplay = () => {
    // Arrêter la vidéo avant de relancer le jeu
    const video = document.getElementById("die-video");
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.style.display = "none";
    }
    replay();
  };

  return (
    <div>
      <button onClick={handleReplay} className={s.btn}>
        Replay
      </button>
    </div>
  );
};

export default GameOver;
