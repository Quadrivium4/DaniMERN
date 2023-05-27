const crossing = async(url, method = "GET", body) =>{
    let result;
    if (method === "GET" || method === "DELETE"){
        result = await fetch(url, {
            method: method,
            withCredentials: true,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
            }
        }).then(res => res.json());
    } else if (method === "POST" || method === "PUT"){
        result = await fetch(url, {
            method: method,
            withCredentials: true,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",

            },
            body: JSON.stringify(body),
            
        }).then(async res => {
            
            if(!res.ok){
                let response = await res.json();
                throw response;
            }else{
                return res.json()
            }
            
        });
    }else{
        console.log("invalid method")
    }
    return result
}
const insertScriptHead = ({ name, src }) => {
    if (!document.querySelector(`#${name}`)) {
        const container = document.head || document.querySelector('head')
        const scriptElement = document.createElement('script')
        scriptElement.setAttribute('id', name)
        scriptElement.async = true
        scriptElement.src = src
        container.appendChild(scriptElement)
    }
}
const sendForm = async (url, method, form) => {
    let result = await fetch(url, {
        method: method,
        withCredentials: true,
        credentials: "include",
        headers: {
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
        },
        body: form,

    }).then(res => res.json());
    return result
}
const getSrcFromUserFile = (file) =>{
    return new Promise((resolve, reject)=>{
        let reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
    
}
const downloadFile = async(src) =>{
    // get name from my format: course.coverImg.split("_")[2]
    let blob = await fetch(src).then(res => res.blob())
    console.log("blob",blob)
    let file = new File([blob], src.split('\\').pop().split('/').pop(), { type: blob.type });
    let container = new DataTransfer();
    container.items.add(file);
    return container.files[0];
}
const getImageFromUserVideo = async(video) =>{
    const src = await getSrcFromUserFile(video);
    console.log(src)
    const videoEl = document.createElement("video");
    videoEl.src = src;

    const canvas = document.createElement("canvas");
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");
    
    videoEl.preload = "metadata";
    videoEl.muted = true;
    videoEl.play();
    return new Promise((resolve, reject) => {
        videoEl.addEventListener('loadeddata', () => {
            console.log({ videoEl })
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
            //ctx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);
            videoEl.pause()
            const img = canvas.toDataURL("image/jpeg");
            resolve(img)
        })
    })
}
export {
    crossing,
    insertScriptHead,
    sendForm,
    getSrcFromUserFile,
    getImageFromUserVideo,
    downloadFile
}