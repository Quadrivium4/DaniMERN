import {useEffect, useRef, useState} from "react";
import Video from "../../components/Video";
import { getCourse, getSubcourse } from "../../controllers";
import { useLocation } from "react-router-dom";
import { insertScriptHead } from "../../utils";
import { useUser, useUserDispatch } from "../../Context.tsx";
import "./View.css"
import Sidebar from "./components/Sidebar.tsx";
import VideoSkeleton from "./components/VideoSkeleton.tsx";
import { createSubcourseVideos, TSubcourseVideos, TVideo } from "../Admin/Dashboard/Components/EditSubcourse/EditSubcourse.tsx";
import { set } from "mongoose";


const View = () =>{
    const [videos, setVideos] = useState<TSubcourseVideos>({
        main: {}
    });
    const [loading, setLoading] = useState(true);
    const [currentVideo, setCurrentVideo] = useState<TVideo >();
    const {videos : cacheVideos} = useUser() as any;
    const dispatch = useUserDispatch() as any;
    const location = useLocation();
    const {course, type} = location.state;
    //const [size, setSize] = useState({width: 0, height: 0});
    //const videosRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        // if(!videosRef.current) return;
        // let video = videosRef.current["clientHeight"];
        // console.log({video})
        // console.log("cache videos", videosRef.current?.clientWidth, videosRef.current?.clientHeight,{c: videosRef.current})
        //setSize({width: videosRef.current?.clientWidth || 0, height: videosRef.current?.clientHeight || 0})
        // window.addEventListener("resize", ()=>{
        //     if(videosRef.current){
        //         console.log("resize", videosRef.current.clientWidth, videosRef.current.clientHeight)
        //         setSize({width: videosRef.current.clientWidth , height: videosRef.current.clientHeight })
        //         //setVideoHeight(videosRef.current.clientHeight);
        //     }
        // })
        insertScriptHead({
            name: 'wistia-script',
            src: 'https://fast.wistia.com/assets/external/E-v1.js',
        })
        if(loading && cacheVideos && cacheVideos.hasOwnProperty(course._id)){
            console.log("hello", cacheVideos[course._id]);
            let subcourseVideos = createSubcourseVideos(course.files,cacheVideos[course._id]);
            setVideos(subcourseVideos);
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
                    let subcourseVideos = createSubcourseVideos(course.files, data.medias);
                    setVideos(subcourseVideos)
                    setCurrentVideo(data.medias[0]);
                    setLoading(false);
                })
            }
        }
    },[])
    return (
        <div id="view" className="page">
            {/* <div style={{flexDirection: "row", display: "flex", height: "100%", justifyContent: "center", gap: 10, maxWidth: 1800, width: "100%"}}> */}
            <div className={"view-content"}>
            <Sidebar videos={videos} setCurrentVideo={setCurrentVideo} currentVideo={currentVideo} loading={loading}/>
            {/* <div className="videos"> */}
                {/* {videos? videos.map(video=>{
                console.log(video)
                return  <Video embedId={video.hashed_id} key={video.hashed_id} /> */}
                {loading? <VideoSkeleton />: null}
                {currentVideo && !loading? 
                <Video embedId={currentVideo.hashed_id} key={currentVideo.hashed_id} name={currentVideo.name}/>: null}
            {/* </div> */}
        </div>
            
           
        </div>
    )
}
export default View