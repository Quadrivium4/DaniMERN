import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getPublicSubcourse, getSubcourse } from "../../controllers";
import { TSubcourse } from "../Admin/Dashboard/Components/EditSubcourse/EditSubcourse";
import VideoPlayerEmbed from "../../components/Video";
import { insertScriptHead } from "../../utils";
import styles from "./VerificationSuccessful.module.css"
import Message from "../../components/Message";
import Login from "../../components/Login";
import Pop from "../../components/Pop";
const VerificationSuccessful= () =>{
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<TSubcourse>();
    const [pop, setPop] = useState<ReactNode>()
    useEffect(()=>{
        getPublicSubcourse(id).then(res =>{
            console.log({res})
            setCourse(res);
            setLoading(false)
        }).catch(err =>{
            console.log("error in verification", err)
        })
    },[])
    return (
        <div id="verify" className={[styles.page, "page"].join(" ")}>
            {pop && <Pop toggle={()=>setPop(null)}>{pop}</Pop>}
            {loading? <p>loading...</p>: course?
            <div className={styles.content}>
            <Message type={"success"} content={"Pagamento eseguito con successo"} toggle={()=>{}}/>
            <p>Il tuo acquisto:</p>
            <div className={styles.product}>
            <img src={course.coverImg.url}></img>
            <h1>{course.name}</h1>
            <p>{course.description.slice(0, 20)}{course.description.length > 20? "...": null}</p>
            </div>
            <p>Esegui il login con le tue credenziali per accedere al corso!</p>
            <button onClick={()=>setPop(<Login toggle={()=>setPop(null)} />)}>Login</button>
            </div>: null}
            
        </div>
    )
}
export default VerificationSuccessful