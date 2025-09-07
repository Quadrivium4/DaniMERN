
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSubcourse } from "../../../../../controllers";
import { deleteSubcourseFiles, postSubcourse, updateSubcourse, uploadSubcourseCover, uploadSubcourseFiles } from "../../../../../admin";
import FileUpload from "../../../../../components/FileUpload/FileUpload.tsx";
import styles from "./EditSubcourse.module.css"
import Draggable from "react-draggable";
import Moveable from "react-moveable";
import Transformable from "../../../../../components/Transformable/Transformable";
import {IoMdClose} from "react-icons/io"
import { getSrcFromUserFile } from "../../../../../utils";
export type TSubcourse = {
    name: string,
    description: string,
    price: number,
    hashedId: string,
    coverImg: TImage,
    files: TFile[],
    id: string
}
export type TSubcourseVideos = {
    [section: string]: {
        [videoId: string] : TVideo;
    }
}
export type TVideo = {
    hashed_id: string,
    name: string,
    files: TFile[],
    section?: string
}
export type TImage ={
    url: string,
    public_id: string,
    name: string
}
export type TFile = {
    url: string,
    public_id: string,
    name: string
}
export const createSubcourseVideos = (files: TFile[], medias: TVideo[]) =>{
    let newSubcourseVideos : TSubcourseVideos = { main: {} };
    let videoFiles;
    for (let i = 0; i < medias.length; i++) {
        const video = medias[i];
        if(files){
            videoFiles = files[video.hashed_id];
            
        }
        video.files = videoFiles || [];
        if(!video.section){
            newSubcourseVideos.main[video.hashed_id] = video;
        }else if(video.section && newSubcourseVideos.hasOwnProperty(video.section)){
            newSubcourseVideos[video.section][video.hashed_id] = video;
        }else if(video.section && !newSubcourseVideos.hasOwnProperty(video.section)){
            newSubcourseVideos[video.section] = {
                [video.hashed_id]: video
            }
        }
       
        
    }
     console.log({newSubcourseVideos})
    return newSubcourseVideos;
}
export const EditSubcourse = () =>{
    const { subcourse, action} = useLocation().state //as {subcourse: TSubcourse, action: "create" | "update"};
    const refMoveable = useRef(null);
    const [moveTarget, setMoveTarget] = useState(null);
    const imgPreview = useRef(null)
    const [subcourseData, setSubcourseData] = useState<TSubcourse>({
        name: subcourse.name,
        description: subcourse.description,
        price: subcourse.price,
        hashedId: subcourse.hashedId,
        coverImg: subcourse.coverImg,
        files: [],
        id: subcourse._id
    });

    const [subcourseVideos, setSubcourseVideos] = useState<TSubcourseVideos>(
        {
           main: {

           }     
        }
    );
    useEffect(()=>{
        console.log("sub videos", subcourseVideos)
    },[subcourseVideos])
    useEffect(() =>{
        console.log({subcourse})
        getSubcourse(subcourse._id).then(({data})=>{
            console.log(data);
            
            let newSubcourseVideos : TSubcourseVideos =createSubcourseVideos(subcourse.files, data.medias);
            setSubcourseVideos(newSubcourseVideos);
            //console.log("subcourse data", res);
            //setSubcourseVideos(data.medias);
        });
    },[])

    const updateFile = (file: TFile, videoHahsedId, section ) =>{
        console.log("updating file", file, videoHahsedId);
        let newVideos :TSubcourseVideos = {...subcourseVideos};
        if (newVideos[section][videoHahsedId].files){
            newVideos[section][videoHahsedId].files.push(file);
        }else {
            newVideos[section][videoHahsedId].files = [file];
        }
        setSubcourseVideos(newVideos);
    }
    const removeFile = (file, videoHahsedId, section) =>{
         let newVideos :TSubcourseVideos = { ...subcourseVideos };
         if (newVideos[section][videoHahsedId].files) {
            let newFiles : TFile[] = [];
            for (let i = 0; i < newVideos[section][videoHahsedId].files.length; i++) {
                if(newVideos[section][videoHahsedId].files[i].public_id != file.public_id){
                    newFiles.push(newVideos[section][videoHahsedId].files[i]);
                }
                
            }
            newVideos[section][videoHahsedId].files = newFiles;
         }
         setSubcourseVideos(newVideos);
    }
    const handleEdit = async() =>{
        const form = new FormData();
        form.append("name", subcourseData.name);
        form.append("description", subcourseData.description);
        form.append("price", subcourseData.price.toString());
        form.append("hashedId", subcourseData.hashedId);
            for(const [key, value] of Object.entries(subcourseData) ){
                
              
                console.log(key, value)
            }
        if(action === "update"){
            updateSubcourse(form);
        }else if(action === "create"){
            postSubcourse(form);
        }else{
            console.log("unknown action")
        }
        
    }
    return (
        <div id="edit-subcourse" className={`page ${styles.page}`}>
            <h1>Edit</h1>
            <div className={styles.sections}>
                <div className={styles.section}>
                    <p>Course Name:</p>
                    <input
                        type="text"
                        value={subcourseData.name}
                        onChange={(e) =>
                            setSubcourseData({
                                ...subcourseData,
                                name: e.target.value,
                            })
                        }
                    />
                    <p>Course Description:</p>
                    <input
                        type="text"
                        value={subcourseData.description}
                        onChange={(e) =>
                            setSubcourseData({
                                ...subcourseData,
                                description: e.target.value,
                            })
                        }
                    />
                    <p>Course Price:</p>
                    <input
                        type="text"
                        value={subcourseData.price}
                        onChange={(e) =>
                            setSubcourseData({
                                ...subcourseData,
                                price: parseInt(e.target.value, 10),
                            })
                        }
                    />
                    <p>Course Cover</p>
                    <FileUpload
                        setFile={(file) => {
                            const formData = new FormData();
                            formData.append("coverImg", file);
                            console.log({file});
                            uploadSubcourseCover(formData).then((data) => {
                                setSubcourseData({
                                    ...subcourseData,
                                    coverImg: data.image,
                                });
                            });
                            // setSubcourseData({
                            //     ...subcourseData,
                            //     coverImg: file,
                            // });
                        }}
                        filePreview={imgPreview}
                        type="image"
                        defaultFileSrc={subcourse.coverImg.url}
                    >
                        <img
                            className={styles.img}
                            ref={imgPreview}
                            alt="a preview of img selcted"
                        />
                    </FileUpload>
                    <p>Hashed Id:</p>
                    <input
                        type="text"
                        value={subcourseData.hashedId}
                        onChange={(e) =>
                            setSubcourseData({
                                ...subcourseData,
                                hashedId: e.target.value,
                            })
                        }
                    />
                </div>
                <div className={styles.section}>
                    <h3>Subcourse Videos:</h3>
                    {Object.entries(subcourseVideos).map(
                        ([section, videos]) => {
                            //console.log({ section, videos });
                            return (
                                <div key={section} className={styles.videoSection}>
                                    <h4>{section}</h4>
                                    <div className={styles.videoItems}>
                                    {Object.entries(videos).map(([id, video]) => {
                                        if(video.files.length > 0){
                                            console.log({ video });
                                        }
                                        return <VideoItem video={video} section={section} updateFile={updateFile} subcourseId={subcourse._id} removeFile={removeFile}/>
                                        
                                    })}
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
            <button id="save" onClick={handleEdit}>
                Save
            </button>
        </div>
    );
}
const VideoItem = ({video, section, updateFile, removeFile, subcourseId}) =>{
    const [uploadingFile, setUploadingFile] = useState<{data: any, videoHashedId: string} | null>();
    const uploadFile = async (file, videoHashedId, section) => {
        const fileSrc = await getSrcFromUserFile(file);
        setUploadingFile({ data: fileSrc, videoHashedId });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("hashedId", videoHashedId);
        formData.append("id", subcourseId);
        // console.log(
        //     formData
        // );
        const fileRes = await uploadSubcourseFiles(formData);
        setUploadingFile(null);
        updateFile(fileRes.file, videoHashedId, section);

        console.log("File uploaded successfully");
    };
    const deleteFile = async(file, videoHahsedId, section) =>{
        await deleteSubcourseFiles({
            id: subcourseId,
            hashedId: videoHahsedId,
            public_id: file.public_id,
        });
        removeFile(file, videoHahsedId, section);
        console.log("File deleted successfully");
    }
    const id = video.hashed_id;
    return (
        <div
            key={id}
            className={styles.videoItem}
        >
            <p>{video.name}</p>

            <div
                className={
                    styles.videoFiles
                }
            >
                {video.files.map((file) => {
                    return (
                        <div
                            key={
                                file.public_id
                            }
                            className={
                                styles.file
                            }
                        >
                            <object
                                data={
                                    file.url
                                }
                                className={
                                    styles.obj
                                }
                            >
                                no file
                                rendered
                            </object>
                            <div
                                className={
                                    styles.overlay
                                }
                            ></div>
                            <IoMdClose
                                onClick={()=> deleteFile(file, video.hashed_id, section)}
                                size={22}
                                color="white"
                                className={
                                    styles.closeIcon
                                }
                            />
                            <p
                                className={
                                    styles.fileName
                                }
                            >
                                {file.name}
                            </p>
                        </div>
                    );
                })}
                {uploadingFile && uploadingFile.videoHashedId === id? <object
                    data={uploadingFile.data}
                    className={styles.obj}
                >
                    
                </object> : null}
                
            </div>
            <FileUpload
            type={"file"}
             setFile={(file) =>uploadFile(file, id, section)}>
                    <p>upload file</p>
                </FileUpload>
        </div>
    );
}