import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

let ttsBuffer: AudioBuffer | undefined;

let isPlaying: Boolean = false;
let isLoading: Boolean = false;

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

const play = (context: AudioContext, buffer: AudioBuffer) => {
  if (isPlaying) return;

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
  if (ttsBuffer) {
    if (!AudioContext) {
      console.log("Your browser cannot play audio");
      return;
    }
    const context = new AudioContext();

    play(context, ttsBuffer);
    return;
  }

  if (isLoading) {
    return;
  }
  isLoading = true;

  // TODO: Move this someplace more secure, cycle this key before public release
  const subscriptionKey = "76f8b4a9132241c791b2b07dba40b1e0";
  const serviceRegion = "eastus";

  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion
  );
  speechConfig.speechSynthesisVoiceName = "en-US-AriaNeural";

  const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
  console.log("Fetching from server");
  synthesizer.speakTextAsync(text, async (result) => {
    if (!result.audioData) return;
    if (!AudioContext) {
      console.log("Your browser cannot play audio");
      return;
    }

    const context = new AudioContext();

    ttsBuffer = await context.decodeAudioData(result.audioData);
    play(context, ttsBuffer);
    isLoading = false;

    synthesizer.close();
  });
}
