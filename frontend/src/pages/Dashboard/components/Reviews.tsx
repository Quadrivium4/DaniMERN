import { useEffect, useState, useRef} from "react"
import { Link, useNavigate } from "react-router-dom";
import { useUser, useUserDispatch } from "../../../Context.tsx";
import { logout, getCourses, getSubcourses, getReviews, deleteReview, deleteUser } from "../../../controllers";
import { assetsUrl, baseUrl, protectedUrl } from "../../../App";

import uploadIcon from '../../assets/icons/carica.png';
import accountImg from "../../assets/images/account-picture.png"
import "./Dashboard.css"


const Dashboard = () => {
    const navigate = useNavigate();
    const {info, courses, subcourses} = useUser();
    const [reviews, setReviews] = useState();
    const [status, setStatus] = useState<string>();
    const [video, setVideo] = useState<any>();
    const [description, setDescription] = useState<string>();
    const [videoUploadProgress, setVideoUploadProgress] = useState<number>();
    const [videoUploadTotal, setVideoUploadTotal] = useState<number>();
    const videoPreview = useRef(null);
    const profileImgPreview = useRef(null);
    const dispatch = useUserDispatch();
    const [section, setSection] = useState("courses");
    //console.log("USER: ", info, courses, subcourses)
    useEffect(()=>{
        if(!reviews){
            getReviews().then(data=>{
                console.log(data)
                setReviews(data.reviews);
            })   
        }    
        if(!courses || !subcourses){
            console.log('hello');
            setStatus("loading");
            const getData = async()=>{
                console.log("get Data runned")
                const {courses} = await getCourses();
                const {subcourses} = await getSubcourses();
                
                dispatch({type: "SET_COURSES", value: courses});
                dispatch({type: "SET_SUBCOURSES", value: subcourses});
            }
            getData().then(()=>{
                setStatus("finished")
            })
        }else{
            console.log("courses and sub", courses, subcourses)
        }
    },[])
    // const uploadImage = (img) =>{
    //     const reader = new FileReader();
    //     const formData = new FormData();
    //     //const result = reader.readAsDataURL(img);
    //     console.log(img);
    //     formData.append('file', img)
    //     formData.append("type", "video");
    //     fetch( protectedUrl+ '/user/upload', {
    //         withCredentials: true,
    //         credentials: "include",
    //         method: 'POST',
    //         body: formData,
    //     }).then((res) => res.json()).then(({fileId})=>{
    //         console.log(fileId)
    //         const newUser = {...info, profileImg: fileId};
    //         dispatch({type: "SET_INFO", value: newUser});
    //     })
    // }
     const uploadImage = (img: File) => {
         const formData = new FormData();
         formData.append("file", img);
         formData.append("type", "video");
         fetch(protectedUrl + "/user/upload", {
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
    const uploadVideo = () =>{
        if(!video){
            return setVideo(false)
        }
        if(!description || description === "Aggiungi una descrizione"){
            return setDescription("Aggiungi una descrizione!")
        }
        const formData = new FormData()
        formData.append('file', video);
        formData.append("description",description)
        formData.append("type", "video");
        const req = new XMLHttpRequest();
        req.open("POST",protectedUrl+ '/user/upload/videos')
        req.withCredentials = true;
        //req.credentials = "include";
        setVideoUploadProgress(0)
        setVideoUploadTotal(1);
        req.upload.addEventListener("progress", (e)=>{
            console.log(e.loaded + " of " + e.total)
            setVideoUploadProgress(e.loaded)
            setVideoUploadTotal(e.total);
        });
        req.upload.addEventListener("loadend", ()=>{
            console.log("FINISHED")
        })

        req.send(formData);
        
        /*fetch('http://localhost:1234/protected/user/upload/videos', {
            withCredentials: true,
            credentials: "include",
            method: 'POST',
            body: formData,
        }).then((res) => res.json()).then(({fileName})=>{
            console.log(fileName)
            const newUser = {...info, profileImg: fileName};
            dispatch({type: "SET_INFO", value: newUser});
        })*/
    }
    return (
        
        {/* <div id="reviews" className="section">
                <h1>valutazioni</h1>
                <div id="post-review" className="sub-section">
                    <div>
                        <FileUpload setFile={setVideo} imgPreview={videoPreview} type="video/*">
                            <ProgressBar 
                            progress={videoUploadProgress} 
                            total={videoUploadTotal} 
                            containerStyle={{position: 'absolute', left: 0, top: 0, background: "rgb(33, 50, 100)", display: videoUploadTotal ? "block" : "none"}} 
                            barStyle={{background: "rgb(15, 20, 55)"}}/>
                            <div className="layer" style={ {backgroundColor: video === false? "rgb(255, 141, 141)": "transparent"}}></div>
                            <img ref={videoPreview} src={uploadIcon} alt="upload icon" style={{}/* {width: video ? "100%": "150px"}* ></img>
                        </FileUpload>
                        <button onClick={uploadVideo}>Invia</button>
                    </div>
                    <div className="description">
                        <h2>Descrizione</h2>
                        <textarea onChange={(e) => setDescription(e.target.value)} value={description}>
                    </textarea>
                    </div>
                    
                </div>
                <div id="my-reviews" className="sub-section">
                    <h1>le mie schede</h1>
                    <div className="scroller-wrap">
                        <div className="scroller">
                        {reviews? reviews.map(review=>{
                            return(
                                <div className="review" key={review._id}>
                                    <h3>{review.video.name}</h3>
                                    <p>completed: {""+review.completed}</p>
                                    {review.completed? <a target="_blank" href={assetsUrl+ "/"+ review.pdf}>pdf</a>: null}
                                    <button onClick={()=>{
                                        const newReviews = reviews.filter(item=> item._id !== review._id);
                                        console.log(newReviews)
                                        setReviews(newReviews);
                                        deleteReview(review._id)
                                        }}>Delete</button>
                                </div>
                            
                            )
                        }): null}
                    </div>
                    </div>
                    
                    
                </div>
                
                
                

            </div> */}

    )
}
export default Dashboard