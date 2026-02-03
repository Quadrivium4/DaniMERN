import {useEffect, useRef, useState} from "react";
import Video from "../../components/Video";
import { getCourse, getSubcourse, updateCourseProgress } from "../../controllers";
import { useLocation, useParams } from "react-router-dom";
import { insertScriptHead } from "../../utils";
import { useUser, useUserDispatch } from "../../Context.tsx";
import "./View.css"
import Sidebar from "./components/Sidebar.tsx";
import VideoSkeleton from "./components/VideoSkeleton.tsx";
import { createSubcourseVideos, TSubcourseVideos, TVideo } from "../Admin/Dashboard/Components/EditSubcourse/EditSubcourse.tsx";
import { useVideo, VideoProvider } from "./VideoContext.tsx";


// const ViewOld = () =>{
//     const [videos, setVideos] = useState<TSubcourseVideos>({
//         main: {}
//     });
//     const [loading, setLoading] = useState(true);
//     const [currentVideo, setCurrentVideo] = useState<TVideo >();
//      const [currentSection, setCurrentSection] = useState<string>("main");
//     const {videos : cacheVideos} = useUser() as any;
//     const dispatch = useUserDispatch() as any;
//     const location = useLocation();
//     console.log({location})
//     let {course , type} = location.state;
//     const [progress, setProgress] = useState(0);

//     useEffect(()=>{

//         insertScriptHead({
//             name: 'wistia-script',
//             src: 'https://fast.wistia.com/assets/external/E-v1.js',
//         })
//         //if(loading && cacheVideos && cacheVideos.hasOwnProperty(course._id)){
//         if(false){
//             console.log("hello", cacheVideos[course._id]);
//             let medias = cacheVideos[course._id];
//             let subcourseVideos = createSubcourseVideos(course.files,cacheVideos[course._id]);
//             setVideos(subcourseVideos);
//             console.log(course)
//                 let progress = course.progress;
//                 let video;
//                 let i = 0;
//                 while(medias[i] && progress > medias[i].duration){
                    
//                     console.log(i, medias[i])
//                     progress -= medias[i].duration;
//                     i++;
//                 }
                
//                 console.log(i, progress);
//                 setCurrentVideo({...medias[i], progress: progress});
//             setCurrentVideo(cacheVideos[course._id][0]);
//             setLoading(false);
//         }
        
//         else{
//             console.log("videos",!videos);

//             if(type === "course"){
//                 getCourse(course._id).then(async({data})=>{
//                     console.log("old videos", data);
//                     dispatch({type: "SET_VIDEOS", value: {...cacheVideos, [course._id]:data.subcourses }})
//                     setVideos(data.subcourses)
//                     setCurrentVideo(data.subcourses[0]);
//                     setLoading(false);
//                 })
//             }else{
//                 getSubcourse(course._id).then(async({data})=>{
//                     //await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading delay
//                     console.log("subcourses",data.medias, data.course.files);
//                     let currentCourse = data.course;
//                     dispatch({type: "SET_VIDEOS",value: {...cacheVideos, [course._id]:data.medias }})
//                     let subcourseVideos = createSubcourseVideos(data.course.files, data.medias);
//                     console.log({SUBCOURSE_VIDEOS: subcourseVideos})
//                     setVideos(subcourseVideos)
//                     console.log(currentCourse)
//                     let progress = currentCourse.progress;
//                     let video;
//                     let i = 0;
//                     while(data.medias[i] && progress > data.medias[i].duration){
                        
//                         console.log(i, data.medias[i])
//                         progress -= data.medias[i].duration;
//                         i++;
//                     }
                    
//                     console.log(i, progress);
//                     setProgress(currentCourse.progress);
//                     setCurrentVideo({...data.medias[i], progress: progress});

//                     if(data.medias[i]) setCurrentSection(data.medias[i].section)
//                     setLoading(false);
//                 })
//             }
//         }
//     },[])

