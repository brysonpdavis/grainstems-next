import React, {type FC} from 'react'
import { type Icon } from 'react-feather'
import { activeButtonStyles } from '../styles/dynamic-css'

type StateButtonProps = {
    active: boolean
    onClick: () => void
    Icon?: Icon
    text?: string
}

export const StateButton: FC<StateButtonProps> = ({active, onClick, Icon, text}) => (
    <button onClick={onClick} className={`action-button ${active && 'active'}`} style={active ? activeButtonStyles : {}}>
        {Icon && <Icon />}
        {text && text}
    </button>
)