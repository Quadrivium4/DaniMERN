import { useState } from "react";
import {redirect, useNavigate, useLocation} from "react-router-dom";
import {useUserDispatch} from "../Context";
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
        const data = await login(email, password);
        console.log(data);
        
        if(data.ok){
            setMessage({
                type: "success",
                content: data.message
            });
            
            dispatch({type: "SET_LOGGED", value: true});
            dispatch({type: "SET_INFO", value: data.user});
            console.log(location.pathname)
            if(location.pathname === "/store"){
                navigate("/dashboard", {replace: true});
            }
            toggle();
        }else{
            setMessage({
                type: "error",
                content: data.message
            });
        }
        
        setLoading(false);

    }
    return(
            <>
                <h1>Login</h1>
                {message? <Message type={message.type} content={message.content} />: null}
                <input type="email" placeholder="email" value={email} 
                onChange={(e)=>setEmail(e.target.value) }/>
                <input type="password" placeholder="password" value={password} 
                onChange={(e) => { setPassword(e.target.value); }}/>
                <button id="login" onClick={handleLogin}>{loading ? <>Loading..</> : <>Submit</>}</button>
            </>
    )
}

export default Login;
