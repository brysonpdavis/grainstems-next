import { type SetStateAction } from 'react'
import type {
    GrainPlayer,
    Filter,
    AmplitudeEnvelope,
    Gain,
    FFT,
} from 'tone'
import { ToneAudioBuffer, context, now } from 'tone'
import { type ToneComponents } from './tone'

export type StateObject<T> = {
    set: (state: SetStateAction<T>) => void
    get: T
}

export type ToneAudioBufferTarget = string | ToneAudioBuffer | AudioBuffer | undefined

export class AudioObject implements AudioObject {
    player: GrainPlayer
    filter: Filter
    envelope: AmplitudeEnvelope
    gain: Gain
    fft: FFT
    startPlayer: (onStart?: () => void) => void
    stopPlayer: () => void
    setReverse: () => void
    resetGrainPlayer: (url: ToneAudioBuffer) => void
    resetGrainPlayerAndSampleDuration: (
        url: ToneAudioBufferTarget, 
        setSampleDuration: (d: number) => void
    ) => void
    getFFT: () => Float32Array

    constructor(components: ToneComponents) {
        this.player = components.player
        this.filter = components.filter
        this.envelope = components.envelope
        this.gain = components.gain
        this.fft = components.fft

        this.startPlayer = (onStart) => {
            context.resume()
                .then(() => this.player.start(now()))
                .then(() => onStart?.())
                .catch(console.warn)
        }

        this.stopPlayer = () => {
            this.player.stop("+0.1")
        },

            this.setReverse = () => {
                this.player.reverse = !this.player.reverse
            }

        this.resetGrainPlayer = (url: ToneAudioBufferTarget) => {
            const newBuffer: ToneAudioBuffer = new ToneAudioBuffer(url, () => this.player.buffer = newBuffer)
        }

        this.resetGrainPlayerAndSampleDuration = (url: ToneAudioBufferTarget, setSampleDuration: (d: number) => void) => {
            const newBuffer: ToneAudioBuffer = new ToneAudioBuffer(url, () => {
                this.player.buffer = newBuffer
                this.player.loopStart = 0
                this.player.loopEnd = this.player.buffer.duration
                setSampleDuration(this.player.buffer.duration)
            })
        }

        this.getFFT = () => {
            return this.fft.getValue()
        }
    }
}
