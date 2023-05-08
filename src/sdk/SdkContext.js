import {createContext, useContext} from "react";
import "sdk/lim-sdk"
import im from "sdk/sdk-bridge"

const SdkContext = createContext(null)

export const SdkProvider = ({children}) => {
    return <SdkContext.Provider value={im}>{children}</SdkContext.Provider>
}

export const useSdk = () => {
    return useContext(SdkContext)
}