import "./Scroller.css"
const Scroller = ({children, style}) =>{
    console.log(style)
    return (
        <div className="scroller">
            <div className="scroller-content">
                {children}
            </div>
        </div>
    )
}
export default Scroller;