//     return (
//         <div id="view" className="page">
//             {/* <div style={{flexDirection: "row", display: "flex", height: "100%", justifyContent: "center", gap: 10, maxWidth: 1800, width: "100%"}}> */}
//             <div className={"view-content"}>
//             <Sidebar videos={videos} currentSection={currentSection} setCurrentVideo={setCurrentVideo} currentVideo={currentVideo} loading={loading}/>
//             {/* <div className="videos"> */}
//                 {/* {videos? videos.map(video=>{
//                 console.log(video)
//                 return  <Video embedId={video.hashed_id} key={video.hashed_id} /> */}
//                 {loading? <VideoSkeleton />: null}
//                 {currentVideo && !loading? 
//                 <Video embedId={currentVideo.hashed_id} key={currentVideo.hashed_id} name={currentVideo.name} progress={currentVideo.progress} updateProgress={(time: number)=>{
//                     if(time < currentVideo.progress) return;
//                     console.log("really updating progress", progress, time - currentVideo.progress);

                    
//                     console.log(progress)
//                     // updateCourseProgress({
//                     //     id: course._id,
//                     //     progress: progress + (time - currentVideo.progress)
//                     // })
//                     updateCourseProgress({
//                         id: course._id,
//                         progress: currentVideoTime(videos, currentVideo.hashed_id) + time
//                     })
//                     //currentVideo.progress = time;
//                     // course.progress = course.progress + (time - currentVideo.progress);
//                     // console.log(course.progress)
//                 } } onEnded={(time: number)=>{
//                     updateCourseProgress({
//                         id: course._id,
//                         progress: currentVideoTime(videos, currentVideo.hashed_id) + time
//                     })
//                     nextVideo();
//                 }}/>: null}
//             {/* </div> */}
//         </div>
            
           
//         </div>
//     )
// }
const View = () => {
     const {id} = useParams();
     if(!id) return;
    return (
        <VideoProvider id={id}>
            <ViewContent courseId={id} />
        </VideoProvider>
    )
}
const ViewContent= ({courseId}:{courseId: string}) =>{
    const {videos, loading, currentVideo, nextVideo, progress} = useVideo()

    const location = useLocation();
    const {id} = useParams();
    console.log({location})


    useEffect(()=>{

        insertScriptHead({
            name: 'wistia-script',
            src: 'https://fast.wistia.com/assets/external/E-v1.js',
        })


    },[])

    return (
        <div id="view" className="page">
            {/* <div style={{flexDirection: "row", display: "flex", height: "100%", justifyContent: "center", gap: 10, maxWidth: 1800, width: "100%"}}> */}
            <div className={"view-content"}>
            <Sidebar />
    
                {loading? <VideoSkeleton />: null}
                {currentVideo && !loading? 
                <Video embedId={currentVideo.hashed_id} key={currentVideo.hashed_id} name={currentVideo.name} progress={currentVideo.progress} updateProgress={(time: number)=>{
                    if(time < currentVideo.progress) return;
                    console.log("really updating progress", progress, time - currentVideo.progress);
  
                    updateCourseProgress({
                        id: courseId,
                        progress: currentVideoTime(videos, currentVideo.hashed_id) + time
                    })
                } } onEnded={(time: number)=>{
                    updateCourseProgress({
                        id: courseId,
                        progress: currentVideoTime(videos, currentVideo.hashed_id) + time
                    })
                    nextVideo();
                }}/>: null}
            {/* </div> */}
        </div>
            
           
        </div>
    )
}
const currentVideoTime = (videos: TSubcourseVideos, videoId: string): number=>{
    let amount = 0;
    let found = false;
    for(let sectionId in videos){
        for(let videoKey in videos[sectionId]){

            if(videoKey == videoId){
                found = true;
                return amount
            }else if(!found){
                amount += videos[sectionId][videoKey].duration;
            }
        }
    }
    return amount
}
export default View