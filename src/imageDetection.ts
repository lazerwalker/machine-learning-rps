import * as cvstfjs from "@microsoft/customvision-tfjs";

/** Results as 0-1.0 percentage chances */
interface ClassificationResult {
  chanceNothing: number;
  chancePaper: number;
  chanceRock: number;
  chanceScissors: number;
  chanceLizard: number;
  chanceSpock: number;
}

export async function detect(image: HTMLVideoElement) {
  let model = new cvstfjs.ClassificationModel();
  await model.loadModelAsync("model/model.json");
  const result = await model.executeAsync(image);
  console.log(JSON.stringify(result));
  const probabilities = result[0];
  if (!probabilities || probabilities.length !== 6) return;

  const [
    chanceLizard,
    chanceNothing,
    chancePaper,
    chanceRock,
    chanceScissors,
    chanceSpock,
  ] = probabilities;
  return {
    chanceLizard,
    chanceNothing,
    chancePaper,
    chanceRock,
    chanceScissors,
    chanceSpock,
  };
}
