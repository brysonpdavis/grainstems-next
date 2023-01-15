import React, { type FC, useState } from 'react'
import { type Properties } from 'csstype'
import {Tooltip} from './ui/Tooltip'
import { Knob, type KnobProps } from './ui/Knob'

interface KnobParameterProps extends KnobProps {
    label: string
    tooltip: string
    units: string | JSX.Element
    onChange: (v: number) => void
    show?: (v: number) => string | number
}

export const KnobParameter: FC<KnobParameterProps> = ({ 
    label, 
    tooltip, 
    units, 
    onChange,
    show = (v: number) => v, 
    ...knobProps
}) => {
    const [val, setVal] = useState(knobProps.startVal ?? 0)

    const tdStyle: Properties = {
        padding: '16px 0 16px 0',
        minWidth: '10rem',
        position: 'relative'
    }

    return (
        <td style={tdStyle}>
            <div className='column'>
            <Tooltip text={tooltip}>
                    <div className='parameter-label-container'>
                        <h3 className='parameter-label'>{label}</h3>
                    </div>
            </Tooltip>
            <h3> 
                <div className='row'>
                    <div className='screen value-screen'>{show(val)}</div> 
                    <div className='unit-label'>{units}</div>
                </div>
            </h3>
            <Knob {...knobProps} onChange={(v) => {setVal(v); onChange(v)} } />
            </div>
        </td>
    )
}
