import { useState } from "react";
import {redirect, useNavigate, useLocation} from "react-router-dom";
import {useUserDispatch} from "../Context.tsx";
import { login } from "../controllers";
import Message from "./Message";

const Login = ({toggle}) =>{
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useUserDispatch()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const handleLogin = async() =>{
        setLoading(true);
        console.log(email, password);
        try {
        const data = await login(email, password);
        console.log(data);
        

            setMessage({
                type: "success",
                content: data.message
            });
            
            dispatch({type: "SET_LOGGED", value: true});
            dispatch({type: "SET_INFO", value: data.user});
            console.log(location.pathname)
            //if(location.pathname === "/store" || location.pathname.startsWith("veri")){
                navigate("/dashboard", {replace: true});
            //}
            toggle();
        
        } catch (error) {
             setMessage({
                type: "error",
                content: error.message
            });
            setTimeout(()=>setMessage(null), 3000)
        } finally{
            setLoading(false);
        }


           
     
        

    }
    return(
            <>
                <h2>Login</h2>
                {message?<div style={{marginBottom: 10}}><Message type={message.type} content={message.content} /></div> : null}
                <input type="email" placeholder="email" value={email} 
                onChange={(e)=>setEmail(e.target.value) }/>
                <input type="password" placeholder="password" value={password} 
                onChange={(e) => { setPassword(e.target.value); }}/>
                <button id="login" onClick={handleLogin}>{loading ? <>Loading..</> : <>Invio</>}</button>
            </>
    )
}

export default Login;
