import * as cvstfjs from "@microsoft/customvision-tfjs";

export enum ClassificationOption {
  Nothing,
  Rock,
  Paper,
  Scissors,
  Lizard,
  Spock,
}

/** Results as 0-1.0 percentage chances */
export interface ClassificationResult {
  chanceNothing: number;
  chancePaper: number;
  chanceRock: number;
  chanceScissors: number;
  chanceLizard: number;
  chanceSpock: number;
  result: ClassificationOption;
}

export async function detect(image: HTMLVideoElement) {
  let model = new cvstfjs.ClassificationModel();
  await model.loadModelAsync("model/model.json");
  const result = await model.executeAsync(image);
  // console.log(JSON.stringify(result));
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

  /** This is the logic to go from a set of probabilties from the model to
   *  actually deciding what (if anything) the player has thrown.
   *
   *  So, our model is fairly noisy.
   *  Specifically, in many cases, it always has the chance of paper as being 96-98%,
   *  And also doesn't do a great job of actively detecting whether there's nothing.
   *
   *  We need some custom logic to work around that. This basically says:
   *  - If there's a non-zero chance nothing is being shown, assume that's the case
   *  - Otherwise, find the symbol with the highest probability
   *  - However, if that highest chance is scissors, only accept it as valid if
   *    the model thinks it's 100% correct.
   */
  let classificationResult = ClassificationOption.Nothing;
  if (chanceNothing < 0.05) {
    let highestChance = 0;

    if (chanceRock > highestChance) {
      highestChance = chanceRock;
      classificationResult = ClassificationOption.Rock;
    }

    if (chanceScissors > highestChance && chanceScissors >= 1) {
      highestChance = chanceScissors;
      classificationResult = ClassificationOption.Scissors;
    }

    if (chanceLizard > highestChance) {
      highestChance = chanceLizard;
      classificationResult = ClassificationOption.Lizard;
    }

    if (chanceSpock > highestChance) {
      highestChance = chanceSpock;
      classificationResult = ClassificationOption.Spock;
    }

    if (chancePaper >= 1 && chancePaper > highestChance) {
      highestChance = chancePaper;
      classificationResult = ClassificationOption.Paper;
    }

    if (highestChance < 0.8) {
      classificationResult = ClassificationOption.Nothing;
    }
  }

  return {
    chanceLizard,
    chanceNothing,
    chancePaper,
    chanceRock,
    chanceScissors,
    chanceSpock,
    result: classificationResult,
  };
}
