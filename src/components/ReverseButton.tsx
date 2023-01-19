import React, { type FC, useState } from 'react'
import { Tooltip } from './ui/Tooltip'
import { tooltips } from '../utils/constants/tooltip-text'
import { activeButtonStyles } from '../styles/dynamic-css'
import { type AudioObject } from '../utils/types'

type ReverseButtonProps = {
    audioObject: AudioObject
}

export const ReverseButton: FC<ReverseButtonProps> = ({ audioObject }) => {

    const [reversed, setReversed] = useState(false)

    return <Tooltip text={tooltips.reverse}>
        <button
            className={'reverse-button'}
            style={reversed ? activeButtonStyles : undefined}
            onClick={() => {
                audioObject.setReverse()
                setReversed(r => !r)
            }}
        >
            <h3>reverse</h3>
        </button>
    </Tooltip>

}