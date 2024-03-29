import { useState, useEffect } from "react"
import {Link} from "react-router-dom";
import { useUser, useUserDispatch } from "../../Context";
import {baseUrl} from "../../App"
import { getFile } from "../../controllers";
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
            fetch(baseUrl+ "/store").then(res=>res.json()).then(data=>{
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
                        <Link to={"/product"} state={course}>
                        <div key={course.id} className="product">
                        <img className="course-img" alt="course-img" src={getFile(course.coverImg)} />
                            <h2>{course.name}</h2>
                            <h2 id="price">€{(course.price/100).toFixed(2)}</h2>
                        <div id="layer"></div>
                            
                            
                        </div>
                        </Link>
                        )
                }): <p>loading</p>}
                
            </div>
            {/*store? <img src="https://res.cloudinary.com/dkbe7c8we/image/upload/v1679289542/olympic_flag.jpg" alt="" />: <p>loading 2</p>*/}
        </div>
    )
}
export default Store
