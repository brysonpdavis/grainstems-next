import React, { type FC, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { type Stem } from '@prisma/client'
import { modulo } from '../utils/functions'

type StemsProps = {
    stems?: Stem[] 
    onStemSelect: (s: Stem) => void
    currentlyPlaying: string
}

const PAGE_SIZE = 12

export const StemSelect: FC<StemsProps> = ({ stems, onStemSelect, currentlyPlaying }) => {
    const [page, setPage] = useState(0)

    const pages = Math.ceil((stems?.length || 0) / PAGE_SIZE)
    const min = page * PAGE_SIZE

    return (
        <div>
            <div className='row justify-between'>
                <p className='screen-text'>{stems ? 'samples' : 'fetching samples...'}</p>
                <div>
                    <button
                        className='stem-button page-button'
                        onClick={() => setPage(prev => modulo(prev - 1, pages))}
                    >
                        <ChevronLeft />
                    </button>
                    <button 
                        className='stem-button page-button'
                        onClick={() => setPage(prev => modulo(prev + 1, pages))}
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
            <div className='stem-buttons-container'>
                {stems && stems.map((stem, idx) => {
                    if (min <= idx && idx < min + PAGE_SIZE) {
                        return (
                            <button 
                                className={`stem-button ${stem.name === currentlyPlaying && 'stem-button-active'}`} 
                                key={stem.id} 
                                onClick={() => onStemSelect(stem)}
                            >
                                {stem.name}
                            </button>
                        )
                    }
                }
                )}
            </div>
        </div>
    )
} 