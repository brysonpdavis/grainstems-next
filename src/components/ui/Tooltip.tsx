import React, { type FC } from 'react'
import MuiTooltip, {type TooltipProps as MuiTooltipProps} from '@mui/material/Tooltip'

type TooltipProps = {
    text: string
    children: JSX.Element
}

const tooltipStyle: MuiTooltipProps['componentsProps'] = {
    arrow: { sx: { color: 'black' } },
    tooltip: {
        sx: {
            fontSize: '1em',
            fontWeight: '300',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            padding: '1.5em',
            bgcolor: 'black'
        }
    }
}

export const Tooltip: FC<TooltipProps> = ({ text, children }) => {

    return (
        <MuiTooltip arrow title={text} placement='top-start' componentsProps={tooltipStyle}>
            {children}
        </MuiTooltip>
    )
}