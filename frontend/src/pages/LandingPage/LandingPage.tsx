import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getPublicSubcourse, getSubcourse } from "../../controllers";
import { TSubcourse } from "../Admin/Dashboard/Components/EditSubcourse/EditSubcourse";
import VideoPlayerEmbed from "../../components/Video";
import { insertScriptHead } from "../../utils";
import styles from "./LandingPage.module.css"
const LandingPage = () =>{
    const {id} = useParams();
    const [course, setCourse] = useState<TSubcourse>();
    const navigate = useNavigate()
    useEffect(()=>{
          insertScriptHead({
            name: 'wistia-script',
            src: 'https://fast.wistia.com/assets/external/E-v1.js',
        })
        getPublicSubcourse(id).then(res =>{
            console.log(res);
            setCourse(res)
        })
    },[])
    return (
        <div id="landing-page" className={[styles.page, "page"].join(" ")}>
            {course? <>
 
            <iframe
                       src={`https://fast.wistia.net/embed/iframe/${course.promoVideo}?videoFoam=true&fitStrategy=contain&playerColor=0e3c43`}
                    
                       style={{
                           aspectRatio: 16 / 9,
                           maxHeight: "calc(100% - 200px)",
                           borderRadius: 25
                       }}
                   ></iframe> 
                   <h1>{course.name}</h1>
                   <p>{course.promoDescription}</p>
                   <button onClick={()=>navigate("/checkout", {state: course})}>Acquista Ora</button>
            </>: <p>loading...</p>}
        </div>
    )
}
export default LandingPage