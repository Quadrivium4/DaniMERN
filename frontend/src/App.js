import React, {useState} from "react";

const Example = () => {
    let [user, setUser] = useState("red");
    let propreties = {
        backgroundColor: user,
        padding: "30px"
    }
    const handleClick = () => {
        if(propreties.backgroundColor === "red"){
            setUser("greenyellow");
        }else{
            setUser("red");
        }
    }
    return (
        <div id={user}>
            <h1 style={propreties} lem="coc">{user}</h1>
            <button onClick={handleClick}>Click me</button>
        </div>
    )
}
const App = () =>{
    return(
            <div id="app">
                <input type="text"></input>
                <input type="button" value="" />
                <Example />
            </div>
    )
}

export default App;
