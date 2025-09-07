import {  useEffect, useState, useRef} from "react"
import { useNavigate, Link, Route, Routes, Outlet, useLocation } from "react-router-dom";
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
import { logout, getSubcourses, getCourses, getReviews, getSubcourse  } from "../../controllers";
import "./Admin.css"
import FileUpload from "../../components/FileUpload/FileUpload.tsx";
import { downloadFile } from "../../utils";
import { baseUrl } from "../../App";
import Scroller from "../../components/Scroller/Scroller";
import Checkbox from "../../components/Checkbox/Checkbox";
import Message from "../../components/Message";
import { set } from "mongoose";



const Admin= () => {
    return <Outlet></Outlet>
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
export const EditCourse = ({course, subcourses, action}) =>{
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
                defaultFileSrc={course.coverImg}>
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