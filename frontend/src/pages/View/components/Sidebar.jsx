import styles from "./Sidebar.module.css";

const Sidebar = ({videos, setCurrentVideo}) =>{
    
    return (
        <div className={styles.sidebar}>
            <div className={styles.videos}>
               {videos.map(video => {
                   return (
                       <div onClick={() => setCurrentVideo(video)} style={{ cursor: "pointer" }}>
                           <SidebarVideoCard
                               video={video}
                               key={video.hashed_id}
                           />
                       </div>
                   );
               })}
            </div>
        </div>
    )

}
const SidebarVideoCard = ({video}) =>{
    return (
        <div className={styles.videoCard}>
            <span>{video.name}</span>
        </div>
    )
}
export default Sidebar;