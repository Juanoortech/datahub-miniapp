import {useState} from "react"

import { TransitionFade } from './TransitionFade'
import { Button } from "../Button"

const meta = {
    title: 'Shared/TransitionFade',
    component: TransitionFade,
    argTypes: {}
}

export default meta

export const Default = {
    render: function Render() {
        const [value, setValue] = useState(false)

        return (
            <div>
                <Button
                    onClick={() => setValue(prev => !prev)}
                >
                    Переключить компонент
                </Button>
                <TransitionFade>
                    {value && (
                        <div
                            key={'value'}
                            style={{
                                background: 'red',
                                height: '200px'
                            }}
                        />
                    )}
                    {!value && (
                        <div
                            key={'notValue'}
                            style={{
                                background: 'blue',
                                height: '500px'
                            }}
                        />
                    )}
                </TransitionFade>
                <div
                    style={{
                        height: '50px',
                        background: 'green'
                    }}
                />
            </div>
        )
    }
}
