
const Message = ({type, content, toggle}) =>{

    let style = {
        width: "100%",
        backgroundColor: "rgb(255, 150, 150)",
        color: "rgb(20,20,20)",
        padding: "15px",
        fontSize: "18px",
    }

    console.log(type, content)
    if(type === "error") {
        style.backgroundColor = "rgb(255, 150, 150)"
    }
    else if(type === "success") style.backgroundColor = "rgb(150, 255, 150)";
    else if(type === "warning") style.backgroundColor = "rgb(255, 255, 150)";
    return (
    <div id="message" style={style}>
        {content}
    </div>)
}
export default Message