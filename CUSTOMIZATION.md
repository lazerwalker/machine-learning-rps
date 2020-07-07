# Customizing this application

There are a bunch of choices if you want to customize this sample app!

## Changing the Spoken Text

If you want to change what words are read out when different hand symbols are recognized, just tweak the JS object [here](https://github.com/lazerwalker/machine-learning-rps/blob/main/src/index.ts#L33-L43).

When the machine learning model recognizes on of the symbols listed as keys / on the left-hand side, it will trigger neural text-to-speech using the text values on the right-hand side.

If a given text-to-speech string is valid [SSML](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup?tabs=csharp&WT.mc_id=rpsweb-github-emwalker), Speech Services will use that SSML to determine how to read the text. Otherwise, if it's just a plain text string, it will be read by the `en-US-AriaNeural` neural TTS voice. If you want to change that default voice, that is tweakable [here](https://github.com/lazerwalker/machine-learning-rps/blob/main/src/textToSpeech.ts#L52).

## Changing the model itself

If you want to swap out the [Custom Vision](https://customvision.ai) hand symbol recognition model for a different one entirely, that's going to take a little more work.

For starters, you're going to need to export your model from Custom Vision as a TensorFlow.js model. This requires that it be trained on a compact model. You can drop the exported model right into the `model` folder of your repository, overwriting the existing one.

In this codebase, the main place to look is the [imageDetection.ts file](https://github.com/lazerwalker/machine-learning-rps/blob/main/src/imageDetection.ts), which contains all of that logic.

There are three important things to note here:

1. The way we read in values is hardcoded to match the order returned by our specific model (see: [code](https://github.com/lazerwalker/machine-learning-rps/blob/main/src/imageDetection.ts#L31-L38)). If you have your own TensorFlow.js model, you should make sure the way you're reading this data in matches the order specified in your `labels.txt` file.

2. The bulk of this code ([this bit here](https://github.com/lazerwalker/machine-learning-rps/blob/main/src/imageDetection.ts#L40-L85)) is our own custom logic to clean up some of our noisy model data. If you're pulling in your own model, you'll likely need to hand-tweak the way you're interpreting the results in a similar way. We came up with these manual rules by testing the app with the debug log turned on (press 'd' while the webapp is open to see the raw percentages output by the model). We recommend hooking up your data to the debug infrastructure we already have in place to manually see what your own data looks like. See [this function](https://github.com/lazerwalker/machine-learning-rps/blob/main/src/index.ts#L80-L95) for what that currently looks like, although you may also need to tweak the DOM elements in `index.html` as well.

3. If you adjust the [TypeScript type definitions](https://github.com/lazerwalker/machine-learning-rps/blob/main/src/imageDetection.ts#L3-L21) to match the sort of results your own model generates, this is going to make finding other changes easier. There are a handful of places you will need to modify within `index.ts`, but changing the type definitions here will allow you to largely use the TypeScript compiler to tell you where those changes need to be made.
