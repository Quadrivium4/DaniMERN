import { useState, useEffect } from "react"
import {Link} from "react-router-dom";
import { useUser, useUserDispatch } from "../../Context";
import "./Store.css"

const Store = () => {
    const dispatch = useUserDispatch();
    const {store}= useUser();
    const [loginPop, setLoginPop] = useState(false);
    const handleLoginPop = () => {
        setLoginPop(!loginPop);
    }
    
    useEffect(()=>{
        console.log("store",store)
        if(!store){
            fetch("http://localhost:1234/store").then(res=>res.json()).then(data=>{
                console.log(data)
                dispatch({type: "SET_STORE", value: data.courses});
            })
        }
    },[])
    return (
        <div id="store" className="page">
            
            <div id="products">
                {store? store.map(course=>{
                    return (

                        <div key={course.id} className="product">
                            <Link to={"/product"} state={course}>
                                <img className="course-img" alt="course-img" src={"http://localhost:1234/assets/images/" + course.coverImg} />
                                <h2 className="title">{course.name}</h2>
                                <h2 id="price">€{(course.price/100).toFixed(2)}</h2>
                                <div id="layer"></div>
                            </Link>
                        </div>
                        
                        )
                }): <p>loading</p>}
            </div>
        </div>
    )
}
export default Store
