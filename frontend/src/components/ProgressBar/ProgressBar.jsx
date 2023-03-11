import { useRef } from "react";
import { getImageFromUserVideo, getSrcFromUserFile } from "../../utils";


const ProgressBar = ({progress, total, containerStyle, barStyle}) =>{
    //const imgPreview = useRef(null);
    return (
        <div className="ProgressBar" style={{position: 'revlative',textAlign: "center", background: "red", padding: "5px", width:"100%", height: "30px", display: "block", ...containerStyle}}>
            <div className="progress" style={{background: "black", height: "100%", width: (progress/total* 100) + "%", ...barStyle}}>
                <p style={{position: "absolute", width: "100%"}}>{(Math.round((progress/total* 100)) + "%")}</p>
            </div>
             
        </div>
    )
}
export default ProgressBar;