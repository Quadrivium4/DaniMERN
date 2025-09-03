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
const uploadSubcourseFiles = async(formData) =>{
    return await sendForm(protectedUrl + "/upload-subcourse-files", "POST", formData);
}
const deleteSubcourseFiles = async (data) => {
    return await crossing(protectedUrl + "/upload-subcourse-files", "DELETE", data);
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
const postDiscount = async(discount)=>{
    return await crossing(protectedUrl + "/discount", "POST", discount)
}
const updateDiscount = async (discount) => {
    return await crossing(protectedUrl + "/discount", "PUT", discount)
}
const deleteDiscount = async (id) => {
    return await crossing(protectedUrl + "/discount/" + id, "DELETE")
}
const getDiscounts = async () => {
    return await crossing(protectedUrl + "/discount");
}
const getDiscount = async (id) => {
    return await crossing(protectedUrl + "/discount/" + id);
}
export {
    postCourse,
    postSubcourse,
    updateCourse,
    updateSubcourse,
    uploadSubcourseFiles,
    deleteSubcourseFiles,
    deleteCourse,
    deleteSubcourse,
    postDiscount,
    updateDiscount,
    deleteDiscount,
    postReview,
    getDiscount,
    getDiscounts
}