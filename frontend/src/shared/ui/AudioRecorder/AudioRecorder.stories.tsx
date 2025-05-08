import {fn} from "@storybook/test"

import { AudioRecorder } from './AudioRecorder'

const meta = {
    title: 'Shared/AudioRecorder',
    component: AudioRecorder,
    argTypes: {
        isLoading: 'boolean',
        onSubmit: 'function',
        onStartRecorder: 'function',
    }
}

export default meta

export const Default = {
    args: {
        isLoading: false,
        onSubmit: fn(),
        onStartRecorder: fn()
    }
}