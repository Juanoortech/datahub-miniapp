import { AudioPlayer } from './AudioPlayer'

const meta = {
    title: 'Shared/AudioPlayer',
    component: AudioPlayer,
    argTypes: {
        src: 'text'
    }
}

export default meta

export const Default = {
    args: {
        src: `https://test-audio-oort.s3.eu-central-1.amazonaws.com/0788.mp3?[${new Date().getTime()}]`
    }
}