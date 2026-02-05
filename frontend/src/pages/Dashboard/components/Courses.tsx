import { Link, useNavigate } from "react-router-dom";
import { protectedUrl } from "../../../App";
import FileUpload from "../../../components/FileUpload/FileUpload";
import { useUser, useUserDispatch } from "../../../Context.tsx";
import { deleteUser, getCourses, getSubcourse, getSubcourseData, getSubcourses, logout, updateCourseProgress } from "../../../controllers";
import CopyField from "./CopyField";
import { useEffect, useRef, useState } from "react";
import accountImg from "../../../assets/images/account-picture.png"
import { TSubcourse } from "../../Admin/Dashboard/Components/EditSubcourse/EditSubcourse.tsx";
import { wait } from "@testing-library/user-event/dist/utils/index";

const Courses = () =>{
    const dispatch = useUserDispatch();
    const navigate = useNavigate();
    const user = useUser();
    const {info, subcourses} = user;
    const [status, setStatus]= useState<string>()
    const profileImgPreview = useRef(null);
    useEffect(()=>{
 
            if(!subcourses){
                console.log('hello');
                setStatus("loading")
                const getData = async()=>{
                    console.log("get Data runned")
                    //const {courses} = await getCourses();
                    const {subcourses} = await getSubcourses();
                    
                    //dispatch({type: "SET_COURSES", value: courses});
                    dispatch({type: "SET_SUBCOURSES", value: subcourses});
                }
                getData().then(()=>{
                    setStatus("finished")
                })
            }else{
                console.log("courses and sub", subcourses)
            }
        },[])
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
        <div id="purchases" className="section">
                <h1>Acquisti</h1>
                {/* <h2>Corsi</h2>
                <div className="scroller-wrap">
                    <div className="scroller">
                        {status === "loading"? <p>loading</p> : courses?.map((course: any)=>{
                            
                            return (
                                <Link to="/view" state={{type: "course", course: course }} key={course._id}>
                                    <div className="course" >
                                        <img src={course.coverImg} alt="" />
                                        <h3 className="title">{course.name}</h3>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
                <h2>Sottocorsi</h2> */}
                <div className="scroller-wrap">
                    <div className="scroller">
                        {status === "loading"? <p>loading</p> : subcourses?.map((subcourse: TSubcourse)=>{
                            return (
                                <>
                                <Link to={"/view/" + subcourse.id} state={{type: "subcourse", course: subcourse }}  key={subcourse.id}>
                                    
                                    <Course subcourse={subcourse} />
                                </Link>
                                {/* <button onClick={()=>{
                                        
                                        // updateCourseProgress({
                                        //     id: subcourse._id,
                                        //     progress: 1
                                        // })
                                    }}>increas prog</button> */}
                                    </>
                            )
                        })}
                    </div>
                </div>
                <Link to="/store">
                    <p style={{paddingTop: 10}}>Acquista altri corsi</p>
                </Link>
            </div>
    )
}
const Course = ({subcourse}: {subcourse: TSubcourse}) =>{
    const [totalTime, setTotalTime] = useState();
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        getSubcourseData(subcourse.id).then(async(res) =>{
            await wait(1000)
            const {duration, videoNumber} = res.data
            console.log(res)
            setTotalTime(duration);
            if(subcourse.progress){
                setProgress(subcourse.progress/duration * 100)
            }
           setLoading(false)
            
        })
    },[])
    return (
        <div className="subcourse" >
            <img src={subcourse.coverImg.url} alt="" />
            <h2 className="title"><b>{subcourse.name}</b></h2>
            {/* <p>{subcourse.progress}, {totalTime}</p> */}
            <div className={`progress-bar`}>
                <div className={`progress ${loading? "loading" : ""}`} style={{width: progress + "%"}}></div>
            </div>
        </div>
    )
}
export default Courses;