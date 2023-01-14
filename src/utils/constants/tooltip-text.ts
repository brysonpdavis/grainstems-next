const grainSize = 'the granular engine breaks the sample down into \
    tiny "grains" of sound which can then be overlapped or played with \
    more or less time between them to slow down or speed up the sample without \
    affecting pitch. this parameter determines the size of those "grains".' as const

const overlap = 'since the sample is chopped up into "grains" of sound, the result \
    can often be choppy or unnatural sounding. the bits of sound can be overlapped to \
    make them sound more natural. the results of this parameter can be surprising, so \
    play around with it. the percent displayed is the amount that one grain of sound \
    overlaps with the grain before or after it.' as const

const tuning = 'adjusts the tuning of the granularized sample relative to the \
    original. 12 semitones is an octave and 7 semitones is a perfect fifth.' as const

const loopStart = 'the granular engine loops through the sample again and again. \
    this parameter sets at what point in time in the sample that loop begins.' as const

const loopEnd = 'this parameter sets at what point in time in the sample that the loop ends.' as const

const filterCutoff = 'this parameter can filter out higher frequencies. when you lower the filter \
    cutoff, listen for how the higher frequencies get quieter or disappear.' as const

const sampleSpeed = 'this parameter adjusts how quickly the synth will loop through \
    the sample selection. 200% will be twice as fast, and 50% will be half as fast.' as const

const reverse = 'reverses playthrough of the sample selection.' as const

export const tooltips = {
    grainSize,
    overlap,
    tuning,
    loopStart,
    loopEnd,
    filterCutoff,
    sampleSpeed,
    reverse
}