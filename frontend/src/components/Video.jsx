import React, { PropTypes, useEffect } from 'react'
import styles from "./Video.module.css"
/*const insertScriptHead = ({ name, src }) => {
  if (!document.querySelector(`#${name}`)) {
    const container = document.head || document.querySelector('head')
    const scriptElement = document.createElement('script')
    scriptElement.setAttribute('id', name)
    scriptElement.async = true
    scriptElement.src = src
    container.appendChild(scriptElement)
  }
}

const wistiaScriptsHandler = (embedId) => {
  const requiredScripts = [{
    name: 'wistia-script',
    src: 'https://fast.wistia.com/assets/external/E-v1.js',
  }]
  requiredScripts.forEach(v => insertScriptHead({
    name: v.name,
    src: v.src,
  }))
}*/

const VideoPlayerEmbed= ({embedId, name})=>{
    useEffect(()=>{
     // console.log("size", size)
        let handle;
        window._wq = window._wq || []
        window._wq.push({
        id: embedId,
        onReady: (video) => {
            handle = video
        },
        options: {
            playerColor: "ff0000"
        }
        })
        //wistiaScriptsHandler(embedId)
        handle && handle.remove()
    },[])
    // return (
    //     <div
    //         className="video"
    //         style={{
    //             width: "100%",
    //             height: "100%",
    //             display: "flex",
    //             objectFit: "contain",
    //         }}
    //     >
    //         <img
    //             src="https://embed-ssl.wistia.com/deliveries/e2909e08ef4b064f05e0354b0550cbf16ca4712c.webp?image_crop_resized=1920x1080"
    //             style={{
    //                 objectFit: "contain",
    //                 aspectRatio: 16 / 9,
    //                 width: "100%",
    //             }}
    //         ></img>
    //     </div>
   // );
       return (
           <div
               style={{
                   overflow: "hidden",
                   display: "flex",
                   flexDirection: "column",
                   alignItems: "center",
                   justifyContent: "center",
               }}
           >
               <div
                   className={styles.video}
                   style={{
                       aspectRatio: 16 / 9,
                       height: "100%",
                       maxHeight: "calc(((100cqw - 400px) / 16) * 9)",
                       maxWidth: "calc(((100cqh - 200px) / 9) * 16)",
                   }}
               >
                   <iframe
                       src={`https://fast.wistia.net/embed/iframe/${embedId}?videoFoam=true&fitStrategy=contain&playerColor=0e3c43`}
                       className={styles.ifr}
                       style={{
                           aspectRatio: 16 / 9,
                           height: "100%",
                       }}
                   ></iframe>
               </div>
               <h1
                   style={{
                       textAlign: "center",
                       marginBottom: 0,
                       paddingTop: 10,
                   }}
               >
                   {name}
               </h1>
           </div>
       );

       /** PIu o meno
    return (
        <div style={{display: "flex", overflow:'hidden', flexDirection: "column",  contain: "size", justifyContent: "center", width: "100cqmax"}}>
            <div
                className={styles.video}
                style={{
                    display: "flex",
                    //alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    maxHeight: "90%"
                }}
            >
                <iframe
                    src={`https://fast.wistia.net/embed/iframe/${embedId}?videoFoam=true&fitStrategy=contain`}
                    className={styles.ifr}
                    style={{
                        aspectRatio: 16 / 9,
                        contain: "size",
                        height: "100%",
                        width: "fit-content",
                        //margin: "auto",
                        // top: "50%",
                        // transform: "translateY(-50%)",
                        position: "relative",
                    }}
                ></iframe>
              
            </div>
            <h1 style={{textAlign: "center", marginBottom: 0, paddingTop: 10}}>{name}</h1>
        </div>
    );*/
    // return (
    //   <div className='video' style={{width: getWidth(size), height: getHeight(size)}}>
    //         <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
    //             <div style={{height: '100%', left: '0', position: 'absolute', top: '0', width: '100%'}}>
    //             <div className={`wistia_embed wistia_async_${embedId} videoFoam=true autoPlay=false`}
    //                 >&nbsp;</div>
    //         </div>
    //         </div>
    //     </div>
    // )

}
//const VideoPlayerEmbed = () =>{ return (<h1>Hello</h1>)}
const getWidth = (size) =>{
  if(size.height < size.width * 0.5625) return size.height * (16/9);
  return size.width;
}
const getHeight = (size) => {
    if (size.width < size.height * 9/16) return size.width * (9/16);
    return size.height;
};
export default VideoPlayerEmbed
