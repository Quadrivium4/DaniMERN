import { useNavigate } from "react-router-dom";
import { protectedUrl } from "../../../App";
import FileUpload from "../../../components/FileUpload/FileUpload.tsx";
import { useUser, useUserDispatch } from "../../../Context.tsx";
import { deleteUser, logout } from "../../../controllers";
import CopyField from "./CopyField";
import { useRef } from "react";
import accountImg from "../../../assets/images/account-picture.png"

const Settings = () =>{
    const dispatch = useUserDispatch();
    const navigate = useNavigate();
    const user = useUser();
    const {info} = user;
    const profileImgPreview = useRef(null);

    const uploadImage = (img: File) => {
        const formData = new FormData();
        formData.append("file", img);
        formData.append("type", "video");
        fetch(protectedUrl + "/user/upload", {
            //withCredentials: true,
            credentials: "include",
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then(({ fileId }) => {
                console.log(fileId);
                const newUser = { ...info, profileImg: fileId };
                dispatch({ type: "SET_INFO", value: newUser });
            });
    };
    return (
        <div id="user" className="section">
                        <h1>Dati Utente</h1>
                        <div className="info">
                            <FileUpload setFile={uploadImage} filePreview={profileImgPreview} >
                                {
                                    info.profileImg.url?
                                    <img ref={profileImgPreview} src={info.profileImg.url} alt="profile img"></img> :
                                    <img ref={profileImgPreview} src={accountImg} alt="profile img"></img>
                                }
                            </FileUpload>
                            <div className="fields">
                                <p>Nome: {info.name}</p>
                                <p>Email: {info.email}</p>
                               
                               
                                <button onClick={async()=>{
                                let data = await logout();
                                console.log("logout data",data)
                                if(data.ok){
                                    console.log("redirecting")
                                    //redirect("/");
                                    dispatch({type: "RESET", value: null});
                                    navigate("/", {replace: true})
                                }else{
                                    console.log(data.message)
                                }
                                }}>log out</button>
                                <button onClick={async()=>{
                                let data = await deleteUser();
                                console.log("delete user data",data)
                                if(data.ok){
                                    console.log("redirecting")
                                    //redirect("/");
                                    dispatch({type: "RESET", value: null});
                                    navigate("/", {replace: true})
                                }else{
                                    console.log(data.message)
                                }
                                }}>Delete account</button>
                            </div>
                            
                        </div>
                        <h2>Affilate</h2>
                        { info.paypalId ? <p>Affiliate coupon:</p> : <p>You must have an account PayPal connected</p>}
                        { info.paypalId ? <CopyField textToCopy={info._id} />: null }
                        
                    </div>
    )
}
export default Settings;