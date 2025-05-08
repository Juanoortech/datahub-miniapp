import { VideoPlayer } from './VideoPlayer'

const meta = {
    title: 'Shared/VideoPlayer',
    component: VideoPlayer,
    argTypes: {
        src: 'text',
    }
}

export default meta

export const Default = {
    args: {
        src: 'https://www.w3schools.com/html/mov_bbb.mp4'
    }
}