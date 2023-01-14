import React, { useRef } from 'react'
import { Paper } from '@mui/material'
import { AudioObject } from './AudioContainer'

type VisualizerTypes = {
    audioObject: AudioObject
    frequencyBandArray: number[]
    visible: boolean
}

export const Visualizer: React.FC<VisualizerTypes> = ({ audioObject, frequencyBandArray, visible }) => {

    const amplitudeValues = useRef<number[] | null>(null)

    const adjustFreqBandStyle = (newAmplitudeData: Float32Array) => {
        amplitudeValues.current = Array.from(newAmplitudeData)
        const domElements = frequencyBandArray.map((num) =>
            document.getElementById(num.toString())
        )

        if (!amplitudeValues.current) return

        for (let i = 0; i < frequencyBandArray.length; i++) {
            let num = frequencyBandArray[i]
            domElements[num!]!.style.backgroundColor = `rgba(192, 243, 252, ${(amplitudeValues.current[num!]! + 180) / 180})`
            domElements[num!]!.style.height = `${amplitudeValues.current[num!]! + 200}px`
        }
    }

    const getFrequencyData = () => {
        const amplitudeArray = audioObject.fft.getValue()
        adjustFreqBandStyle(amplitudeArray)
    }

    const runSpectrum = () => {
        getFrequencyData()
        requestAnimationFrame(runSpectrum)
    }

    const handleStartButtonClick = () => {
        requestAnimationFrame(runSpectrum)
    }

    handleStartButtonClick()

    return (
        <div className='vis-container' style={{ height: (visible ? 'calc(100% - 6em)' : '0') }}>
            {frequencyBandArray.map((num, idx) =>
                <Paper
                    className={'frequencyBands'}
                    id={num.toString()}
                    key={idx}
                />
            )}
        </div>
    )
}