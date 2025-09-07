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
import AdminIcon from "../../assets/images/admin.png"

const Header = () => {
    const {isLogged, info} = useUser();
    console.log("header", {info})
    const [loginPop, setLoginPop] = useState(false);
    const handleLoginPop = () => {
        setLoginPop(!loginPop);
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
                            <img alt="account-img" className="account-img" src={info.role === "admin"? AdminIcon: info.profileImg} />
                            :
                            <img alt="account-img" className="account-img" src={accountImg} />
                        }
                    </Link> : 
                    <img onClick={handleLoginPop} alt="account-img" className="account-img" src={ accountImg} />
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


const Header1 = () => {
    const { isLogged, info } = useUser();
    console.log("header", { info });
    const [loginPop, setLoginPop] = useState(false);
    const handleLoginPop = () => {
        setLoginPop(!loginPop);
    };

    return (
        <div id="header">
                <h1>Maxen Academy</h1>
                {isLogged ? (
                    <Link to="/dashboard">
                        {info?.profileImg.url ? (
                            <img
                                alt="account-img"
                                className="account-img"
                                src={
                                    info.role === "admin"
                                        ? AdminIcon
                                        : info.profileImg.url
                                }
                            />
                        ) : (
                            <img
                                alt="account-img"
                                className="account-img"
                                src={accountImg}
                            />
                        )}
                    </Link>
                ) : (
                    <img
                        onClick={handleLoginPop}
                        alt="account-img"
                        className="account-img"
                        src={accountImg}
                    />
                )}
                {loginPop ? (
                    <Pop toggle={handleLoginPop}>
                        <Login toggle={handleLoginPop} />
                    </Pop>
                ) : null}
        </div>
    );
};
export default Header1