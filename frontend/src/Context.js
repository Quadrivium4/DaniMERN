import  { createContext, useContext, useReducer, useEffect } from "react";
import { redirect } from "react-router-dom";
import { getUser } from "./controllers";
export const UserContext = createContext(null);
export const UserDispatchContext =createContext(null);


const initialState = {
    isLogged: false,
    loading: true,
    info: null,
    courses: null,
    subcourses: null,
    discounts: null,
    videos: null,
    store: null,
}

const userReducer = (state, action) =>{
    //console.log("state:", state, "action:", action)
    console.log(action)
    switch(action.type){
        case "SET_INFO": 
            return {...state, info: action.value};
        case "SET_STORE": 
            return {...state, store: action.value};
        case "SET_VIDEOS": 
            return {...state, videos: action.value};
        case "SET_COURSES": 
            return {...state, courses: action.value};
        case "SET_SUBCOURSES": 
            return {...state, subcourses: action.value};
        case "SET_LOGGED": 
            localStorage.setItem("isLogged", action.value);
            return { ...state, isLogged: action.value, loading: false };
        case "SET_LOADING":
            return { ...state,  loading: false };
        case "RESET": 
            localStorage.setItem("isLogged", false);
            return {initialState, loading: false};
        default: return state
    }

}

export const Context = ({children}) =>{
    const [state, dispatch] = useReducer(userReducer, initialState);
    const isLoggedLocal = JSON.parse(localStorage.getItem("isLogged"));
    const {isLogged} = state;
    useEffect(() => {
        console.log({isLoggedLocal, isLogged})
        if (!isLoggedLocal && !isLogged) dispatch({ type: "SET_LOADING", value: false })
        else {
            console.log("i'm fetching state")
            const fetchData = async () => {
                let data = await getUser();
                console.log(data)
                if (data.ok) {

                    dispatch({ type: "SET_INFO", value: data.user });
                    dispatch({ type: "SET_COURSES", value: data.courses });
                    dispatch({ type: "SET_SUBCOURSES", value: data.subcourses });
                    dispatch({ type: "SET_LOGGED", value: true });
                    return;
                }
                dispatch({ type: "SET_LOGGED", value: false });
            }
            fetchData()
        }

    }, [])

    return (
        <UserContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    )

}

export function useUser(){
    //console.log("contexttt", useContext(UserContext));
    return useContext(UserContext);
}
export const useUserDispatch  = () =>{
    return useContext(UserDispatchContext);
}

