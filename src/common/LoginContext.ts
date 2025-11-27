import { createContext } from "react";

export interface LoginContextProps {
    isLoggedIn: boolean,
    setLoggedIn: (val: boolean) => void
}

export const LoginContext = createContext<LoginContextProps>({isLoggedIn:false,setLoggedIn:(val)=>{}});
