import { crossing, sendForm } from "./utils";
let protectedUrl =  process.env.NODE_ENV === "production" ? 
                    process.env.REACT_APP_ONLINE_SERVER_URL + "/protected" : 
                    process.env.REACT_APP_LOCAL_SERVER_URL + "/protected";

const postCourse = async(course) =>{
    return await sendForm(protectedUrl + "/course", "POST", course);
}
const postSubcourse = async(subcourse)=>{
    return await sendForm(protectedUrl + "/subcourse", "POST", subcourse);
}
const updateCourse = async(course) =>{
    return await sendForm(protectedUrl + "/course", "PUT", course);
}
const updateSubcourse = async(subcourse)=> {
    return await sendForm(protectedUrl + "/subcourse", "PUT", subcourse);
}
const deleteCourse = async(id) =>{
    return await crossing(protectedUrl + "/course/" + id, "DELETE");
}
const deleteSubcourse = async(id)=>{
    return await crossing(protectedUrl+ "/subcourse/" + id, "DELETE");
}
const postReview = async(body)=>{
    return await crossing(protectedUrl + "/review", "POST", body)
}

export {
    postCourse,
    postSubcourse,
    updateCourse,
    updateSubcourse,
    deleteCourse,
    deleteSubcourse,
    postReview
}