import React, { type FC } from 'react'
import { type AudioObject } from '../utils/types'
import { Visualizer } from './Visualizer'
import { Stems } from './Stems'
import { type Stem } from '@prisma/client'
import { api } from '../utils/api'

export type ScreenMode = 'info' | 'visualizer' | 'stems' | 'record'

type ScreenProps = {
    screenMode: ScreenMode
    audioObject: AudioObject
    currentlyPlaying: string
    setCurrentlyPlaying: (s: string) => void
    setSampleDuration: (d: number) => void
}

export const Screen: FC<ScreenProps> = ({
    screenMode,
    audioObject,
    currentlyPlaying,
    setCurrentlyPlaying,
    setSampleDuration
}) => {

    const onStemClick = (stem: Stem) => {
        setCurrentlyPlaying(stem.name)
        audioObject.resetGrainPlayerAndSampleDuration(stem.url, setSampleDuration)
    }

    const { data: stems } = api.stems.getAll
        .useQuery(undefined, {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            onSuccess: (s) => onStemClick(s[0]!)
        })

    switch (screenMode) {
        case 'info': {
            return (<div>
                <p className={'screen-text'}>welcome to grainstems!</p>
                <p className={'screen-text'}>
                    grainstems is a granular synthesizer, meaning it manipulates audio samples into interesting new sounds.
                    to get started, choose a sample from below and press start.
                    mouse over any parameter name for a brief description of what it does, and
                    if you would like to share a sample of your own for granularization,
                    feel free to upload one for others to use.
                    have fun experimenting!
                </p>
            </div>)
        }
        case 'record': {
            return <p className='screen-text'>record + export functionaltiy on the way</p>
        }
        case 'visualizer': {
            return (<div>
                <p className={'screen-text'}>current sample:</p>
                <p className={'screen-text'}>{currentlyPlaying}</p>
                <Visualizer audioObject={audioObject} />
            </div>)
        }
        case 'stems': {
            return (<div>
                <p className={'screen-text'}>current sample: {currentlyPlaying}</p>
                <Stems {...{ stems, onStemClick }} />
            </div>)
        }
    }
}