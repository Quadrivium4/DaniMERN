import {  useEffect, useState, useRef} from "react"
import { useNavigate, Link } from "react-router-dom";
import { useUser, useUserDispatch } from "../../Context";
import Pop from "../../components/Pop";
import {
    
    postCourse,
    postSubcourse,
    updateCourse,
    updateSubcourse,
    deleteCourse,
    deleteSubcourse,
} from "../../admin";
import { logout, getSubcourses, getCourses, getReviews } from "../../controllers";
import "./Admin.css"
import FileUpload from "../../components/FileUpload/FileUpload";
import { downloadFile } from "../../utils";
import { baseUrl } from "../../App";

const Admin= () => {
    const navigate = useNavigate();
    const {info, courses, subcourses} = useUser();
    const dispatch = useUserDispatch()
    const [popContent, setPopContent] = useState();
    const [reviews, setReviews] = useState() 
    useEffect(()=>{
        if(!courses || !subcourses){
            const getData = async()=>{
                console.log("get Data runned")
                const {courses} = await getCourses();
                const {subcourses} = await getSubcourses();
                dispatch({type: "SET_COURSES", value: courses});
                dispatch({type: "SET_SUBCOURSES", value: subcourses});
            }
            getData()
        }
        if(!reviews) {
            console.log("hello")
            getReviews().then(data=>{
            console.log("data",data)
            setReviews(data.reviews);
        });
        }
    })
    //console.log("USER ADMIN: ", user)

    return (
        <div id="admin" className="page">
            {popContent? <Pop toggle={()=>{setPopContent(null)}}>{popContent}</Pop>: null}
            <div id="reviews">
                <h1>Reviews</h1>
                <div className="container">
                    {reviews? reviews.map(review=>{
                    return (
                        <Link to={review.completed ? "/dashboard" : "/review"} state={review} key={review.video.hashedId}>
                            <div className="review">
                                <h3>{review.video.name}</h3>
                                <p>{"completed: "+ review.completed}</p>
                            </div>
                        </Link>
                        
                        
                    )
                    }): null}
                </div>
                
            </div>
            <div id="products">
                <div id="courses">
                    <h1>Corsi</h1>
                    {courses?.map(course=>{
                    
                    return (
                        <div className="course product" key={course._id}>
                            <div className="cover">
                                <img src={baseUrl + "/assets/images/" + course.coverImg} alt="course-img" className="course-img" />
                                <p>{course.name}</p>
                            </div>
                            
                            
                            <div className="actions">
                                <Link to="/view" state={{type: "course", id: course._id }}>Go</Link>
                                <button onClick={()=>{
                                    setPopContent(<EditCourse course={course} subcourses={subcourses} action="update"></EditCourse>)
                                    console.log(popContent)
                                }}>Edit</button>
                                <button onClick={()=>{
                                    setPopContent(<Delete item={course}></Delete>)
                                }}>Delete</button>
                            </div>
                            
                        </div>
                    )
                })}
                <button onClick={()=>{
                        const emptyCourse = {
                            name: "",
                            description: "",
                            price:"",
                            subcourses: [],
                            _id: ""
                        }
                        setPopContent(<EditCourse course={emptyCourse}subcourses={subcourses} action="create"></EditCourse>)
                        console.log(popContent)
                    }}>new course</button>
                </div>
                <div id="subcourses">
                    <h1>Sottocorsi</h1>
                    {subcourses?.map(subcourse=>{
                        let image = baseUrl + "/assets/images/" + subcourse.coverImg;
                        return (
                            <div className="subcourse product" key={subcourse._id}>
                                <div className="cover">
                                    <img src={image} alt="subcourse img" className="subcourse-img" />
                                    <p>{subcourse.name}</p>
                                </div>
                                
                                <div className="actions">
                                    <Link to="/view" state={{type: "subcourse", id: subcourse._id }}>Go</Link>
                                        <button onClick={()=>{
                                            setPopContent(<EditSubcourse subcourse={subcourse} action="update"></EditSubcourse>)
                                            console.log(popContent)
                                        }}>Edit</button>
                                        <button onClick={()=>{
                                            setPopContent(<Delete item={subcourse}></Delete>)
                                        }}>Delete</button>
                                </div>
                                
                            </div>
                        )
                    })}
                     <button onClick={()=>{
                        const emptySubcourse = {
                            name: "",
                            description: "",
                            price:"",
                            token: "",
                            hashedId: "",
                            _id: ""
                        }
                        setPopContent(<EditSubcourse subcourse={emptySubcourse} action="create"></EditSubcourse>)
                        console.log(popContent)
                    }}>new subcourse</button>
                </div>
                
                
                
               
            </div>
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
        </div>
    )
}
const EditCourse = ({course, subcourses, action}) =>{
    const imgPreview = useRef(null);
    const [defaultFile, setDefaultFile] = useState();
    const [courseData, setCourseData] = useState({
        name: course.name,
        description: course.description,
        price: course.price,
        subcourses: course.subcourses,
        coverImg:  defaultFile,
        id: course._id
    })
    const handleEdit = async() =>{
        console.log(courseData)
        const form = new FormData();
            
            for(const [key, value] of Object.entries(courseData) ){
                
                if(key === "subcourses"){
                    console.log("hi");
                    form.append(key, JSON.stringify(value));
                }else{
                    form.append(key, value);
                }
                console.log(key, value)
            }
        if(action === "update"){
            
            updateCourse(form)
        }else if(action === "create"){
            postCourse(form);
        }else{
            console.log("unknown action")
        }
        
    }
    return(
            <>
                <h1>Edit</h1>
                <p>Course Name:</p>
                <input type="text" value={courseData.name} 
                onChange={(e)=>setCourseData({...courseData, name: e.target.value}) }/>
                <p>Course Description:</p>
                <input type="text" value={courseData.description} 
                onChange={(e) =>setCourseData({...courseData, description: e.target.value})}/>
                <p>Course Price:</p>
                <input type="text" value={courseData.price} 
                onChange={(e) =>setCourseData({...courseData, price: e.target.value})}/>
                <p>Course Cover</p>
                <FileUpload 
                setFile={(file)=>{
                    setCourseData({...courseData, coverImg: file})
                }} 
                imgPreview={imgPreview} 
                type="image" 
                defaultFileSrc={baseUrl+ "/assets/images/" +course.coverImg}>
                    <img ref={imgPreview} alt="a preview of img selcted" className="img-preview" />
                </FileUpload>
                <p>Subcourses:</p>
                {
                    subcourses.map(subcourse=>{
                        return (
                            <div className="checkbox-label" key={subcourse._id}>
                                <input type="checkbox" checked={course.subcourses.includes(subcourse._id)} onChange={(e)=>{
                                    const checkbox = e.target;
                                    const subcourses = courseData.subcourses;
                                    if(checkbox.checked) {
                                        subcourses.push(subcourse._id);
                                    }else{
                                        subcourses.splice(subcourses.indexOf(subcourse._id),1);
                                    }
                                    setCourseData({...courseData,subcourses})
                                }}></input>
                                {subcourse.name}
                            </div>)
                    })
                }
                <button id="save" onClick={handleEdit}>Save</button>
            </>
    )
}
const EditSubcourse = ({ subcourse, action}) =>{
    const imgPreview = useRef(null)
    const [subcourseData, setSubcourseData] = useState({
        name: subcourse.name,
        description: subcourse.description,
        price: subcourse.price,
        hashedId: subcourse.hashedId,
        coverImg: subcourse.coverImg,
        id: subcourse._id
    })

    const handleEdit = async() =>{
        const form = new FormData();
            
            for(const [key, value] of Object.entries(subcourseData) ){
                
                if(key === "subcourses"){
                    console.log("hi");
                    form.append(key, JSON.stringify(value));
                }else{
                    form.append(key, value);
                }
                console.log(key, value)
            }
        if(action === "update"){
            updateSubcourse(form);
        }else if(action === "create"){
            postSubcourse(form);
        }else{
            console.log("unknown action")
        }
        
    }
    return(
            <>
                <h1>Edit</h1>
                <p>Course Name:</p>
                <input type="text" value={subcourseData.name} 
                onChange={(e)=>setSubcourseData({...subcourseData, name: e.target.value}) }/>
                <p>Course Description:</p>
                <input type="text" value={subcourseData.description} 
                onChange={(e) =>setSubcourseData({...subcourseData, description: e.target.value})}/>
                <p>Course Price:</p>
                <input type="text" value={subcourseData.price} 
                onChange={(e) =>setSubcourseData({...subcourseData, price: e.target.value})}/>
                <p>Course Cover</p>
                <FileUpload 
                setFile={(file)=>{
                    setSubcourseData({...subcourseData, coverImg: file})
                }} 
                imgPreview={imgPreview} 
                type="image" 
                defaultFileSrc={baseUrl+ "/assets/images/" +subcourse.coverImg}>
                    <img ref={imgPreview} alt="a preview of img selcted" className="img-preview" />
                </FileUpload>
                <p>Hashed Id:</p>
                <input type="text" value={subcourseData.hashedId} 
                onChange={(e) =>setSubcourseData({...subcourseData, hashedId: e.target.value})}/>
                <button id="save" onClick={handleEdit}>Save</button>
            </>
    )
}
const Delete = ({ item}) =>{

    const handleDelete = async() =>{
        if(item.subcourses){
            deleteCourse(item._id)
        }else{
            deleteSubcourse(item._id)
        }
    }
    return(
            <>
                <h1>Delete {item.name}?</h1>
                <button id="save" onClick={handleDelete}>Delete</button>
            </>
    )
}
export default Admin