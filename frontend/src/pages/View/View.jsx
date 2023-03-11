import {useEffect, useState} from "react";
import Video from "../../components/Video";
import { getCourse, getSubcourse } from "../../controllers";
import { useLocation } from "react-router-dom";
import { insertScriptHead } from "../../utils";
import { useUser, useUserDispatch } from "../../Context";
import "./View.css"
const View = () =>{
    const [videos, setVideos] = useState();
    const {videos : cacheVideos} = useUser();
    const dispatch = useUserDispatch();
    const location = useLocation();
    const {id, type} = location.state;
    useEffect(()=>{
        console.log("cache videos", cacheVideos)
        insertScriptHead({
            name: 'wistia-script',
            src: 'https://fast.wistia.com/assets/external/E-v1.js',
        })
        if(!videos && cacheVideos && cacheVideos.hasOwnProperty(id)){
            setVideos(cacheVideos[id]);
        }else{
            if(!videos){
                if(type === "course"){
                    getCourse(id).then(({data})=>{
                        console.log("old videos", data);
                        dispatch({type: "SET_VIDEOS", value: {...cacheVideos, [id]:data.subcourses }})
                        setVideos(data.subcourses)
                    })
                }else{
                    getSubcourse(id).then(({data})=>{
                        console.log("subcourses",data.medias);
                        dispatch({type: "SET_VIDEOS",value: {...cacheVideos, [id]:data.medias }})
                        setVideos(data.medias)
                    })
                }
            }
        }
    },[])
    return (
        <div id="view" className="page">
            <h1>View</h1>
            <div className="videos">
                {videos? videos.map(video=>{
                console.log(video)
                return  <Video embedId={video.hashed_id} key={video.hashed_id} />
            }): null}
            </div>
            
           
        </div>
    )
}
export default View