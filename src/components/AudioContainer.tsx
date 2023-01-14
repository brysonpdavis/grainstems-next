import React, { useState, useEffect } from 'react'
import {
  ToneAudioBuffer,
  GrainPlayer,
  Filter,
  AmplitudeEnvelope,
  Gain,
  FFT,
  context,
  now
} from 'tone'
import { setupTone, ToneComponents } from '../lib/setup-tone'
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
      this.player.start(now())
    }

    this.stopPlayer = () => {
      this.player.stop("+0.1")
    },

      this.setReverse = () => {
        this.player.reverse = !this.player.reverse
      }

    this.resetGrainPlayer = (url: ToneAudioBufferTarget) => {
      let newBuffer: ToneAudioBuffer = new ToneAudioBuffer(url, () => this.player.buffer = newBuffer)
    }

    this.resetGrainPlayerAndSampleDuration = (url: ToneAudioBufferTarget, setSampleDuration: (duration: number) => void) => {
      var newBuffer: ToneAudioBuffer = new ToneAudioBuffer(url, () => {
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

  const thing = useGetAllStemsQuery()

  useEffect(() => {
    if (thing.status === 'success') {
      console.log('starting...')
      const components = setupTone({
        onload: () => setPlayerLoaded(true),
        detune: 0,
        url: thing.data.at(0)?.url,
        mute: false,
        loop: true,
        reverse: false,
        grainSize: 0.5,
        overlap: 0.01,
        playbackRate: 1,
      })  
      setAudioObject(new AudioObject(components))
    }

  }, [thing.status])

  const frequencyBandArray = [...Array(64).keys()]

  return child({ audioObject, frequencyBandArray, isLoaded: playerLoaded })
}

export default AudioContainer;
