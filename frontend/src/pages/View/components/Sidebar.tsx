import { useEffect, useRef, useState } from "react";
import { TFile, TSubcourseVideos, TVideo } from "../../Admin/Dashboard/Components/EditSubcourse/EditSubcourse";
import styles from "./Sidebar.module.css";
import Transformable from "../../../components/Transformable/Transformable.tsx";
import { IoMdClose, IoMdDownload, IoMdSearch } from "react-icons/io";
import { MdArrowBack, MdArrowBackIos, MdArrowBackIosNew, MdArrowForward, MdArrowForwardIos } from "react-icons/md";
import Select from "../../../components/Select/Select.tsx";
import { VideosSekeleton } from "./VideoSkeleton.tsx";
import { useVideo } from "../VideoContext.tsx";

const offset = 10;
const Sidebar = () =>{
    //console.log("sidebar videos", videos);
    const {videos, currentSection, setVideo, loading, currentVideo, } = useVideo()
    const [sidebarWidth, setSidebarWidth] = useState(200);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef<{position: number, down: boolean}>({position: 0, down: false})
    const [cursor, setCursor] = useState<string>("");
    const mouseDownHandler = (e: MouseEvent) => {
        console.log("mouse down")
        if(!sidebarRef.current) return;
         if(
            e.clientX < sidebarRef.current.offsetLeft + sidebarRef.current.clientWidth + offset && 
            e.clientX > sidebarRef.current.offsetLeft + sidebarRef.current.clientWidth - offset
        ){
            mouseRef.current.down = true;
        }
    }
    const mouseUpHandler = (e: MouseEvent) => { 
         console.log("mouse down")
        if(document.documentElement.style.pointerEvents == "none") document.documentElement.style.pointerEvents = "all";
        mouseRef.current.down = false;
    }
    const onMouseMove = (e: MouseEvent) =>{
        //console.log("mouse moving");
        if(!sidebarRef.current) return;
        if(mouseRef.current.down){
            document.documentElement.style.pointerEvents = "none";
            let width= e.clientX - sidebarRef.current.offsetLeft;
            console.log("hello", width )
            if(width > 500 || width < 100) return;
            // if(sidebarRef.current.offsetLeft > 16 && e.clientX -sidebarRef.current.offsetLeft < sidebarRef.current.clientWidth) return
            setSidebarWidth(width);
            //setSidebarWidth(100);
        }

        else if(
            e.clientX < sidebarRef.current.offsetLeft + sidebarRef.current.clientWidth + offset && 
            e.clientX > sidebarRef.current.offsetLeft + sidebarRef.current.clientWidth - offset
        ){
        
                setCursor("ew-resize");
                console.log("near", mouseRef.current.down)
                document.documentElement.style.cursor = "ew-resize";
                if(document.documentElement.style.pointerEvents == "none") document.documentElement.style.pointerEvents = "all";
       
            
           
        }else{
            if(document.documentElement.style.cursor == "ew-resize") {
                document.documentElement.style.cursor = "";
                
            }
        }
    }
    useEffect(()=>{
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mousedown", mouseDownHandler)
        window.addEventListener("mouseup", mouseUpHandler)
        return ()=>{
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mousedown", mouseDownHandler)
            window.addEventListener("mouseup", mouseUpHandler)
        }
    },[])
    return (
        <div className={styles.sidebar} ref={sidebarRef} style={{width: sidebarWidth}}>
            <Search videos={videos} onResult={({video, section})=>{
                
                setVideo(section, video);
            }}/>
            <div className={styles.videos}>
                {loading? <VideosSekeleton i={10} color="red" style={{backgroundColor: "var(--medium)", height: [50,40][Math.round(Math.random())], aspectRatio: "unset", containerType: "normal", marginBottom: 3, borderRadius: 8}}/>:
                
                   
                    Object.entries(videos[currentSection]).map(([id, video]) => {
                        //console.log("owowwowow")
                        if(video.files.length > 0){
                            console.log("cicci")
                           console.log({ video });
                        }
                        return <VideoItem key={id} video={video} selected={currentVideo?.hashed_id == video.hashed_id} setCurrentVideo={() =>setVideo(currentSection, video)} />
                        
                    })
                }
            </div>
            <SectionsScoller width={sidebarWidth} />

            
        </div>
    )

}
const SectionsScoller = ({width}: {width: number} ) =>{
    const {currentSection, setSection: setCurrentSection, videos, previousSection, nextSection} = useVideo()
    const sections = Object.keys(videos);
    const ref = useRef<HTMLDivElement>(null);
     const sectionWidth = width - 60;
     const index = sections.indexOf(currentSection) ;
     useEffect(()=>{
        ref.current?.scrollTo({left: (sections.indexOf(currentSection) * sectionWidth ), behavior: "smooth"})
     },[currentSection, sections])
     const handleClick = (section: string) =>{
        setCurrentSection(section);
        ref.current?.scrollTo({left: (sections.indexOf(section) * sectionWidth ), behavior: "smooth"})
     }
    return (
        <div className={styles.sectionScroller}>
            <div className={styles.arrowIcon} style={{borderRadius: "8px 0px 0px 8px"}}>
                    <MdArrowBackIosNew size={30} color="white" onClick={previousSection} ></MdArrowBackIosNew>
            </div>

        <div className={styles.sectionsContainer} ref={ref} style={{width: sectionWidth}}>
             
        <div className={styles.sections}>
            
            {sections.map(section => {
                return (
                <div key={section} className={styles.section} style={{backgroundColor: currentSection === section? "var(--medium)" : "var(--dark)", width: sectionWidth}} onClick={() => handleClick(section)}>
                    <p>{section}</p>
                </div>)
            })}
        </div>
       
        </div>  <div className={styles.arrowIcon} style={{borderRadius: "0px 8px 8px 0px"}}><MdArrowForwardIos size={30} color="white" onClick={nextSection}></MdArrowForwardIos> </div>     </div>)
}
// const SidebarVideoCard = ({video}) =>{
//     return (
//         <div className={styles.videoCard}>
//             <span>{video.name}</span>
//         </div>
//     )
// }
const VideoItem = ({video, selected, setCurrentVideo}: {video: TVideo, selected: boolean, setCurrentVideo: () => void}) =>{
    const [pop, setPop] = useState<React.JSX.Element | null>(null);
    const id = video.hashed_id;
    return (
        <div
            key={id}
            className={styles.videoItem}
            style={{border: selected? "1px solid var(--extra-light)" :  "1px solid var(--medium)"}}
            onClick={()=>setCurrentVideo()}
        >
            
            <p>{video.name}</p>

            <div
                className={
                    styles.videoFiles
                }
            >

                {video.files.map((file) => {
                    console.log({file, files: video.files})
                    return (
                        <>
                        {pop }
                        <div
                           
                            key={
                                file.public_id
                            }
                            className={
                                styles.file
                            }
                            
                        >
                            <p
                               onClick={() => setPop(<FilePop file={file} closePop={() => setPop(null)}/>)}
                                
                                className={
                                    styles.fileName
                                }
                            >
                                {/* {file.name.length > 20? file.name.substr(0,17) + "..." : file.name} */}
                                open file
                            </p>
                        </div>
                        </>
                        
                    );
                })}
            </div>

        </div>
    );
}
type TVideoResult = {video: TVideo, section: string}
const Search = ({videos, onResult}:{videos: TSubcourseVideos, onResult: ({video, section}: TVideoResult)=>void}) =>{
    const [searchStr, setSearchStr] = useState<string>("");
    const [results, setResults] = useState<TVideoResult[]>([]);
    //useEffect(()=> search(searchStr), [videos]);
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if(target.closest(`.${styles.search}`)) return;
        setResults([]);
        //console.log("clicked outside search"
    }

    useEffect(()=>{
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    const search = (str: string) =>{
        let resultsArray:TVideoResult[] = [];
        Object.entries(videos).forEach(([section, vids])=>{
            Object.entries(vids).forEach(([id, video])=>{
                if(video.name.toLowerCase().includes(str.toLowerCase())){
                    resultsArray.push({video, section});
                }
            })});
            console.log({resultsArray});
        setResults(resultsArray);}

    return (
        <div className={styles.search} >
            <div className={styles.searchInput}>
                <input type="text" value={searchStr} 
            onFocus={()=>search(searchStr)}
            style={{borderBottomLeftRadius: results.length > 0? 0 : 8}}
            onChange={(e)=>{
                setSearchStr(e.target.value);
                search(e.target.value);
                }}></input>
                <div className={styles.searchIcon}  style={{borderBottomRightRadius: results.length > 0? 0 : 8}}>
                     <IoMdSearch size={30} color={"white"} className={styles.searchIcon} />
                     </div>
               
            </div>
            
                {/* <Select options={results.map(r=>r.name)} placeholder="Select video" onSelect={(selected)=>{}} /> */}
                <div className={styles.searchResults} style={{height: results.length * 40}}>
                    {results.map(result=>{
                        return <p key={result.video.hashed_id } onClick={()=>{
                            onResult({video: result.video, section: result.section});
                            setResults([]);
                        }}>{result.video.name}</p>
                    })}
                </div>
                
        </div>
    )
}
const FilePop = ({file, closePop}: {file: TFile, closePop: ()=>void}) =>{
   
    const [fileBlob, setFileBlob]  = useState<Blob | null>(null);
    useEffect(()=>{
        console.log("file", {file})
        fetch(file.url).then(res => res.blob()).then(blob => {
            setFileBlob(blob);
            console.log(blob);
        });
    },[])
    return (
    <Transformable>
        <div style={{}} className={styles.filePop}>
            <IoMdClose style={{position: "absolute", top: 5, right: 5, cursor: "pointer"}} onMouseDown={closePop} size={24} color="white"/>

            <IoMdDownload style={{position: "absolute", top: 5, left: 5, cursor: "pointer"}} onClick={()=>window.open(file.url)} size={22} color="white"/>
            <embed src={file.url+"#toolbar=1"} aria-controls="true" height={"100%"} ></embed>
            </div>
    </Transformable>)
}
export default Sidebar;