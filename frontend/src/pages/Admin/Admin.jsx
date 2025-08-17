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
    getDiscounts,
    getDiscount,
    postDiscount,
    updateDiscount,
    deleteDiscount
} from "../../admin";
import { logout, getSubcourses, getCourses, getReviews, getFile } from "../../controllers";
import "./Admin.css"
import FileUpload from "../../components/FileUpload/FileUpload";
import { downloadFile } from "../../utils";
import { baseUrl } from "../../App";
import Scroller from "../../components/Scroller/Scroller";
import Checkbox from "../../components/Checkbox/Checkbox";
import Message from "../../components/Message";

const Admin= () => {
    const navigate = useNavigate();
    const {info, courses, subcourses} = useUser();
    const dispatch = useUserDispatch()
    const [popContent, setPopContent] = useState();
    const [reviews, setReviews] = useState();
    const [discounts, setDiscounts] = useState();
    const [message, setMessage] = useState();
    useEffect(()=>{
        console.log(courses, subcourses)
        if(!discounts) {
            const getData = async()=>{
                let {discounts: discountsData} = await getDiscounts();
                console.log(discountsData);
                setDiscounts(discountsData);
            }
            getData();
            
        }
        if(!courses || !subcourses){
            const getData = async()=>{
                console.log("get Data runned")
                let {courses: coursesData} = await getCourses();
                let {subcourses: subcoursesData} = await getSubcourses();
                
                
                if(!coursesData) coursesData = [];
                if(!subcoursesData) subcoursesData = [];
                console.log(coursesData, subcoursesData)
                dispatch({type: "SET_COURSES", value: coursesData});
                dispatch({type: "SET_SUBCOURSES", value: subcoursesData});
            }
            getData()
        }
        if(!reviews) {
            console.log("hello")
            getReviews().then(data=>{
                let reviewsData= data.reviews;
                if(!reviewsData) reviewsData = [];
                console.log("data",reviewsData)
                setReviews(reviewsData);
        });
        }
    })
    //console.log("USER ADMIN: ", user)

    return (
        <div id="admin" className="page">
            {message && <Message>{message}</Message>}
            {popContent ? (
                <Pop
                    toggle={() => {
                        setPopContent(null);
                    }}
                >
                    {popContent}
                </Pop>
            ) : null}
            <section id="reviews">
                <h1>Reviews</h1>
                <Scroller>
                    <div className="container">
                        {reviews
                            ? reviews.map((review) => {
                                  return (
                                      <Link
                                          to={
                                              review.completed
                                                  ? "/dashboard"
                                                  : "/review"
                                          }
                                          state={review}
                                          key={review.video.hashedId}
                                      >
                                          <div className="review">
                                              <h3>{review.video.name}</h3>
                                              <p>
                                                  {"completed: " +
                                                      review.completed}
                                              </p>
                                          </div>
                                      </Link>
                                  );
                              })
                            : null}
                    </div>
                </Scroller>
            </section>
            <section id="courses">
                <h1>Corsi</h1>
                <Scroller>
                    {courses?.map((course) => {
                        return (
                            <div className="course product" key={course._id}>
                                <div className="cover">
                                    <img
                                        src={getFile(course.coverImg)}
                                        alt="course-img"
                                        className="course-img"
                                    />
                                    <p className="title">{course.name}</p>
                                </div>
                                <div className="actions">
                                    <Link
                                        to="/view"
                                        state={{
                                            type: "course",
                                            id: course._id,
                                        }}
                                    >
                                        <button>Go</button>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setPopContent(
                                                <EditCourse
                                                    course={course}
                                                    subcourses={subcourses}
                                                    action="update"
                                                ></EditCourse>
                                            );
                                            console.log(popContent);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPopContent(
                                                <Delete
                                                    item={course}
                                                    handle={deleteCourse}
                                                ></Delete>
                                            );
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </Scroller>
                <button
                    onClick={() => {
                        const emptyCourse = {
                            name: "",
                            description: "",
                            price: "",
                            subcourses: [],
                            _id: "",
                        };
                        setPopContent(
                            <EditCourse
                                course={emptyCourse}
                                subcourses={subcourses}
                                action="create"
                            ></EditCourse>
                        );
                        console.log(popContent);
                    }}
                >
                    new course
                </button>
            </section>
            <section id="subcourses">
                <h1>Sottocorsi</h1>
                <Scroller>
                    <div className="products">
                        {subcourses?.map((subcourse) => {
                            return (
                                <div
                                    className="subcourse product"
                                    key={subcourse._id}
                                >
                                    <div className="cover">
                                        <img
                                            src={getFile(subcourse.coverImg)}
                                            alt="subcourse img"
                                            className="subcourse-img"
                                        />
                                        <p className="title">
                                            {subcourse.name}
                                        </p>
                                    </div>

                                    <div className="actions">
                                        <Link
                                            to="/view"
                                            state={{
                                                type: "subcourse",
                                                id: subcourse._id,
                                            }}
                                        >
                                            <button>Go</button>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setPopContent(
                                                    <EditSubcourse
                                                        subcourse={subcourse}
                                                        action="update"
                                                    ></EditSubcourse>
                                                );
                                                console.log(popContent);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPopContent(
                                                    <Delete
                                                        item={subcourse}
                                                        handle={deleteSubcourse}
                                                    ></Delete>
                                                );
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Scroller>
                <button
                    onClick={() => {
                        const emptySubcourse = {
                            name: "",
                            description: "",
                            price: "",
                            token: "",
                            hashedId: "",
                            _id: "",
                        };
                        setPopContent(
                            <EditSubcourse
                                subcourse={emptySubcourse}
                                action="create"
                            ></EditSubcourse>
                        );
                    }}
                >
                    new subcourse
                </button>
            </section>
            {/* <section id="discounts">
                <h1>Discounts</h1>
                <Scroller>
                    {
                        discounts?.map(discount=>{
                            return(
                                <div className="discount" key={discount._id}>
                                    <h3>{discount.name}</h3>
                                    <p>code: {discount._id}</p>
                                    <p>amount: {discount.amount}</p>
                                    <ul>targets:
                                        {
                                            discount.targets.map(item=>{
                                                let name;
                                                let course = courses.find(course=> course._id === item );
                                                if(course) name = course.name;
                                                let subcourse = subcourses.find(subcourse=> subcourse._id === item );
                                                if(subcourse) name = subcourse.name;
                                                return <li key={name}>- {name}</li>
                                            
                                            })
                                        }
                                    </ul>
                                    <div className="actions">
                                        <button onClick={()=>{
                                            setPopContent(<EditDiscount discount={discount} subcourses={subcourses} courses={courses} action="update"></EditDiscount>)
                                            console.log(popContent)
                                        }}>Edit</button>
                                        <button onClick={()=>{
                                            setPopContent(<Delete item={discount} handle={deleteDiscount}></Delete>)
                                        }}>Delete</button>
                                </div>
                                </div>
                            )
                        })
                    }
                </Scroller>
                <button onClick={()=>{
                    const emptyDiscount = {
                        targets: [],
                        expires: 1,
                        amount:"",
                        _id: ""
                    }
                setPopContent(<EditDiscount discount={emptyDiscount} subcourses={subcourses} courses={courses} action="create"></EditDiscount>)
                }}>new discount</button>
            </section> */}
            <section id="promotion-codes">
                <h1>Promotions</h1>
                <Scroller></Scroller>
            </section>
            <button
                onClick={async () => {
                    let data = await logout();
                    console.log("logout data", data);
                    if (data.ok) {
                        console.log("redirecting");
                        //redirect("/");
                        dispatch({ type: "RESET", value: null });
                        navigate("/", { replace: true });
                    } else {
                        console.log(data.message);
                    }
                }}
            >
                log out
            </button>
        </div>
    );
}
const EditDiscount = ({discount, action, toggle}) =>{
    const {courses, subcourses} = useUser();
    const [discountData, setDiscountData] = useState({
        id: discount._id,
        name: discount.name,
        targets: discount.targets,
        expires: discount.expires,
        amount: discount.amount,
    })
    const handleEdit = () =>{
        if(action === "create") postDiscount(discountData);
        else if(action === "update") updateDiscount(discountData);
    }
    return (
        <>
            <h1>Edit</h1>
            <p>Name:</p>
            <input type="text" value={discountData.name} onChange={(e)=>setDiscountData({...discountData, name: e.target.value})}/>
            <p>Expire:</p>
            <input type="number" value={discountData.expires} onChange={(e)=>setDiscountData({...discountData, expires: e.target.value})} />
            <p>Targets:</p>
            {courses.map((course, i)=>{
                return (
                    <Checkbox checked={discount.targets.includes(course._id)} handle={(e)=>{
                        const checkbox = e.target;
                        const targets = discountData.targets;
                        if(checkbox.checked) {
                            targets.push(course._id);
                        }else{
                            targets.splice(targets.indexOf(course._id),1);
                        }
                        setDiscountData({...discountData, targets })
                    }
                    }>{course.name} (course)</Checkbox>
                )
            })}
            {subcourses.map((subcourse, i)=>{
                return (
                    <Checkbox checked={discount.targets.includes(subcourse._id)} handle={(e)=>{
                        const checkbox = e.target;
                        const targets = discountData.targets;
                        if(checkbox.checked) {
                            targets.push(subcourse._id);
                        }else{
                            targets.splice(targets.indexOf(subcourse._id),1);
                        }
                        setDiscountData({...discountData, targets})
                    }
                    }>{subcourse.name} (subcourse)</Checkbox>
                )
            })}
            <p>Amount (in %)</p>
            <input type="number" value={discountData.amount} min={0} max={100} onChange={(e)=>setDiscountData({...discountData, amount: e.target.value})}></input>
            <button onClick={handleEdit}>Save</button>
        </>
        
    )
}
const EditCourse = ({course, subcourses, action}) =>{
    const imgPreview = useRef(null);
    const [defaultFile, setDefaultFile] = useState();
    console.log(course)
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
        if(action === "update") updateCourse(form)
        else if(action === "create") postCourse(form);
        else console.log("unknown action")
        
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
                defaultFileSrc={getFile(course.coverImg)}>
                    <img ref={imgPreview} alt="a preview of img selcted" className="img-preview" />
                </FileUpload>
                <p>Subcourses:</p>
                {
                    subcourses.map(subcourse=>{
                        return (
                            <Checkbox checked={course.subcourses.includes(subcourse._id)} handle={(e)=>{
                                    const checkbox = e.target;
                                    const subcourses = courseData.subcourses;
                                    if(checkbox.checked) {
                                        subcourses.push(subcourse._id);
                                    }else{
                                        subcourses.splice(subcourses.indexOf(subcourse._id),1);
                                    }
                                    setCourseData({...courseData,subcourses})
                                }}>
                                {subcourse.name}
                           </Checkbox>)
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
                defaultFileSrc={getFile(subcourse.coverImg)}>
                    <img ref={imgPreview} alt="a preview of img selcted" className="img-preview" />
                </FileUpload>
                <p>Hashed Id:</p>
                <input type="text" value={subcourseData.hashedId} 
                onChange={(e) =>setSubcourseData({...subcourseData, hashedId: e.target.value})}/>
                <button id="save" onClick={handleEdit}>Save</button>
            </>
    )
}
const Delete = ({ item, handle}) =>{
    const handleDelete = async() =>{
        handle(item._id);
    }
    return(
            <>
                <h1>Delete {item.name}?</h1>
                <button id="save" onClick={handleDelete}>Delete</button>
            </>
    )
}
export default Admin