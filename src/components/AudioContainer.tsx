import { useState, useEffect, type FC} from 'react'
import type {
  GrainPlayer,
  Filter,
  AmplitudeEnvelope,
  Gain,
  FFT
} from 'tone'
import { ToneAudioBuffer, context, now } from 'tone'
import { setupTone, type ToneComponents } from '../utils/tone'

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
  resetGrainPlayerAndSampleDuration: 
    (
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

    this.resetGrainPlayerAndSampleDuration = (url: ToneAudioBufferTarget, setSampleDuration: (duration: number) => void) => {
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

type ToneAudioBufferTarget = string | ToneAudioBuffer | AudioBuffer | undefined

type ChildProps = {
  audioObject?: AudioObject
  frequencyBandArray: number[]
  isLoaded: boolean
}

const AudioContainer: FC<{ children: FC<ChildProps> }> = ({ children: child }) => {
  const [playerLoaded, setPlayerLoaded] = useState(false)
  const [audioObject, setAudioObject] = useState<AudioObject>()

  useEffect(() => {
      console.log('starting...')
      const components = setupTone({
        onload: () => setPlayerLoaded(true),
        detune: 0,
        url: "https://grainstems.s3.amazonaws.com/6219011-piano1.wav",
        mute: false,
        loop: true,
        reverse: false,
        grainSize: 0.5,
        overlap: 0.01,
        playbackRate: 1,
      })  
      setAudioObject(new AudioObject(components))
  }, [])

  const frequencyBandArray = [...Array(64).keys()]

  return child({ audioObject, frequencyBandArray, isLoaded: playerLoaded })
}

export default AudioContainer;
