import { useState, useEffect, type FC} from 'react'
import { setupTone } from '../utils/tone'
import { AudioObject } from '../utils/types'


type ChildProps = {
  audioObject?: AudioObject
  isLoaded: boolean
}

const AudioContainer: FC<{ children: FC<ChildProps> }> = ({ children: child }) => {
  const [playerLoaded, setPlayerLoaded] = useState(false)
  const [audioObject, setAudioObject] = useState<AudioObject>()

  useEffect(() => {
      console.log('starting...')
      const components = setupTone({
        onload: () => setPlayerLoaded(true),
        detune: 0,
        url: "https://grainstems-dev.s3.amazonaws.com/bison.wav",
        mute: false,
        loop: true,
        reverse: false,
        grainSize: 0.5,
        overlap: 0.01,
        playbackRate: 1,
      })  
      setAudioObject(new AudioObject(components))
  }, [])

  return child({ audioObject, isLoaded: playerLoaded })
}

export default AudioContainer;
