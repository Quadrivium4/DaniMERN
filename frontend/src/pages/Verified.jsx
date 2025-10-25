import { useEffect } from "react"
import {useUser, useUserDispatch} from "../Context.tsx";
import { Link } from "react-router-dom";
import { getUser } from "../controllers";
const Verified = () => {
    const {isLogged} = useUser();
    const dispatch = useUserDispatch()
    //console.log(isLogged, dispatch)
    useEffect(()=>{
        if(!isLogged){
            const fetchData = async()=>{
                let data = await getUser();
                console.log(data)
                dispatch({type: "SET_INFO", value: data})
                dispatch({type: "SET_LOGGED", value: true});
            }
            fetchData()
        }
    }, [])
    return (
        <>
            <h1>Verified</h1>
            <p>Back to <Link to="/store">Store</Link></p>
        </>
    )
}
export default Verified