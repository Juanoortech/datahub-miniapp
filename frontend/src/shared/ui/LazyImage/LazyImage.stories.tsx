import { LazyImage } from './LazyImage'

const meta = {
    title: 'Shared/LazyImage',
    component: LazyImage,
    argTypes: {
        src: 'text',
        alt: 'text'
    }
}

export default meta

export const Default = {
    args: {
        src: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
        alt: 'alt',
        skeletonMinHeight: 200,
    },
}