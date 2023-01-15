import React, { useEffect, useState, type FC } from 'react'
import { Paper, Grid, Dialog, DialogContent, DialogContentText } from '@mui/material'
import { Info, Play, Upload } from 'react-feather'
import { type Properties } from 'csstype'

import { type AudioObject } from './AudioContainer'
import { Visualizer } from './Visualizer'
import { KnobParameter } from './KnobParameter'
import { tooltips } from '../utils/constants/tooltip-text'
import { api } from "../utils/api";
import { Tooltip } from './ui/Tooltip'

const { useQuery: useGetAllStemsQuery } = api.example.getAll

type GrainstemsProps = {
    audioObject?: AudioObject
    frequencyBandArray: number[]
    isLoaded: boolean
}

const activeButtonStyle: Properties = { borderColor: '#c0f3fc', boxShadow: '0px 0px 60px -5px' }

export const Grainstems: FC<GrainstemsProps> = ({ audioObject, frequencyBandArray, isLoaded }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentlyPlaying, setCurrentlyPlaying] = useState('ambient piano')
    const [sampleDuration, setSampleDuration] = useState(0)
    const [reversed, setReversed] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [uploadEnabled, setUploadEnabled] = useState(false)

    const stemsQuery = useGetAllStemsQuery(undefined, { refetchOnWindowFocus: false })

    useEffect(() => {
        const defaultStem = stemsQuery.data?.find((stem) => stem.name === 'piano')

        if (audioObject && stemsQuery.status === 'success' && defaultStem) {
            audioObject.resetGrainPlayerAndSampleDuration(defaultStem.url, setSampleDuration)
        }
    }, [stemsQuery.status, stemsQuery.data, audioObject])

    if (!audioObject) {
        return <p>{'L O A D I N G . . .'}</p>
    }

    const StartButton =
        <button
            disabled={!isLoaded}
            style={isPlaying ? activeButtonStyle : undefined}
            onClick={() => {
                if (!isPlaying) {
                    audioObject.startPlayer(() => setIsPlaying(audioObject.player.state === 'started'))
                } else {
                    audioObject.stopPlayer()
                    setIsPlaying(false)
                }
            }}
        >
            <Play />
        </button>

    const InfoButton =
        <button onClick={() => setShowInfo(!showInfo)} style={showInfo ? activeButtonStyle : {}}>
            <Info />
        </button>

    const UploadButton =
        <button onClick={() => setUploadEnabled(!uploadEnabled)}>
            <Upload />
        </button>

    return (
        <>
            <Paper elevation={4} className={'interface-container'} style={{ background: '#2D2D2D' }}>
                <div className={'interface'}>
                    <h2 className={"title"}>grainstems</h2>
                    <Grid container spacing={0}>
                        <Grid item xs={4}>
                            <div>
                                <div className='column'>
                                    <h3 className={"subtitle"}>a toy granular synth</h3>
                                    <div className='row'>
                                        {StartButton}
                                        {InfoButton}
                                        {UploadButton}
                                    </div>
                                    <div>
                                        <p>samples</p>
                                        {stemsQuery.data?.map((stem) =>
                                            <button key={stem.id} onClick={() => {
                                                setCurrentlyPlaying(stem.name)
                                                audioObject.resetGrainPlayerAndSampleDuration(stem.url, setSampleDuration)
                                            }}>
                                                {stem.name}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={8} className={'screen main-screen'}>
                            {
                                showInfo
                                    ?
                                    <>
                                        <p className={'screen-text'}>welcome to grainstems!</p>
                                        <p className={'screen-text'}>
                                            grainstems is a granular synthesizer, meaning it manipulates audio samples into interesting new sounds.
                                            to get started, choose a sample from below and press start.
                                            mouse over any parameter name for a brief description of what it does, and
                                            if you would like to share a sample of your own for granularization,
                                            feel free to upload one for others to use.
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
                    <br />
                    <table>
                        <tbody>
                            <tr>
                                <KnobParameter
                                    label={"grain size"}
                                    tooltip={tooltips.grainSize}
                                    onChange={(v) => { audioObject.player.grainSize = v / 10 }}
                                    show={v => Math.floor(10 * v) / 100}
                                    units={'s'}
                                    startVal={5}
                                    min={0.1}
                                    max={10}
                                />
                                <KnobParameter
                                    label={"overlap"}
                                    tooltip={tooltips.overlap}
                                    onChange={(v) => { audioObject.player.overlap = audioObject.player.grainSize as number * (v / 10) }}
                                    show={v => Math.floor(10 * v)}
                                    units={'%'}
                                    startVal={5}
                                    min={0.1}
                                    max={10}
                                />
                                <KnobParameter
                                    label={'tuning'}
                                    tooltip={tooltips.tuning}
                                    // show={v => Math.floor(v / 10) / 10}
                                    // units={<>1&frasl;2 tones</>}
                                    show={v => Math.floor(v / 120) / 10}
                                    units={'octaves'}
                                    onChange={(v) => { audioObject.player.detune = v }}
                                    startVal={0}
                                    min={-3600}
                                    max={3600}
                                />
                                <td>
                                    <Tooltip text={tooltips.reverse}>
                                        <button
                                            className={'reverse-button'}
                                            style={reversed ? activeButtonStyle : undefined}
                                            onClick={() => {
                                                audioObject.setReverse()
                                                setReversed(!reversed)
                                            }
                                            }
                                        >
                                            reverse
                                        </button>
                                    </Tooltip>
                                </td>
                            </tr>
                            <tr>
                                <KnobParameter
                                    label={'loop start'}
                                    tooltip={tooltips.loopStart}
                                    show={v => Math.floor(v * 100) / 100}
                                    units={'s'}
                                    onChange={(v) => { audioObject.player.loopStart = v }}
                                    startVal={0}
                                    min={0}
                                    max={sampleDuration}
                                />
                                <KnobParameter
                                    label={'loop end'}
                                    tooltip={tooltips.loopEnd}
                                    show={v => Math.floor(v * 100) / 100}
                                    units={'s'}
                                    onChange={(v) => { audioObject.player.loopEnd = v }}
                                    startVal={sampleDuration}
                                    min={0}
                                    max={sampleDuration}
                                />
                                <KnobParameter
                                    label={'filter cutoff'}
                                    tooltip={tooltips.filterCutoff}
                                    show={v => Math.floor(2 ** v)}
                                    units={'Hz'}
                                    onChange={(v) => { audioObject.filter.frequency.rampTo(2 ** v, 0) }}
                                    startVal={14.28778}
                                    min={5}
                                    max={14.28778}
                                />
                                <KnobParameter
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
            <Dialog open={uploadEnabled} onClose={() => setUploadEnabled(false)}>
                <DialogContent sx={{ background: 'black' }}>
                    <DialogContentText sx={{ color: 'white' }}>
                        <h3>
                            feature to upload samples of your own is on the way.
                        </h3>
                        <br />
                        <h3>
                            patience...
                        </h3>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}