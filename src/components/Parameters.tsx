import React, { type FC } from 'react'
import { type AudioObject } from '../utils/types'
import { KnobParameter } from './KnobParameter'
import { tooltips } from '../utils/constants/tooltip-text'
import { ReverseButton } from './ReverseButton'

type ParamatersProps = { // ahaha
    audioObject: AudioObject
    sampleDuration: number
}

export const Parameters: FC<ParamatersProps> = ({ audioObject, sampleDuration }) => (
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
                    label={'sample speed'}
                    tooltip={tooltips.sampleSpeed}
                    show={v => Math.floor((v ** 2) * 100)}
                    units={'%'}
                    onChange={(v) => audioObject.player.playbackRate = v ** 2}
                    startVal={1}
                    min={0.1}
                    max={3}
                />
                <KnobParameter
                    label={'tuning'}
                    tooltip={tooltips.tuning}
                    // show={v => Math.floor(v / 10) / 10}
                    // units={<>1&frasl;2 tones</>}
                    show={v => `${v < 0 ? '' : '+'}${Math.floor(v / 120) / 10}`}
                    units={'octaves'}
                    onChange={(v) => { audioObject.player.detune = v }}
                    startVal={0}
                    min={-3600}
                    max={3600}
                />
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
                <td>
                    <ReverseButton audioObject={audioObject} />
                </td>
            </tr>
        </tbody>
    </table>
)
