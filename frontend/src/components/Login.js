import Pop from "./Pop";
import { useState } from "react";
import { login } from "../controllers";

const Login = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async() =>{
        console.log(email, password);
        const data = await login(email, password);
        console.log(data);
    }
    return(
            <div id="login">
                <Pop>
                    <h1>Login</h1>
                    <input type="text" placeholder="email" value={email} 
                    onChange={(e)=>{ setEmail(e.target.value); } }/>
                    <input type="text" placeholder="password" value={password} 
                    onChange={(e) => { setPassword(e.target.value); }}/>
                    <button id="login" onClick={handleLogin}>Submit</button>
                    <p>Don't have an account?  <span id="register-pop">register</span></p>
                </Pop>
            </div>
    )
}

export default Login;
