import  { createContext, useContext, useReducer, useEffect, Reducer } from "react";
import { redirect } from "react-router-dom";
import { getUser } from "./controllers";
import { TFile, TSubcourse } from "./pages/Admin/Dashboard/Components/EditSubcourse/EditSubcourse";
export const UserContext = createContext<GlobalState | null>(null);
export const UserDispatchContext =createContext<any>(null);
type TUser = {
    name: string,
    email: string,
    profileImg: TFile
}
type GlobalState = {
    isLogged: boolean,
    loading: boolean,
    info: TUser | null,
    subcourses: TSubcourse[],

} ;

const initialState = {
    isLogged: false,
    loading: true,
    info: null,
    courses: [],
    subcourses: [],
    // discounts: null,
    // videos: null,
    // store: null,
}

const userReducer: Reducer<GlobalState, any> = (state: any, action: {value: any, type: string}) =>{
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
            localStorage.setItem("isLogged", "false");
            return {initialState, loading: false};
        default: return state
    }

}
const getIsLoggedLocal = () =>{
    let local = localStorage.getItem("isLogged");
    if(local) return JSON.parse(local);
    return false;
}
export const Context = ({children}:{children: any}) =>{
    const [state, dispatch] = useReducer(userReducer, initialState);
    const isLoggedLocal = getIsLoggedLocal();
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
    let userContext = useContext(UserContext);
    if(!userContext) throw new Error("user context must be used inside context provider")
    //console.log("contexttt", useContext(UserContext));
    return userContext;
}
export function useUserInfo(){
    let userContext = useContext(UserContext);
    if(!userContext || !userContext.info) throw new Error("user context info not found")
    //console.log("contexttt", useContext(UserContext));
    return userContext.info;
}
export const useUserDispatch  = () =>{
    return useContext(UserDispatchContext);
}

