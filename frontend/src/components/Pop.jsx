import "./Pop.css"

const Pop = ({children, toggle}) =>{
    const handleClick = () =>{
        toggle();
    }
    return (
        <div id="pop-layer">
            <div id="pop-up">
                <div id="close-pop" onClick={handleClick}>
                    <span n="1"></span>
                    <span n="2"></span>
                </div>
                <div id="pop-body">
                    {children}
                </div>
            </div>
        </div>)
}
export default Pop

