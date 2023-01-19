import React, { type FC, useState } from 'react'
import { ChevronsLeft } from 'react-feather'
import { Tooltip } from './ui/Tooltip'
import { tooltips } from '../utils/constants/tooltip-text'
import { type AudioObject } from '../utils/types'
import { StateButton } from './ui/StateButton'

type ReverseButtonProps = {
    audioObject: AudioObject
}

export const ReverseButton: FC<ReverseButtonProps> = ({ audioObject }) => {

    const [reversed, setReversed] = useState(false)

    return <Tooltip text={tooltips.reverse}><div className='reverse-container'>
        <StateButton
            active={reversed}
            onClick={() => {
                audioObject.setReverse()
                setReversed(r => !r)
            }}
            Icon={ChevronsLeft}
        /></div>
    </Tooltip>

}