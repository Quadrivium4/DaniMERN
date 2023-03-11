import { useState} from "react";
import { register } from "../controllers";

const Register = ({fn}) =>{
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({

    });
    const handleRegister= async() =>{
        setLoading(true);
        console.log(email, password);
        const data = await register(name, email, password);
        console.log(data);
        setData(data);
        if(data.ok){
            
            
        }
        
        setLoading(false);

    }
    return(
            <>
                <h1>Register</h1>
                {data.message? data.message : ""}
                <input type="text" placeholder="name" value={name} 
                onChange={(e)=>setName(e.target.value) }/>
                <input type="text" placeholder="email" value={email} 
                onChange={(e)=>setEmail(e.target.value) }/>
                <input type="text" placeholder="password" value={password} 
                onChange={(e) => { setPassword(e.target.value); }}/>
                <button id="login" onClick={handleRegister}>{loading ? <>Loading..</> : <>Submit</>}</button>
                <p>Already have an account?  <span className="link" onClick={()=>{
                    fn.handleRegisterPop();
                    fn.handleLoginPop();
                }}>login</span></p>
            </>
    )
}

export default Register;