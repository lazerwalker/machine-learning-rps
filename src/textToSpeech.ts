import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

let cache: { [text: string]: AudioBuffer } = {};

let isPlaying: Boolean = false;
let isLoading: Boolean = false;

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

const play = (context: AudioContext, buffer: AudioBuffer) => {
  if (isPlaying) {
    console.log("Is playing already");
    return;
  }
  console.log("Playing a buffer");

  const source = context.createBufferSource();

  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);

  isPlaying = true;
  source.onended = () => {
    isPlaying = false;
  };
};

export function textToSpeech(text: string) {
  if (isLoading || isPlaying) {
    console.log("Is loading or playing already");
    return;
  }
  isLoading = true;

  if (cache[text]) {
    console.log("Playing cached");
    if (!AudioContext) {
      console.log("Your browser cannot play audio");
      return;
    }
    const context = new AudioContext();

    play(context, cache[text]);
    isLoading = false;
    return;
  }

  const subscriptionKey = process.env.COGNITIVE_SERVICES_SUBSCRIPTION_KEY;
  const serviceRegion = process.env.COGNITIVE_SERVICES_REGION;
  console.log("Keys?", subscriptionKey, serviceRegion);

  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion
  );
  speechConfig.speechSynthesisVoiceName = "en-US-AriaNeural";

  const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
  console.log("Fetching from server");

  const audioHandler = async (result) => {
    console.log("Fetched from server");
    if (!result.audioData) return;
    if (!AudioContext) {
      console.log("Your browser cannot play audio");
      return;
    }

    const context = new AudioContext();

    cache[text] = await context.decodeAudioData(result.audioData);

    // We don't manually call `play` here because the act of
    // `speakTextAsync` outputs to the system audio

    synthesizer.close();
  };

  isPlaying = true;
  synthesizer.synthesisCompleted = (sender, e) => {
    // The extra timeout helps prevent double-playing
    setTimeout(() => {
      isPlaying = false;
      isLoading = false;
    }, 500);
  };

  // We assume something is valid SSML if it is wrapped by what appears to be a
  // valid <speak> tag. This isn't perfect, but is good enough in most cases.
  const isSsml =
    text.indexOf("<speak") === 0 &&
    text.indexOf("</speak>") === text.length - "</speak>".length;

  if (isSsml) {
    synthesizer.speakSsmlAsync(text, audioHandler);
  } else {
    synthesizer.speakTextAsync(text, audioHandler);
  }
}
