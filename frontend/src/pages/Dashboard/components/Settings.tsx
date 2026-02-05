import { useNavigate } from "react-router-dom";
import { protectedUrl } from "../../../App";
import FileUpload from "../../../components/FileUpload/FileUpload.tsx";
import { useUser, useUserDispatch, useUserInfo } from "../../../Context.tsx";
import { deleteUser, logout } from "../../../controllers";
import CopyField from "./CopyField";
import { ReactNode, useRef, useState } from "react";
import accountImg from "../../../assets/images/account-picture.png"
import { uploadImageToCloudinary } from "../../../u.ts";
import axios from "axios";
import Pop from "../../../components/Pop.jsx";

const Settings = () =>{
    const dispatch = useUserDispatch();
    const navigate = useNavigate();
    const user = useUser();
    const info  = useUserInfo()
    const profileImgPreview = useRef(null);
    const [pop,setPop] = useState<ReactNode>(null);

    const uploadImage = async(img: File) => {
        const res = await uploadImageToCloudinary(img);

        const formData = new FormData();
   
        axios.post(protectedUrl + "/user/upload", {
            profileImg: res
        }, {withCredentials: true}).then(res => {
            console.log(res.data)
            dispatch({type: "SET_INFO", value: res.data})
        })
           
    };
    return (
        <div id="user" className="section">
            {pop && <Pop toggle={()=>setPop(null)}>{pop}</Pop>}
                        <h1>Dati Utente</h1>
                        <div className="info">
                            <FileUpload setFile={uploadImage} filePreview={profileImgPreview} >
                                {
                                    info.profileImg?.url?
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
                                    setPop(<>
                                    <h2>Eliminazione account</h2>
                                    <p>Sei sicuro di voler eliminare l'account? tutti i tuoi dati e i tuoi corsi andranno persi.</p>
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
                                    }}>Procedi con l'eliminazione</button>
                                    </>)
                                
                                }}>Delete account</button>
                            </div>
                            
                        </div>
                        {/* <h2>Affilate</h2>
                        { info.paypalId ? <p>Affiliate coupon:</p> : <p>You must have an account PayPal connected</p>}
                        { info.paypalId ? <CopyField textToCopy={info._id} />: null } */}
                        
                    </div>
    )
}
export default Settings;