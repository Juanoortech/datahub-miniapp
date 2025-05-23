import {useEffect} from 'react'
import {BrowserRouter} from "react-router-dom"

import { TabBar } from '@/widgets/TabBar'

import {KeyboardOffsetProvider, TabBarProvider} from "@/shared/lib/providers"
import {tokenModel} from "@/shared/model"
import {BackButtonProvider, ToasterProvider} from "@/shared/providers"

import { RouterView } from './router'
import { StoreProvider } from './store'

function App() {
    useEffect(() => {
        tokenModel.clearToken()
    });

    return (
        <StoreProvider>
            <TabBarProvider>
                <ToasterProvider>
                    <KeyboardOffsetProvider>
                        <BrowserRouter>
                            <BackButtonProvider>
                                <RouterView />
                                <TabBar />
                            </BackButtonProvider>
                        </BrowserRouter>
                    </KeyboardOffsetProvider>
                </ToasterProvider>
            </TabBarProvider>
        </StoreProvider>
    );
}

export default App;
