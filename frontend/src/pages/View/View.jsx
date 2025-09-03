import {useEffect, useState} from "react";
import Video from "../../components/Video";
import { getCourse, getSubcourse } from "../../controllers";
import { useLocation } from "react-router-dom";
import { insertScriptHead } from "../../utils";
import { useUser, useUserDispatch } from "../../Context";
import "./View.css"
import Sidebar from "./components/Sidebar";
import VideoSkeleton from "./components/VideoSkeleton";
const View = () =>{
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentVideo, setCurrentVideo] = useState(null);
    const {videos : cacheVideos} = useUser();
    const dispatch = useUserDispatch();
    const location = useLocation();
    const {course, type} = location.state;
    useEffect(()=>{
        console.log("cache videos", location.state, {loading, videos,cacheVideos})
        insertScriptHead({
            name: 'wistia-script',
            src: 'https://fast.wistia.com/assets/external/E-v1.js',
        })
        if(loading && cacheVideos && cacheVideos.hasOwnProperty(course._id)){
            console.log("hello", cacheVideos[course._id]);
            setVideos(cacheVideos[course._id]);
            setCurrentVideo(cacheVideos[course._id][0]);
            setLoading(false);
        }else{
            console.log("videos",!videos);

            if(type === "course"){
                getCourse(course._id).then(async({data})=>{
                    console.log("old videos", data);
                    dispatch({type: "SET_VIDEOS", value: {...cacheVideos, [course._id]:data.subcourses }})
                    setVideos(data.subcourses)
                    setCurrentVideo(data.subcourses[0]);
                    setLoading(false);
                })
            }else{
                getSubcourse(course._id).then(async({data})=>{
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading delay
                    console.log("subcourses",data.medias);
                    dispatch({type: "SET_VIDEOS",value: {...cacheVideos, [course._id]:data.medias }})
                    setVideos(data.medias)
                    setCurrentVideo(data.medias[0]);
                    setLoading(false);
                })
            }
        }
    },[])
    return (
        <div id="view" className="page">
            <div style={{flexDirection: "row", display: "flex"}}>
            <Sidebar videos={videos} setCurrentVideo={setCurrentVideo}/>
            <div className="videos">
                {/* {videos? videos.map(video=>{
                console.log(video)
                return  <Video embedId={video.hashed_id} key={video.hashed_id} /> */}
                {loading? <VideoSkeleton/>: null}
                {currentVideo? 
                <Video embedId={currentVideo.hashed_id} key={currentVideo.hashed_id}/>: null}
            </div>
        </div>
            
           
        </div>
    )
}
export default View