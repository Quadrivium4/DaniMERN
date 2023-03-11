import { useEffect, useRef } from "react";
import { downloadFile, getImageFromUserVideo, getSrcFromUserFile } from "../../utils";


const FileUpload = ({setFile, defaultFileSrc, imgPreview, type, children}) =>{
    const input = useRef(null);
    useEffect(()=>{
        if(typeof defaultFileSrc == "string"){
        downloadFile(defaultFileSrc).then(file =>{
            console.log(file,imgPreview.current)
            setFile(file);
            imgPreview.current.src = defaultFileSrc;
        })
    } 
    },[])

    return (
        <div className="FileUpload" style={{cursor: "pointer"}}>
                <input ref={input} type='file' accept={type? type : "*"} style={{display: "none"}} onChange={(e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    setFile(file);
                    console.log(file)
                    if(/image/.test(file.type)){
                        getSrcFromUserFile(file).then(src=>{
                            imgPreview.current.src = src
                        })
                    }else if(/video/.test(file.type)){
                        getImageFromUserVideo(file).then(src=>{
                            imgPreview.current.src = src
                        })
                    }
                    
                    
                }
            } name='video' id="video"/>
            <div onClick={()=>{
                input.current.click();
            }}>
                {children}
            </div>
        </div>
    )
}
export default FileUpload;