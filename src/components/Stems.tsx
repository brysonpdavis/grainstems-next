import React, { type FC, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { type Stem } from '@prisma/client'

type StemsProps = {
    onStemClick: (s: Stem) => void
    stems?: Stem[] 
}

const PAGE_SIZE = 12

export const Stems: FC<StemsProps> = ({ onStemClick, stems }) => {
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
                        onClick={() => setPage(prev => (prev - 1) % pages)}
                    >
                        <ChevronLeft />
                    </button>
                    <button 
                        className='stem-button page-button'
                        onClick={() => setPage(prev => (prev + 1) % pages)}
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
            <div className='stem-buttons-container'>
                {stems && stems?.map((stem, idx) => {
                    if (min <= idx && idx < min + PAGE_SIZE) {
                        return <button className='stem-button' key={stem.id} onClick={() => onStemClick(stem)}>
                            {stem.name}
                        </button>
                    }
                }
                )}
            </div>
        </div>
    )
} 