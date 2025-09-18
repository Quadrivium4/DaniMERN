import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Transformable.module.css"
import { set } from "mongoose";
const near = 10;
const resizePoint = {
    top: {
        point: "top",
        cursor: "ns-resize",
    },
    bottom: {
        point: "bottom",
        cursor: "ns-resize",
    },
    left: {
        point: "left",
        cursor: "ew-resize",
    },
    right: {
        point: "right",
        cursor: "ew-resize",
    },
    topLeft: {
        point: "topLeft",
        cursor: "nwse-resize",
    },
    bottomLeft: {
        point: "bottomLeft",
        cursor: "nesw-resize",
    },
    topRight: {
        point: "topRight",
        cursor: "nesw-resize",
    },
    bottomRight: {
        point: "bottomRight",
        cursor: "nwse-resize",
    },
};
const Transformable1 = ({children } : {children: React.JSX.Element}) =>{
    const [size, setSize] = useState({x: 400, y: 300});
    const [position, setPosition] = useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isResizable, setIsResizable] = useState<{point: string, cursor: string} | null>(null);
    const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
    const [listener, setListener] = useState();
    const transformableRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        window.addEventListener("mouseup", ()=>{
            //console.log("window mouse up")
            handleMouseUp();
        })
    })
    const handleMouseMove = useCallback((e) =>{
        console.log("dragging", e);
        if(e.clientX == 0&& e.clientY ==0) return;
        let movX = e.clientX - (dragStart?.x || 0);
        let movY = e.clientY - (dragStart?.y || 0);
        console.log({movX, movY, dragStart, clientX: e.clientX, clientY: e.clientY});
        
        setPosition((prev) => ({
            x: prev.x + movX,//e.movementX,
            y: prev.y + movY, //e.movementY,
        }));
        setDragStart({x: e.clientX, y: e.clientY});
    },[dragStart]);
    const handleResize = useCallback((e) => {
        let x;
        let y;
        if(!isResizable) return;
        //console.log("handle resize", {isResizable})
        if (isResizable.point === resizePoint.top.point) {
            setSize(prev => ({y: prev.y - e.movementY, x: prev.x}));
            setPosition(prev => ({y: prev.y + e.movementY, x: prev.x}));
        } else if (isResizable.point === resizePoint.bottom.point) {
             setSize((prev) => ({ y: prev.y + e.movementY, x: prev.x }));
        } else if (isResizable.point === resizePoint.left.point) {
             setSize((prev) => ({ y: prev.y, x: prev.x - e.movementX}));
             setPosition((prev) => ({ y: prev.y, x: prev.x + e.movementX }));
        } else if (isResizable.point === resizePoint.right.point) {
            setSize((prev) => ({ y: prev.y, x: prev.x + e.movementX }));
        
        } else if (isResizable.point === resizePoint.topLeft.point) {
             setSize((prev) => ({ y: prev.y - e.movementY, x: prev.x  - e.movementX}));
             setPosition((prev) => ({ y: prev.y + e.movementY, x: prev.x + e.movementX}));
        } else if (isResizable.point === resizePoint.topRight.point) {
            setSize((prev) => ({
                y: prev.y - e.movementY,
                x: prev.x + e.movementX,
            }));
            setPosition((prev) => ({
                y: prev.y + e.movementY,
                x: prev.x ,
            }));
        }else if(isResizable.point === resizePoint.bottomLeft.point){
            setSize((prev) => ({
                y: prev.y + e.movementY,
                x: prev.x - e.movementX,
            }));
            setPosition((prev) => ({
                y: prev.y,
                x: prev.x + e.movementX,
            }));
        }else if(isResizable.point === resizePoint.bottomRight.point){
            setSize((prev) => ({
                y: prev.y + e.movementY,
                x: prev.x + e.movementX,
            }));
        }
        // setSize((prev) => ({
        //     x: prev.x + e.movementX,
        //     y: prev.y + e.movementY,
        // }));
    }, [isResizable]);
    const mouseMoveInTarget= (e)=>{
        const rect = transformableRef.current?.getBoundingClientRect();
        if(!rect) return;
        if(e.clientX - rect.left < near && e.clientY - rect.top < near){
            //console.log("near top left corner ----")
            setIsResizable(resizePoint.topLeft);
        }else if (
            (rect.left + rect.width) - e.clientX < near &&
            e.clientY - rect.top < near
        ) {
            setIsResizable(resizePoint.topRight);
            //console.log("near top right corner");
        }else if (e.clientX - rect.left < near && (rect.top + rect.height) - e.clientY < near){
            setIsResizable(resizePoint.bottomLeft);
            //console.log("bottom left corner");
        } else if((rect.left + rect.width) - e.clientX < near && (rect.top + rect.height) - e.clientY < near){
            setIsResizable(resizePoint.bottomRight);
           // console.log("bottom right corner")
        }else if (
            e.clientX > rect.left &&
            e.clientX < rect.left + rect.width &&
            e.clientY > rect.top - near &&
            e.clientY < rect.top + near
        ) {
            //console.log("top resize", {rect, e});
            setIsResizable(resizePoint.top);
            //console.log(isResizable)
        } else if (
            e.clientX > rect.left &&
            e.clientX < rect.left + rect.width &&
            e.clientY > rect.bottom - near &&
            e.clientY < rect.bottom + near
        ) {
            //console.log("bottom resize");
            setIsResizable(resizePoint.bottom);
        } else if (
            e.clientX > rect.left - near&&
            e.clientX < rect.left + near &&
            e.clientY > rect.top  &&
            e.clientY < rect.top + rect.height
        ) {
            //console.log("left resize");
            setIsResizable(resizePoint.left);
        } else if (
            e.clientX > rect.right - near &&
            e.clientX < rect.right + near &&
            e.clientY > rect.top &&
            e.clientY < rect.top + rect.height
        ) {
            //console.log("right resize");
            setIsResizable(resizePoint.right);
        } else {
            if (isResizable) setIsResizable(null);
        }
    }
    const handleMouseDown = () =>{
        // console.log({r: e.target});
        // if(e.target !== transformableRef.current) {
        //     console.log("not target", e.target);
        //    return //e.target.click();
        // }
        //console.log(e.target);
        //console.log("mouse down")
        if(isResizable){
            setIsResizing(true);
            window.addEventListener("mousemove", handleResize, true)
        }else{
            window.addEventListener(
                "mousemove",
                handleMouseMove,
                true
            );
             setIsDragging(true);
        }
        
       
        
    }
    const handleMouseUp = () => {
        //console.log("mouse up");
         window.removeEventListener("mousemove", handleMouseMove, true);
         window.removeEventListener("mousemove", handleResize, true);
         setIsDragging(false);
         setIsResizing(false);
     };
    return (
        <div
            ref={transformableRef}
            className={styles.transformable}
            style={{
                width: size.x,
                height: size.y,
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isResizable
                    ? isResizable.cursor
                    : isDragging
                    ? "grabbing"
                    : "grab",
                position: "absolute",
                padding: 30,
                zIndex: 2,
            }}
            onBlur={() => {
                console.log("blur");
            }}
            onMouseLeave={() => {
                console.log("mouseLeav");
            }}
            //onMouseDown={handleMouseDown}
            onDragStart={(e)=>{
                setDragStart({x: e.clientX, y: e.clientY});
                if(isResizable){
                    console.log("is resizable");
                    setIsResizing(true);
                   // window.addEventListener("mousemove", handleResize, true)
                }else{
                    console.log("drag start");
                    
                   // handleMouseDown()
                }
                
            }}
            draggable={ "true"}
            onDrag={handleMouseMove}
            onDragEnd={(e)=>{
            //    if(isResizable){
            //         console.log("is no more resizable");
            //         setIsResizing(false);
            //         setSize((prev) => {
            //         return {
            //             x: prev.x + (e.clientX - (dragStart?.x || 0)),
            //             y: prev.y + (e.clientY - (dragStart?.y || 0))
            //         }
            //     })
            //         window.removeEventListener("mousemove", handleResize, true)
            //         return
            //     }
            //     console.log("drag end", e);
            //     setPosition((prev) => {
            //         return {
            //             x: prev.x + (e.clientX - (dragStart?.x || 0)),
            //             y: prev.y + (e.clientY - (dragStart?.y || 0))
            //         }
            //     })
                handleMouseUp()
            }}
            //onMouseUp={handleMouseUp}
            onMouseMove={mouseMoveInTarget}
        >
            <div className={styles.childrenContainer} style={{pointerEvents: (isDragging || isResizing)? "none" : "all", }}>
                <p>he</p>
                {children}
            </div>
        </div>
    );
}    

export default Transformable1