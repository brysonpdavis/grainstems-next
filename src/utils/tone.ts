import { Gain, FFT, Filter, AmplitudeEnvelope, GrainPlayer, Destination } from 'tone'
  
 type GrainPlayerOptions = ConstructorParameters<typeof GrainPlayer>[number]

export type ToneComponents = {
    player: GrainPlayer
    filter: Filter
    gain: Gain
    envelope: AmplitudeEnvelope
    fft: FFT
}

export const setupTone = (playerOptions: GrainPlayerOptions): ToneComponents => {
    const fft = new FFT(256)

    const gain = new Gain(1)

    const envelope = new AmplitudeEnvelope({
        attack: 0.1,
        decay: 0.1,
        sustain: 0,
        release: 0.5,
    })

    const filter = new Filter((2 ** 15), "lowpass", -24)

    const player = new GrainPlayer(playerOptions)

    player.chain(filter, gain, fft, Destination)

    return { player, filter, gain, envelope, fft }
}


