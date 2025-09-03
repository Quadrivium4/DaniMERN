import styles from "./VideoSkeleton.module.css";

const VideoSkeleton = ({ videos, setCurrentVideo }) => {
    return (
        <div
            className={styles.skeletonContainer}
        >
            <div className={styles.circle} ></div>
        </div>
    );
};

export default VideoSkeleton;
