import { TextSection } from './TextSection'

const meta = {
    title: 'Shared/TextSection',
    component: TextSection,
    argTypes: {
        label: 'text',
        description: 'text'
    }
}

export default meta

export const Default = {
    args: {
        label: 'Read this text:',
        description: 'OORT a trailblazer in Decentralized AI, Decentralized Physical Infrastructure Networks (DePIN), has just scored a major win. Microsoft has granted OORT as a follow-up to its previous grant one year ago, a clear vote of confidence in the company’s innovative vision and technology.'
    }
}