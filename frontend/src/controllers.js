
import { baseUrl, protectedUrl } from "./App";
import { crossing } from "./utils";
const login = async(email,password) => {
    let url = baseUrl + "/login";
    return await crossing(url,"POST",{
            email,
            password
        })
}
const register = async(name, email, password)=> {
    let url = baseUrl + "/register";
    return await crossing(url,"POST",{
            name,
            email,
            password
        })
}
const logout = async() => {
    return await crossing(protectedUrl + "/logout");
}
const getUser = async() =>{
    return await crossing(protectedUrl + "/user");
}
const getCourse = async (id) => {
    return await crossing(protectedUrl + "/course/" + id);
}
const getSubcourse = async (id) => {
    return await crossing(protectedUrl + "/subcourse/" + id);
}
const getSubcourses = async () => {
    return await crossing(protectedUrl + "/subcourse", "GET")
}
const getCourses = async () => {
    return await crossing(protectedUrl + "/course", "GET")
}
const getReviews = async()=>{
    console.log('reviews')  
    return await crossing(protectedUrl + "/review")
}
const deleteReview = async(id) =>{
    return await crossing(protectedUrl+ "/review/" + id, "DELETE");
}
const deleteUser = async() =>{
    return await crossing(protectedUrl + "/user", "DELETE")
}
export {
    login,
    register,
    logout,
    getUser,
    getCourse,
    getSubcourse,
    getCourses,
    getSubcourses,
    getReviews,
    deleteReview,
    deleteUser
}