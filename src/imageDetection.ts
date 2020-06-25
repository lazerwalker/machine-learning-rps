import * as cvstfjs from "@microsoft/customvision-tfjs";

/** Results as 0-1.0 percentage chances */
interface ClassificationResult {
  chanceNothing: number;
  chancePaper: number;
  chanceRock: number;
  chanceScissors: number;
}

export async function detect(image: HTMLVideoElement) {
  let model = new cvstfjs.ClassificationModel();
  await model.loadModelAsync("model/model.json");
  const result = await model.executeAsync(image);
  console.log(JSON.stringify(result));
  const probabilities = result[0];
  if (!probabilities || probabilities.length !== 4) return;

  const [
    chanceNothing,
    chancePaper,
    chanceRock,
    chanceScissors,
  ] = probabilities;
  return { chanceNothing, chancePaper, chanceRock, chanceScissors };
}
