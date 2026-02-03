import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getPublicSubcourse, getSubcourse } from "../../controllers";
import { TSubcourse } from "../Admin/Dashboard/Components/EditSubcourse/EditSubcourse";
import VideoPlayerEmbed from "../../components/Video";
import { insertScriptHead } from "../../utils";
import styles from "./VerificationError.module.css"
import Message from "../../components/Message";
const VerificationError= () =>{
  

    return (
        <div id="verify-error" className={[styles.page, "page"].join(" ")}>
           
            <div className={styles.content}>
                 <h1>Pagamento fallito</h1>
                 <Message type={"error"} content={"Errore durante la verifica"} toggle={()=>{}}/>
                <p>Contattaci: miguelgiacobbe@gmail.com</p>
            </div>
           
       
        </div>
    )
}
export default VerificationError