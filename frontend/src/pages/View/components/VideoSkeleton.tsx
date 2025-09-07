import { height } from "pdfkit/js/page";
import styles from "./VideoSkeleton.module.css";

const VideoSkeleton = ({color, style}:{color?: string, style?: any}) => {
    return (
        <div
            style={style}
            className={styles.skeletonContainer}
        >
            <div className={styles.circle} ></div>
        </div>
    );
};
export const VideosSekeleton = ({i, color, style }: {i: number,color?: string, style?: any}) =>{
    let j = 0;
    return (
        <div>
            {Array.from(Array(i)).map(i=>{
                j++;
                console.log(j)
                return <VideoSkeleton key={i} color={color} style={{...style, height:  (j == 3 || j == 5)? 40 : 60}}/>
            })}
        </div>
        
    )

}
export default VideoSkeleton;
