import { useEffect, useRef } from "react";
import { downloadFile, getImageFromUserVideo, getSrcFromUserFile } from "../../utils";


const FileUpload = ({setFile, defaultFileSrc, filePreview, type, children}: {setFile: (file: File)=>void, defaultFileSrc?: string, filePreview?: React.RefObject<any>, type?: string, children: React.JSX.Element }) =>{
    const input = useRef<HTMLInputElement>(null);
    useEffect(()=>{
        if(defaultFileSrc){
        downloadFile(defaultFileSrc).then(file =>{
             console.log(file,filePreview)
            if(filePreview){
                 console.log(file,filePreview.current)
                //setFile(file);
                filePreview.current.src = defaultFileSrc;
            }
           
        })
    } 
    },[])

    return (
        <div className="FileUpload" style={{cursor: "pointer"}}>
                <input ref={input} type='file' accept={type? type : "*"} style={{display: "none"}} onChange={(e) => {
                    if(!e.target.files) return;
                    const file = e.target.files[0];
                    if(!file) return;
                    setFile(file);
                    console.log(file);
                    
                    if(/image/.test(file.type) && filePreview){
                        getSrcFromUserFile(file).then(src=>{
                            filePreview.current.src = src
                        })
                    }else if(/video/.test(file.type) && filePreview){
                        getImageFromUserVideo(file).then(src=>{
                            filePreview.current.src = src
                        })
                    }else if(/pdf/.test(file.type) && filePreview){
                        getSrcFromUserFile(file).then((src) => {
                            filePreview.current.src = src;
                        });
                    }
                    
                    
                }
            } name='video' id="video"/>
            <div onClick={()=>{
                if(input.current)
                input.current.click();
            }}>
                {children}
            </div>
        </div>
    )
}
export default FileUpload;