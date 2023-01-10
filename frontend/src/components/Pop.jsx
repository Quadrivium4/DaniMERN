import "./Pop.css"

const Pop = (body) =>{
    console.log(body);
    return (
        <div id="pop-layer">
            <div id="pop-up">
                <div id="pop-body">
                    {body.children}
                </div>
            </div>
        </div>)
}
export default Pop

