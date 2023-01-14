import { useState, useEffect} from 'react'
import type {
  GrainPlayer,
  Filter,
  AmplitudeEnvelope,
  Gain,
  FFT
} from 'tone'
import { ToneAudioBuffer, context, now } from 'tone'
import { setupTone, type ToneComponents } from '../utils/tone'
import { api } from "../utils/api";

const { useQuery: useGetAllStemsQuery } = api.example.getAll

export class AudioObject implements AudioObject {
  player: GrainPlayer
  filter: Filter
  envelope: AmplitudeEnvelope
  gain: Gain
  fft: FFT
  startPlayer: () => void
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

    this.startPlayer = () => {
      context.resume()
        .then(() => this.player.start(now()))
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

const AudioContainer: React.FC<{ children: React.FC<ChildProps> }> = ({ children: child }) => {
  const [playerLoaded, setPlayerLoaded] = useState(false)
  const [audioObject, setAudioObject] = useState<AudioObject>()

  const stemsQuery = useGetAllStemsQuery()

  useEffect(() => {
    if (stemsQuery.status === 'success') {
      console.log('starting...')
      const components = setupTone({
        onload: () => setPlayerLoaded(true),
        detune: 0,
        url: stemsQuery.data.at(0)?.url,
        mute: false,
        loop: true,
        reverse: false,
        grainSize: 0.5,
        overlap: 0.01,
        playbackRate: 1,
      })  
      setAudioObject(new AudioObject(components))
    }

  }, [stemsQuery.status, stemsQuery.data])

  const frequencyBandArray = [...Array(64).keys()]

  return child({ audioObject, frequencyBandArray, isLoaded: playerLoaded })
}

export default AudioContainer;
