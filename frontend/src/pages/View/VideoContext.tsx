import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import { createSubcourseVideos, TSubcourseVideos, TVideo } from "../Admin/Dashboard/Components/EditSubcourse/EditSubcourse";
import { getSubcourse } from "../../controllers";
type VideoStateProps = {
    videos: TSubcourseVideos,
    currentVideo: TVideo | null,
    currentSection: string,
    progress: number,
    loading: boolean,
    ended: boolean
}
type VideoContextProps = VideoStateProps & {
    nextVideo: () =>void,
    previousVideo: () =>void,
    nextSection: () =>void,
    previousSection: () =>void,
    setSection: (section: string) =>void,
    setVideo: (section: string, video: TVideo) =>void
} | null
const VideoContext = createContext<VideoContextProps>(null);

const VideoProvider = ({ children, id }: {children: ReactNode, id: string}) => {
    const [state, setState] = useState<VideoStateProps>({videos: {}, loading: true, progress: 0, currentSection: "", currentVideo: null, ended: false});
    useEffect(()=>{
           getSubcourse(id).then(async({data})=>{
                    //await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading delay
                    console.log("subcourses",data.medias, data.course.files);
                    let currentCourse = data.course;
                   // dispatch({type: "SET_VIDEOS",value: {...cacheVideos, [course._id]:data.medias }})
                    let subcourseVideos = createSubcourseVideos(data.course.files, data.medias);
                    console.log({SUBCOURSE_VIDEOS: subcourseVideos})
                   
                    console.log(currentCourse)
                    let progress = currentCourse.progress;
                    let video;
                    let i = 0;
                    while(data.medias[i] && progress > data.medias[i].duration){
                        
                        console.log(i, data.medias[i])
                        progress -= data.medias[i].duration;
                        i++;
                    }
                    
                    console.log(i, progress);
                    console.log({newState: {
                        videos: subcourseVideos, 
                        currentSection: data.medias[i].section || "main", 
                        currentVideo: {...data.medias[i], progress: progress}, 
                        progress: currentCourse.progress,
                        loading: false,
                        ended: false
                    }})
                    setState({
                        videos: subcourseVideos, 
                        currentSection: data.medias[i].section|| "main", 
                        currentVideo: {...data.medias[i], progress: progress}, 
                        progress: currentCourse.progress,
                        loading: false,
                        ended: false
                    })

                })
    },[])
    const nextVideo = () =>{
        let {videos, currentSection, currentVideo} = state;
        console.log("next video!", videos)
        let next;
        let finalSection;
        let sectionsIds = Object.keys(videos);
        let sectionIndex = sectionsIds.findIndex(id => id == currentSection);
        let videoIds = Object.keys(videos[currentSection]);
        let videoIndex = videoIds.findIndex(id =>id == currentVideo?.hashed_id);
        console.log({videoIndex,videoIds, sectionIndex, sectionsIds, currentSection, currentVideo})
        if(videoIndex == videoIds.length - 1 && sectionIndex == sectionsIds.length - 1){
            console.log("Course ended")
            return setState({...state, ended: true})
        }else if(videoIndex == videoIds.length - 1){
            finalSection = sectionsIds[sectionIndex + 1];
            let finalSectionVideoIds = Object.keys(videos[finalSection]);
            next = videos[finalSection][finalSectionVideoIds[0]]
        }else{
            console.log()
            finalSection = currentSection;
            next = videos[currentSection][videoIds[videoIndex + 1]]
        }

        console.log(next);
        setState({...state, currentSection: finalSection, currentVideo: next})
    }
    const previousVideo = () =>{
        let {videos, currentSection, currentVideo} = state;
        console.log("next video!", videos)
        let next;
        let finalSection;
        let sectionsIds = Object.keys(videos);
        let sectionIndex = sectionsIds.findIndex(id => id == currentSection);
        let videoIds = Object.keys(videos[currentSection]);
        let videoIndex = videoIds.findIndex(id =>id == currentVideo?.hashed_id);
        console.log({videoIndex,videoIds, sectionIndex, sectionsIds, currentSection, currentVideo})
        if(videoIndex == 0 && sectionIndex == 0){
            return  console.log("Cannot go previous video")
        }else if(videoIndex == 0){
            finalSection = sectionsIds[sectionIndex -1];
            let previousVideoIds = Object.keys(videos[finalSection]);
            next = videos[finalSection][previousVideoIds[previousVideoIds.length -1]];
        }else{
            finalSection = currentSection;
            next = videos[currentSection][videoIds[videoIndex - 1]]
        }

        console.log(next);
        setState({...state, currentSection: finalSection, currentVideo: next})
    }
    const setSection = (section: string) =>{
        console.log("setting section", section)
        if(!section) return console.log("Invalid section")
        let videoIds = Object.keys(state.videos[section]);
        let video = state.videos[section][videoIds[0]];
        setState({...state, currentSection: section, currentVideo: video})
    }
     const setVideo= (section: string, video: TVideo) =>{
        setState({...state, currentSection: section, currentVideo: video})
    }
    const nextSection = () =>{
        let sectionIds = Object.keys(state.videos);
        let currentSectionIndex = sectionIds.findIndex(id => state.currentSection == id);
        if(currentSectionIndex == sectionIds.length -1) return console.log("last section");
        let nextSection = sectionIds[currentSectionIndex + 1];
        let videoIds = Object.keys(state.videos[nextSection]);
        let video = state.videos[nextSection][videoIds[0]];
        setState({...state, currentSection: nextSection, currentVideo: video})
    }
     const previousSection = () =>{
        let sectionIds = Object.keys(state.videos);
        let currentSectionIndex = sectionIds.findIndex(id => state.currentSection == id);
        if(currentSectionIndex == 0) return console.log("no previous section exists");
        let previousSection = sectionIds[currentSectionIndex - 1];
        let videoIds = Object.keys(state.videos[previousSection]);
        let video = state.videos[previousSection][videoIds[0]];
        setState({...state, currentSection: previousSection, currentVideo: video})
    }
    return (
        <VideoContext.Provider value={{ ...state, setSection, setVideo, previousSection, nextSection, nextVideo, previousVideo}}>
            {children}
        </VideoContext.Provider>
    );
};
const useVideo= () => {
    const messageContext = useContext(VideoContext);
    if(!messageContext) throw new Error("useMessage shoud be used inside MessageContext!")
    return messageContext
};
export { VideoProvider, useVideo };
