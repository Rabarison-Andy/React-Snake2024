import { useEffect, useState, useRef } from "react";
import Snake from "../Snake/Snake";
import gsap from "gsap";
import s from "./Board.module.scss";
import Item from "../Item/Item";
import {
  defaultControls,
  flashUser,
  generateRandomCoordinates,
  triggerMode,
  reversedControls,
  wizz,
  netherPortal,
} from "../../utils/utils";
import GameOver from "../GameOver/GameOver";
import useStore from "../../utils/store";
import Submit from "../Submit/Submit";
import Scoreboard from "../Scoreboard/Scoreboard";
import LiveScoreboard from "../LiveScoreboard/LiveScoreboard";
import MirrorSnake from "../MirrorSnake/MirrorSnake";

const Board = () => {
  const { mode, removeMode, boardSize } = useStore();
  const [paused, setPaused] = useState(false);
  const [snakeData, setSnakeData] = useState([
    [0, 0],
    [10, 0],
  ]);

  const [trapArray, setTrapArray] = useState([]);
  const [foodArray, setFoodArray] = useState([]);

  const [hasEnteredResults, setHasEnteredResults] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(0.2);
  const [score, setScore] = useState(0);
  const [death, setDeath] = useState(0);

  const timer = useRef(0);
  const foodTimer = useRef(0);
  const trapTimer = useRef(0);
  const direction = useRef("RIGHT");
  const canChangeDirection = useRef(true);

  const baseSize = 500; // taille de base du plateau
  const adjustedSize = baseSize * boardSize;

  const gameIsOver = () => {
    gsap.ticker.remove(gameLoop);

    setDeath(death + 1);

    const video = document.getElementById("die-video");
    video.style.display = "block";

    setGameOver(true);
  };

  const isOutOfBorder = (head) => {
    if (
      head[0] >= adjustedSize ||
      head[1] >= adjustedSize ||
      head[0] < 0 ||
      head[1] < 0
    ) {
      return true;
    }
    return false;
  };

  const hasEatenItem = ({ getter, setter }) => {
    const head = snakeData[snakeData.length - 1];

    // comparer les coordonnées de la tête du snake avec LES food
    const item = getter.find(
      (_item) => _item.x === head[0] && _item.y === head[1]
    );

    if (item) {
      // si y'a match on renvoie true

      // mettre à jour le tableau des food disponibles
      const newItemArray = getter.filter((_item) => _item !== item);

      setter(newItemArray);

      return true;
    } else {
      // sinon on renvoie false
      return false;
    }
  };

  const moveSnake = () => {
    let newSnakeData = [...snakeData];
    let head = newSnakeData[newSnakeData.length - 1];

    // console.log(head);

    switch (direction.current) {
      case "RIGHT":
        head = [head[0] + 10, head[1]];

        break;
      case "LEFT":
        head = [head[0] - 10, head[1]];

        break;
      case "DOWN":
        head = [head[0], head[1] + 10];

        break;
      case "UP":
        head = [head[0], head[1] - 10];

      default:
        break;
    }

    newSnakeData.push(head);
    newSnakeData.shift();

    const snakeCollapsed = hasCollapsed(head);
    const outOfBorder = isOutOfBorder(head);
    const snakeAteFood = hasEatenItem({
      getter: foodArray,
      setter: setFoodArray,
    });
    const snakeAteTrap = hasEatenItem({
      getter: trapArray,
      setter: setTrapArray,
    });

    // console.log(snakeCollapsed);

    if (outOfBorder || snakeCollapsed) {
      gameIsOver();
    } else {
      if (snakeAteTrap === true) {
        // trap execution logic
        const effects = [flashUser, triggerMode, wizz, netherPortal];

        const selectedEffect =
          effects[Math.floor(Math.random() * effects.length)];

        selectedEffect();
      }
      if (snakeAteFood === true) {
        // agrandir le serpent
        newSnakeData.unshift([]);

        setScore(score + 10);

        if (speed > 0.05) {
          // console.log("speed =", speed);
          setSpeed(speed - 0.02);
        }
      }
      setSnakeData(newSnakeData);
    }
  };

  const hasCollapsed = (head) => {
    let snake = [...snakeData];
    snake.pop();

    // Vérifier la collision avec le serpent principal
    for (let i = 0; i < snake.length; i++) {
      if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
        return true;
      }
    }

    // Si le mode miroir est actif, vérifier aussi la collision avec le serpent miroir
    if (mode.includes("mirror")) {
      const mirroredHead = [adjustedSize - head[0] - 10, adjustedSize - head[1] - 10];
      for (let i = 0; i < snakeData.length; i++) {
        const mirroredPart = [
          adjustedSize - snakeData[i][0] - 10,
          adjustedSize - snakeData[i][1] - 10,
        ];
        if (head[0] === mirroredPart[0] && head[1] === mirroredPart[1]) {
          return true;
        }
        if (mirroredHead[0] === snakeData[i][0] && mirroredHead[1] === snakeData[i][1]) {
          return true;
        }
      }
    }

    return false;
  };

  const onKeyDown = (e) => {
    // console.log(e);
    if (canChangeDirection.current === false) return;
    canChangeDirection.current = false;

    mode.includes("reversed")
      ? reversedControls(e, direction)
      : defaultControls(e, direction);
  };

  const addItem = ({ getter, setter }) => {
    // génération de coordonnées
    const coordinates = generateRandomCoordinates(mode);

    //fusion des deux tableaux
    const array = [...foodArray, ...trapArray];

    //test pour savoir si un item est déjà existant à cet endroit
    const itemAlreadyExistsHere = array.some(
      (item) => item.x === coordinates.x && coordinates.y === item.y
    );

    // si ça existe déjà, rappeler la fonction
    if (itemAlreadyExistsHere) {
      addItem({ getter, setter });
      return;
    }

    setter((oldArray) => [...oldArray, coordinates]);
  };

  const gameLoop = (time, deltaTime, frame) => {
    // console.log(time, deltaTime, frame);
    // console.log("game loop");
    timer.current += deltaTime * 0.001;
    foodTimer.current += deltaTime * 0.001;
    trapTimer.current += deltaTime * 0.001;

    // ici, gestion de l'apparition de la nourriture
    if (foodTimer.current > 2 && foodArray.length < 20) {
      foodTimer.current = 0;
      addItem({
        getter: foodArray,
        setter: setFoodArray,
      });
    }

    // ici, gestion des pièges
    if (trapTimer.current > 3 && trapArray.length < 10) {
      trapTimer.current = 0;
      addItem({
        getter: trapArray,
        setter: setTrapArray,
      });
    }

    if (timer.current > (mode.includes("impossible") ? 0.02 : speed)) {
      timer.current = 0;
      moveSnake();
      canChangeDirection.current = true;
    }
  };

  const resetGame = () => {
    removeMode("corner");
    removeMode("impossible");
    removeMode("reversed");

    const video = document.getElementById("die-video");
    if (video) {
      video.style.display = "none";
      video.pause();
    }

    setGameOver(false);
    setHasEnteredResults(false);
    setSpeed(0.2);
    setScore(0);

    setSnakeData([
      [0, 0],
      [10, 0],
    ]);
    
    setFoodArray([]);
    setTrapArray([]);

    direction.current = "RIGHT";
    timer.current = 0;
    foodTimer.current = 0;
  };

  // Gestionnaire pour le changement de taille
  const handleBoardSizeChange = () => {
    resetGame();
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("boardSizeChanged", handleBoardSizeChange);
    gsap.ticker.add(gameLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("boardSizeChanged", handleBoardSizeChange);
      gsap.ticker.remove(gameLoop);
    };
  }, [snakeData, boardSize]); // Ajout de boardSize comme dépendance

  // Modifier la fonction replay pour utiliser resetGame
  const replay = () => {
    resetGame();
  };

  // const pauseGame = () => {
  //   console.log("pause game");
  //   if (paused) {
  //     gsap.ticker.add(gameLoop);
  //     setPaused(false);
  //   } else {
  //     setPaused(true);
  //     timer.current = 0;
  //     foodTimer.current = 0;

  //     gsap.ticker.remove(gameLoop);
  //   }
  // };

  return (
    <>
      {gameOver && <GameOver replay={replay} />}
      {gameOver && !hasEnteredResults && (
        <Submit
          score={score}
          death={death}
          setHasEnteredResults={setHasEnteredResults}
        />
      )}
      {gameOver && <Scoreboard />}
      <LiveScoreboard />

      <div 
        id="board" 
        className={s.board}
        style={{
          width: adjustedSize,
          height: adjustedSize
        }}
      >
        <Snake data={snakeData} />
        {mode.includes("mirror") && (
          <MirrorSnake data={snakeData} boardSize={boardSize} />
        )}

        <span className={s.score}>Score: {score}</span>

        <span className={s.death}>Death: {death}</span>

        {foodArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="food" />
        ))}

        {trapArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="trap" />
        ))}
      </div>
    </>
  );
};

export default Board;
