import { useState, useContext, useEffect} from "react";
import {Link} from "react-router-dom";
import Pop from "../Pop";
import Login from "../Login";
import Register from "../Register"
import accountImg from "../../assets/images/account-picture.png"
import headerImg from "../../assets/images/header.jpg";
import logoImg from "../../assets/images/logo.png";
import "./Header.css";
import { useUser, useUserDispatch } from "../../Context";

const Header = () => {
    const {isLogged, info} = useUser();
    console.log(info)
    const [loginPop, setLoginPop] = useState(false);
    const [registerPop, setRegisterPop] = useState(false);
    const handleLoginPop = () => {
        setLoginPop(!loginPop);
    }
    useEffect(()=>{
        console.log("user");
    },[info])
    const handleRegisterPop = () => {
        setRegisterPop(!registerPop);
    }
    return (
        <div id="header">
            <img alt="header-img" className="header-img" src={headerImg} />
            <Link to="/store" className="logo-link">
                <img alt="logo-img" className="logo-img" src={logoImg} />
            </Link>
            
            <div className="user-head">
            <div className="triangle"></div>
            {isLogged? 
                    <Link to="/dashboard">
                        {info?.profileImg ? 
                            <img alt="account-img" className="account-img" src={info.role === "admin"? "http://localhost:1234/assets/images/icon.png" :"http://localhost:1234/assets/users/"+info._id +"/"+info.profileImg} />
                            :
                            <img alt="account-img" className="account-img" src={accountImg} />
                        }
                    </Link> : 
                    <img onClick={handleLoginPop} alt="account-img" className="account-img" src={accountImg} />
                    }
            {loginPop? 
                <Pop toggle={handleLoginPop}>
                    <Login toggle={handleLoginPop} />
                </Pop>
             : null }
             </div>
             
        </div>
    )
}
export default Header