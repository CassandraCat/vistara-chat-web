import {createContext, useCallback, useContext, useMemo} from "react";
import {useLocalStorage} from "./useLocalStorage";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useLocalStorage("user", null)
    const navigate = useNavigate()

    const login = useCallback(async (data) => {
        await setUser(data)
        navigate('/')
    }, [])

    const logout = useCallback(async () => {
        await setUser(null)
        navigate('/login', {replace: true})
    }, [])

    const value = useMemo(() => ({
        user,
        login,
        logout
    }), [user])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}