import React, { useEffect, useRef, type FC } from 'react'
import { Paper } from '@mui/material'
import { type AudioObject } from '../utils/types'
import { NUM_OF_BARS } from '../utils/constants/visualizer'

type VisualizerTypes = {
    audioObject: AudioObject
}

const frequencyBandArray = [...Array(NUM_OF_BARS).keys()]

export const Visualizer: FC<VisualizerTypes> = ({ audioObject }) => {

    const amplitudeValues = useRef<number[] | null>(null)

    const adjustFreqBandStyle = (newAmplitudeData: Float32Array) => {
        amplitudeValues.current = Array.from(newAmplitudeData)
        const domElements = frequencyBandArray.map((num) =>
            document.getElementById(num.toString())
        )

        if (!amplitudeValues.current) return

        for (const num of frequencyBandArray) {
            const bandValue = amplitudeValues.current[num]!
            const bandElement = domElements[num]!

            bandElement.style.height = `${(bandValue + 200)}px`
            bandElement.style.opacity = `${((bandValue + 200) / 200)}`
        }
    }

    const getFrequencyData = () => {
        const amplitudeArray = audioObject.fft.getValue()
        adjustFreqBandStyle(amplitudeArray)
    }

    let interval: NodeJS.Timer

    const handleStartButtonClick = () => {
        interval = setInterval(() => requestAnimationFrame(getFrequencyData), 33.333) // 30 fps
    }

    useEffect(() => {
        if (audioObject.player.state === 'started') {
            handleStartButtonClick()
        }

        return () => {
            clearInterval(interval)
        }
    }, [audioObject.player.state])

    return (
        <div className='vis-container' style={{ height: 'calc(100% - 6em)' }}>
            {frequencyBandArray.map((num, idx) =>
                <Paper
                    className={'frequencyBands'}
                    id={num.toString()}
                    key={idx}
                    sx={{ backgroundColor: 'rgb(192, 243, 252)' }}
                />
            )}
        </div>
    )
}