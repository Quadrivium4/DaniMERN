import { useState } from "react";
let style = {
    backgroundColor: "rgb(15, 20, 55)", 
    padding: "10px 20px", 
    marginTop: "10px", 
    fontSize: "20px", 
    position: "relative",
    display: "flex",
    alignItmes: "center",
    justifyContent: "center"
}
const CopyField = ({textToCopy}) =>{
    const [copied, setCopied] = useState(false);
    const [isHover, setIsHover] = useState(false);
    return <div className="copy-field">
                
                <div type="text" 
                onMouseEnter={()=>{
                    if(!copied) setIsHover(true)
                }}
                onMouseLeave={()=>setIsHover(false)}
                onClick={()=>{
                    setIsHover(false);
                    navigator.clipboard.writeText(textToCopy);
                    setCopied(true);
                    setTimeout(()=>setCopied(false), 2000)
                }} style={style} >
                    {textToCopy}
                {copied? <span style={{backgroundColor: "green", position: "absolute", top: 0, padding: 5, fontSize: 15}}>Copied!</span>: null}
                {isHover? <span style={{backgroundColor: "gray", position: "absolute", top: 0, padding: 5, fontSize: 15}}>Click to Copy!</span>: null }
                </div>
            </div>
}
export default CopyField;