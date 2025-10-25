import { Link, useNavigate } from "react-router-dom";
import { protectedUrl } from "../../../App";
import FileUpload from "../../../components/FileUpload/FileUpload";
import { useUser, useUserDispatch } from "../../../Context.tsx";
import { deleteUser, getCourses, getSubcourse, getSubcourses, logout } from "../../../controllers";
import CopyField from "./CopyField";
import { useEffect, useRef, useState } from "react";
import accountImg from "../../../assets/images/account-picture.png"

const Courses = () =>{
    const dispatch = useUserDispatch();
    const navigate = useNavigate();
    const user = useUser();
    const {info, courses, subcourses} = user;
    const [status, setStatus]= useState<string>()
    const profileImgPreview = useRef(null);
    useEffect(()=>{
 
            if(!courses || !subcourses){
                console.log('hello');
                setStatus("loading")
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
                <h1>Aquisti</h1>
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
                        {status === "loading"? <p>loading</p> : subcourses?.map((subcourse: any)=>{
                            return (
                                <Link to={"/view/" + subcourse._id} state={{type: "subcourse", course: subcourse }}  key={subcourse._id}>
                                    <div className="subcourse" >
                                        <img src={subcourse.coverImg.url} alt="" />
                                        <h3 className="title">{subcourse.name}</h3>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
                <Link to="/store">
                    <button>New Course</button>
                </Link>
            </div>
    )
}
export default Courses;