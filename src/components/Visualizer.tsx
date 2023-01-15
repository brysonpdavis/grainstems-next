import React, { useRef, type FC } from 'react'
import { Paper } from '@mui/material'
import { type AudioObject } from './AudioContainer'

type VisualizerTypes = {
    audioObject: AudioObject
    frequencyBandArray: number[]
    visible: boolean
}

export const Visualizer: FC<VisualizerTypes> = ({ audioObject, frequencyBandArray, visible }) => {

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
            // if (bandValue > 50) {
                const fraction = Math.log10(200 + bandValue) - 1.5

                bandElement.style.height = `${fraction * 210}px`
                bandElement.style.opacity = `${(Math.log10(200 + bandValue) - 1.5)}`
            // } else {
            //     bandElement.style.opacity = '0'
            // }
        }
    }

    const getFrequencyData = () => {
        const amplitudeArray = audioObject.fft.getValue()
        adjustFreqBandStyle(amplitudeArray)
    }

    const handleStartButtonClick = () => {
        setInterval(() => requestAnimationFrame(getFrequencyData), 80)

    }

    handleStartButtonClick()

    return (
        <div className='vis-container' style={{ height: (visible ? 'calc(100% - 6em)' : '0') }}>
            {frequencyBandArray.map((num, idx) =>
                <Paper
                    className={'frequencyBands'}
                    id={num.toString()}
                    key={idx}
                    sx={{backgroundColor: 'rgb(192, 243, 252)'}}
                />
            )}
        </div>
    )
}