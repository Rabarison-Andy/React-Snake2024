import uniqid from "uniqid";
import gsap from "gsap";
import useStore from "./store";

const flashbangAudio = new Audio("/audio/csgo-flashbang.mp3");

let flashTween = null;

// window.location.href = "https://google.com";
export const netherPortal = () => {
  const video = document.getElementById("nether-video");
  video.style.display = "block";

  setTimeout(() => {
    video.style.display = "none";
  }, 3000);
};

export const flashUser = () => {
  if (flashTween) flashTween.kill();

  flashbangAudio.currentTime = 0;
  flashbangAudio.play();
  document.querySelector(".flashbang").style.opacity = "1";

  flashTween = gsap.to(".flashbang", {
    opacity: 0,
    duration: 2,
    delay: 0.25,
  });
};

export const triggerMode = () => {
  const modes = ["impossible", "corner", "reversed"];
  const selectedMode = modes[Math.floor(Math.random() * modes.length)];

  // déclenche le mode sélectionné aléatoirement
  useStore.getState().addMode(selectedMode);

  setTimeout(() => {
    useStore.getState().removeMode(selectedMode);
  }, 1000);
};

export const wizz = () => {
  gsap.to("#board", {
    duration: 0.05,
    x: "+=30%",
    yoyo: true,
    repeat: 9,
  });
};

export const reversedControls = (e, direction) => {
  switch (e.keyCode) {
    //touche du haut
    case 38:
      // console.log("going up");
      if (direction.current !== "UP") {
        direction.current = "DOWN";
      }
      // Going up
      break;
    case 40:
      if (direction.current !== "DOWN") {
        direction.current = "UP";
      }
      // Going down
      break;
    case 37:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT";
      }
      // Going left
      break;
    case 39:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT";
      }
      // Going right
      break;

    default:
      break;
  }
};

export const defaultControls = (e, direction) => {
  switch (e.keyCode) {
    case 38:
      // console.log("going up");
      if (direction.current !== "DOWN") {
        direction.current = "UP";
      }
      // Going up
      break;
    case 40:
      if (direction.current !== "UP") {
        direction.current = "DOWN";
      }
      // Going down
      break;
    case 37:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT";
      }
      // Going left
      break;
    case 39:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT";
      }
      // Going right
      break;

    default:
      break;
  }
};

export const generateRandomCoordinates = (mode) => {
  const boardSize = useStore.getState().boardSize;
  const baseMax = 49;
  const adjustedMax = Math.floor(baseMax * boardSize);
  
  const id = uniqid();
  let min = 0;
  let max = adjustedMax;
  let x, y;

  if (mode.includes("corner")) {
    const side = Math.random();

    if (side <= 0.25) {
      x = min;
      y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      y = Math.min(y * 10, adjustedMax * 10);
    } else if (side > 0.25 && side <= 0.5) {
      x = max * 10;
      y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      y = Math.min(y * 10, adjustedMax * 10);
    } else if (side > 0.5 && side <= 0.75) {
      x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      x = Math.min(x * 10, adjustedMax * 10);
      y = max * 10;
    } else {
      x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      x = Math.min(x * 10, adjustedMax * 10);
      y = min;
    }
  } else {
    x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    
    x = Math.min(x * 10, adjustedMax * 10);
    y = Math.min(y * 10, adjustedMax * 10);
  }

  return { x, y, id };
};
