import React, { type FC } from 'react'
import type { AudioObject } from '../utils/types'
import { Visualizer } from './Visualizer'
import { StemSelect } from './StemSelect'
import { type Stem } from '@prisma/client'

export type ScreenMode = 'info' | 'visualizer' | 'stems' | 'record'

type ScreenProps = {
    screenMode: ScreenMode
    audioObject: AudioObject
    stems?: Stem[]
    currentlyPlaying: string
    setSampleDuration: (d: number) => void
    onStemSelect: (stem: Stem) => void
}

export const Screen: FC<ScreenProps> = ({
    screenMode,
    audioObject,
    stems,
    currentlyPlaying,
    onStemSelect
}) => {

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
            return (<div className='height-full'>
                <p className={'screen-text'}>current sample:</p>
                <p className={'screen-text'}>{currentlyPlaying}</p>
                <Visualizer audioObject={audioObject} />
            </div>)
        }
        case 'stems': {
            return (<div>
                <p className={'screen-text'}>current sample: {currentlyPlaying}</p>
                <StemSelect {...{ stems, onStemSelect, currentlyPlaying }} />
            </div>)
        }
    }
}