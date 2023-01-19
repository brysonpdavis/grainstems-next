import React, { useState, type FC } from 'react'
import { Paper, Grid, Dialog, DialogContent } from '@mui/material'
import { Info, Play, Upload, Pause, Mic, BarChart2, Music } from 'react-feather'

import { type AudioObject } from '../utils/types'
import { UploadForm } from './UploadForm'
import { Parameters } from './Parameters'
import {type ScreenMode, Screen} from './Screen'
import { StateButton } from './StateButton'
import { activeButtonStyles } from '../styles/dynamic-css'
import { electricBlue } from '../utils/constants/colors'

type GrainstemsProps = {
    audioObject?: AudioObject
    isLoaded: boolean
}

export const Grainstems: FC<GrainstemsProps> = ({ audioObject, isLoaded }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentlyPlaying, setCurrentlyPlaying] = useState('-')
    const [screenMode, setScreenMode] = useState<ScreenMode>('visualizer')
    const [uploadEnabled, setUploadEnabled] = useState(false)
    const [sampleDuration, setSampleDuration] = useState(0)

    if (!audioObject) {
        return <p>{'L O A D I N G . . .'}</p>
    }

    const StartButton =
        <button
            disabled={!isLoaded}
            className='play-button'
            style={isPlaying ? activeButtonStyles : undefined}
            onClick={() => {
                if (!isPlaying) {
                    audioObject.startPlayer(() => setIsPlaying(audioObject.player.state === 'started'))
                } else {
                    audioObject.stopPlayer()
                    setIsPlaying(false)
                }
            }}
        >
            <Play fill={isPlaying ? electricBlue : 'none'} />
            <Pause fill={!isPlaying ? electricBlue : 'none'} />
        </button>

    const InfoButton = 
        <StateButton onClick={() => setScreenMode('info')} active={screenMode === 'info'} Icon={Info} />

    const UploadButton =
        <StateButton onClick={() => setUploadEnabled(true)} active={uploadEnabled} Icon={Upload} />

    const RecordButton =
        <StateButton onClick={() => setScreenMode('record')} active={screenMode === 'record'} Icon={Mic} />

    const VisualizerButton =
        <StateButton onClick={() => setScreenMode('visualizer')} active={screenMode === 'visualizer'} Icon={BarChart2} />

    const ChooseSampleModeButton =
            <StateButton onClick={() => setScreenMode('stems')} active={screenMode === 'stems'} Icon={Music} />

    return (
        <>
            <Paper elevation={4} className={'interface-container'} sx={{ background: '#2D2D2D' }}>
                <div className={'interface'}>
                    <h2 className={"title"}>grainstems</h2>
                    <Grid container spacing={0}>
                        <Grid item xs={4}>
                            <div className='column mr'>
                                <h3 className={"subtitle"}>a toy granular synth</h3>
                                <div className='row'>
                                    {StartButton}
                                    {InfoButton}
                                    {VisualizerButton}
                                    {ChooseSampleModeButton}
                                    {/* {RecordButton} */}
                                    {UploadButton}                                    
                                </div>
                            </div>
                        </Grid>
                        <Screen 
                            {...{
                                audioObject, 
                                screenMode, 
                                currentlyPlaying, 
                                setCurrentlyPlaying, 
                                setSampleDuration
                            }} />
                    </Grid>
                    <br />
                    <Parameters {...{sampleDuration, audioObject}} />
                </div>
            </Paper>
            <Dialog open={uploadEnabled} onClose={() => setUploadEnabled(false)}>
                <DialogContent sx={{ background: 'black' }}>
                    <UploadForm />
                </DialogContent>
            </Dialog>
        </>
    )
}