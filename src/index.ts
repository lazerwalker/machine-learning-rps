import {
  detect,
  ClassificationResult,
  ClassificationOption,
} from "./imageDetection";
import { textToSpeech } from "./textToSpeech";

let audioLastPlayed: { [type: ClassificationOption]: Date } = {};
let audioThrottle: number = 500;

function startVideoStream() {
  if (!navigator.mediaDevices.getUserMedia) return;
  navigator.mediaDevices
    .getUserMedia({ audio: false, video: { facingMode: "user" } })
    .then(function (stream) {
      const video: HTMLVideoElement = document.querySelector("#webcam");
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {
        video.play();
      };

      video.onloadeddata = (e) => {
        startTesting(video);
      };
    })
    .catch(function (err) {
      alert(
        "An error has occurred loading your webcam feed. Try again, or maybe in a different browser?"
      );
    });
}

function stringForResult(type: ClassificationOption): string {
  const map = {
    [ClassificationOption.Rock]: "rock",
    [ClassificationOption.Paper]: "paper",
    [ClassificationOption.Scissors]: "scissors",
    [ClassificationOption.Lizard]: "lizard",
    [ClassificationOption.Spock]: "spock",
    [ClassificationOption.Nothing]: "nothing",
  };
  return map[type];
}

function playAudio(text: string) {
  const now = new Date();

  if (audioLastPlayed[text]) {
    const differenceInMS = Math.floor(
      now.getTime() - audioLastPlayed[text].getTime()
    );
    if (differenceInMS < audioThrottle) {
      console.log("Throttled");
      return;
    }
  }

  audioLastPlayed[text] = now;

  console.log("Playing", text);

  textToSpeech(text);
}

let testingTimeout: number;

function startTesting(video: HTMLVideoElement, interval: number = 100) {
  const loop = async () => {
    const result = await detect(video);
    if (!result) return;

    updateDebugView(result);

    const text = stringForResult(result.result);

    const textDisplay = document.getElementById("spoken-text");
    if (result.result === ClassificationOption.Nothing) {
      textDisplay.innerText = "";
    } else {
      textDisplay.innerText = `"${text}"`;
    }

    if (result.result !== ClassificationOption.Nothing) {
      playAudio(text);
    }

    testingTimeout = (setTimeout(loop, interval) as unknown) as number;
  };

  loop();
}

function updateDebugView(result: ClassificationResult) {
  const format = (n: number) => `${(n * 100).toFixed(2)}%`;

  const map = {
    "chance-nothing": result.chanceNothing,
    "chance-rock": result.chanceRock,
    "chance-paper": result.chancePaper,
    "chance-scissors": result.chanceScissors,
    "chance-lizard": result.chanceLizard,
    "chance-spock": result.chanceSpock,
  };

  Object.keys(map).forEach((id) => {
    document.getElementById(id).innerText = format(map[id]);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start").addEventListener("click", () => {
    document.getElementById("start").hidden = true;
    startVideoStream();
  });

  document.addEventListener("keypress", (e) => {
    if (e.code === "KeyD") {
      const debug = document.querySelector("#debug-panel");
      debug.classList.toggle("hidden");
    }
  });

  if ((window as any).safari) {
    let safari;
    let safariClose;
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
      safari = document.getElementById("safari-ios-warning");
      safariClose = document.getElementById("close-ios-safari");
    } else {
      safari = document.getElementById("safari-warning");
      safariClose = document.getElementById("close-safari");
    }

    safari.hidden = false;
    safariClose.addEventListener("click", () => {
      safari.hidden = true;
    });
  }
});
