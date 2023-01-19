import React, {type FC} from 'react'
import { type Icon } from 'react-feather'
import { activeButtonStyles } from '../styles/dynamic-css'

type StateButtonProps = {
    active: boolean
    onClick: () => void
    Icon: Icon
}

export const StateButton: FC<StateButtonProps> = ({active, onClick, Icon}) => (
    <button onClick={onClick} className='action-button' style={active ? activeButtonStyles : {}}>
        <Icon />
    </button>
)