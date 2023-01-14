import { AudioObject } from "../components/AudioContainer";

export const bindMethodsToObject = (audioObject: AudioObject) => {
    let key: keyof AudioObject
    for (key in audioObject) {
        if (typeof audioObject[key] == 'function') {
            audioObject[key] = (audioObject[key] as Function).bind(audioObject)
        }
    }
}