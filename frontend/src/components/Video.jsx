import React, { PropTypes, useEffect } from 'react'

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

const VideoPlayerEmbed= ({embedId})=>{
    useEffect(()=>{
        let handle;
        window._wq = window._wq || []
        window._wq.push({
        id: embedId,
        onReady: (video) => {
            handle = video
        },
        })
        //wistiaScriptsHandler(embedId)
        handle && handle.remove()
    },[])
    
    return (
      <div className='video' style={{width: "100%"}}>
            <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
                <div style={{height: '100%', left: '0', position: 'absolute', top: '0', width: '100%'}}>
                <div className={`wistia_embed wistia_async_${embedId} videoFoam=true autoPlay=false`}
                    style={{width: '100%', height: '100%'}}>&nbsp;</div>
            </div>
            </div>
        </div>
    )

}
//const VideoPlayerEmbed = () =>{ return (<h1>Hello</h1>)}

export default VideoPlayerEmbed
