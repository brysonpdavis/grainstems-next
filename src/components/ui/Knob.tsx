import React, { type PointerEventHandler, type FC, useEffect, useState } from 'react'
import { type Properties } from 'csstype'
import { electricBlue } from '../../utils/constants/colors'

export interface KnobProps {
    startVal?: number
    min?: number
    max?: number
    rotationRange?: number
    pixelRange?: number
    startRotationPosition?: number
    diameter?: number
    color?: string
    lineColor?: string
    onChange: (v: number) => void
}

export const Knob: FC<KnobProps> = ({
    startVal = 0,
    min = 0,
    max = 100,
    rotationRange = Math.PI * 2 * 0.9,
    pixelRange = 250,
    startRotationPosition = -Math.PI * 0.9,
    diameter = 80,
    color = '#555',
    lineColor = electricBlue,
    onChange
}) => {
    const [val, setVal] = useState(startVal)

    useEffect(() => {
        setVal(startVal)
    }, [max, startVal])

    useEffect(() => {
        onChange(val)
    }, [val])

    const valueRange = max - min
    const rotation = startRotationPosition + (val - min) / valueRange * rotationRange
    let startY: number, startValue: number;

    const knobContainerStyle: Properties = {
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 'fit-content',
        width: 'fit-content',
        boxShadow: `5px 5px 10px`,
        borderRadius: '100rem'
    }

    const knobStyle: Properties = {
        touchAction: 'none',
        display: 'grid',
        position: 'relative',
        placeItems: 'center',
        padding: '0',
        transform: `rotate(calc(${rotation} * 1rad))`,
        transformOrigin: '50% 50%',
        overflow: 'visible',
        borderRadius: '50%',
        width: 'min-content'
    }

    const clamp = (num: number, min: number, max: number) => {
        return Math.max(min, Math.min(num, max))
    }

    const pointerDown: PointerEventHandler = ({ clientY }) => {
        startY = clientY
        startValue = val
        globalThis.addEventListener('pointermove', pointerMove)
        globalThis.addEventListener('mouseup', pointerUp)
        globalThis.addEventListener('touchend', pointerUp)
    }

    const pointerMove = ({ clientY }: PointerEvent) => {
        const valueDiff = (max - min) * (clientY - startY) / pixelRange
        setVal(clamp(startValue - valueDiff, min, max))
    }

    const pointerUp = () => {
        globalThis.removeEventListener('pointermove', pointerMove)
        globalThis.removeEventListener('mouseup', pointerUp)
        globalThis.removeEventListener('touchend', pointerUp)
    }

    return (
        <div style={knobContainerStyle}>
            <div style={knobStyle} onPointerDown={pointerDown} onDoubleClick={() => setVal(startVal)}>
                <svg overflow='visible' width={diameter} height={diameter}>
                    <g>
                        <ellipse
                            ry={diameter / 2}
                            rx={diameter / 2}
                            cy={diameter / 2}
                            cx={diameter / 2}
                            fill={color}
                            stroke="#888"
                            strokeWidth="1.5px"
                        />
                        <line
                            stroke={lineColor}
                            strokeWidth={6}
                            strokeLinecap="round"
                            strokeLinejoin={undefined}
                            y2={diameter / 2}
                            x2={diameter / 2}
                            y1={0}
                            x1={diameter / 2}
                            filter={`drop-shadow(0 0 14px ${lineColor})`}
                        />
                    </g>
                </svg>
            </div>
        </div>
    )
}
