import React, { useEffect, useState } from 'react'
import { Paper, Grid } from '@mui/material'

import { type AudioObject } from './AudioContainer'
import { Visualizer } from './Visualizer'
import { Knob } from './ui/Knob'
import { tooltips } from '../lib/tooltip-text'

type AppProps = {
    audioObject?: AudioObject
    frequencyBandArray: number[]
    isLoaded: boolean
}

export const App: React.FC<AppProps> = ({ audioObject, frequencyBandArray, isLoaded }) => {
    const [uploadEnabled, setUploadEnabled] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentlyPlaying, _setCurrentlyPlaying] = useState('ambient piano')
    const [sampleDuration, setSampleDuration] = useState(audioObject?.player.sampleTime)
    const [reversed, setReversed] = useState(false)
    const [showInfo, setShowInfo] = useState(false)

    const activeButtonStyle = { borderColor: '#c0f3fc', boxShadow: '0px 0px 60px -5px' }

    useEffect(() => {
        if (audioObject) {
            setSampleDuration(audioObject.player.sampleTime)
        }
    }, [audioObject])

    console.log('sample duration', sampleDuration)

    if (!audioObject) {
        return <>{'L O A D I N G . . .'}</>
    }

    return (
        <Paper elevation={4} className={'interface-container'} style={{ backgroundColor: '#383838' }}>
            <div className={'interface'}>
                <Grid container spacing={0}>
                    <Grid item xs={4}>
                        <div>
                            <h2 className={"title"}>grainstems</h2>
                            <h3 className={"subtitle"}>a toy granular synth <button onClick={() => setShowInfo(!showInfo)} style={showInfo ? activeButtonStyle : {}}>{' \u24d8'}</button></h3>

                            {
                                !isPlaying
                                    ?
                                    <button disabled={!isLoaded} onClick={() => { audioObject.startPlayer(); setIsPlaying(audioObject.player.state === 'started') }}>start</button>
                                    :
                                    <button onClick={() => { audioObject.stopPlayer(); setIsPlaying(false) }} style={activeButtonStyle}>stop</button>
                            }
                            <button onClick={() => setUploadEnabled(!uploadEnabled)} style={uploadEnabled ? activeButtonStyle : {}}>{!uploadEnabled ? "upload a sample" : "collapse"}</button>
                            {/* 
                                <Collapse in={uploadEnabled}>
                                    <UploadForm />
                                </Collapse> 
                            */}
                        </div>
                    </Grid>
                    <Grid item xs={8} className={'screen'}>
                        {
                            showInfo
                                ?
                                <>
                                    <p className={'screen-text'}>welcome to grainstems!</p>
                                    <p className={'screen-text'}>
                                        grainstems is a granular synthesizer, meaning it manipulates audio samples into interesting new sounds.
                                        to get started, choose a sample from below and press start.
                                        mouse over any parameter name for a brief description of what it does, and
                                        if you would like to share a sample of your own for granularization, feel free to upload one for others to use.
                                        have fun experimenting!
                                    </p>
                                </>
                                :
                                <>
                                    <p className={'screen-text'}>current sample:</p>
                                    <p className={'screen-text'}>{currentlyPlaying}</p>
                                </>
                        }
                        <Visualizer
                            visible={!showInfo}
                            audioObject={audioObject}
                            frequencyBandArray={frequencyBandArray}
                        />
                    </Grid>
                </Grid>
                <h3>choose sample</h3>
                {/* <FetchedStems audioObject={audioObject} setCurrentlyPlaying = {setCurrentlyPlaying} setSampleDuration={setSampleDuration}/> */}
                <br />
                <br />
                <table>
                    <tbody>
                        <tr>
                            <Knob
                                label={"grain size"}
                                tooltip={tooltips.grainSize}
                                onChange={(v) => { audioObject.player.grainSize = v / 10 }}
                                show={v => Math.floor(10 * v) / 100}
                                units={'s'}
                                startVal={5}
                                min={0.1}
                                max={10}
                            />
                            <Knob
                                label={"overlap"}
                                tooltip={tooltips.overlap}
                                onChange={(v) => { audioObject.player.overlap = audioObject.player.grainSize as number * (v / 10) }}
                                show={v => Math.floor(10 * v)}
                                units={'%'}
                                startVal={5}
                                min={0.1}
                                max={10}
                            />
                            <Knob
                                label={'tuning'}
                                tooltip={tooltips.tuning}
                                show={v => Math.floor(v / 10) / 10}
                                units={'semitones'}
                                onChange={(v) => { audioObject.player.detune = v }}
                                startVal={0}
                                min={-3600}
                                max={3600}
                            />
                            <td>
                                <button onClick={() => { audioObject.setReverse(); setReversed(!reversed) }} className={'reverse-button'} style={reversed ? activeButtonStyle : {}} >
                                    reverse
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <Knob
                                label={'loop start'}
                                tooltip={tooltips.loopStart}
                                show={v => Math.floor(v * 100000000) / 100}
                                units={'s'}
                                onChange={(v) => { audioObject.player.loopStart = v }}
                                startVal={0}
                                min={0}
                                max={sampleDuration}
                            />
                            <Knob
                                label={'loop end'}
                                tooltip={tooltips.loopEnd}
                                show={v => Math.floor(v * 100000000) / 100}
                                units={'s'}
                                onChange={(v) => { audioObject.player.loopEnd = v }}
                                startVal={sampleDuration}
                                min={0}
                                max={sampleDuration}
                            />
                            <Knob
                                label={'filter cutoff'}
                                tooltip={tooltips.filterCutoff}
                                show={v => Math.floor(2 ** v)}
                                units={'Hz'}
                                onChange={(v) => { audioObject.filter.frequency.rampTo(2 ** v, 0) }}
                                startVal={14.28778}
                                min={5}
                                max={14.28778}
                            />
                            <Knob
                                label={'sample speed'}
                                tooltip={tooltips.sampleSpeed}
                                show={v => Math.floor((v ** 2) * 100)}
                                units={'%'}
                                onChange={(v) => audioObject.player.playbackRate = v ** 2}
                                startVal={1}
                                min={0.1}
                                max={3}
                            />
                        </tr>
                    </tbody>
                </table>
            </div>
        </Paper>
    )
}