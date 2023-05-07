import {useState} from "react";

export const useLocalStorage = (keyName, defaultValue) => {
    const [storageValue, setStorageValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(keyName);
            if (value) {
                return JSON.parse(value)
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue))
                return defaultValue
            }
        } catch (e) {
            return defaultValue
        }
    })
    const setValue = (value) => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(value))
        } catch (e) {

        }
        setStorageValue(value)
    }
    return [storageValue, setValue]
}