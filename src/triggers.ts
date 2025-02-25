import { turkishToASCII } from "./utils";

interface SpeechTrigger {
  match: RegExp;
  action: (text: string, matchResponse: RegExpMatchArray) => void;
}

export const speechTriggers: SpeechTrigger[] = [];

export function handleSpeech(text: string) {
  text = turkishToASCII(text).replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
  console.log(`Speech detected: ${text}`);
  speechTriggers.forEach(({ match, action }) => {
    if (match.test(text)) {
      const matchResponse = match.exec(text);
      action(text, matchResponse);
    }
  });
}

export function addSpeechTrigger(match: RegExp, action: SpeechTrigger["action"]) {
  speechTriggers.push({ match, action });
}