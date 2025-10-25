import { useState, useEffect } from "react"
import {Link} from "react-router-dom";
import { useUser, useUserDispatch } from "../../Context.tsx";
import {baseUrl} from "../../App"
import "./Store.css"
import Transformable from "../../components/Transformable/Transformable.tsx";

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
            {/* <object
                data={
                    "https://res.cloudinary.com/dkbe7c8we/image/upload/v1757152146/yrkm72khobblsso9wxhl.pdf#toolbar=1&navpanes=1&scrollbar=1"
                }
            >
                eh
            </object> */}
            <div id="products">
                {store ? (
                    store.map((course) => {
                        console.log(course);
                        return (
                            <Link to={"/product"} state={course}>
                                <div key={course.id} className="product">
                                    <div className="cover">
                                        <img
                                            className="course-img"
                                            alt="course-img"
                                            src={course.coverImg.url}
                                        />
                                        <h2>{course.name}</h2>
                                        <h2 id="price">
                                            €{(course.price / 100).toFixed(2)}
                                        </h2>
                                        <div id="layer"></div>
                                    </div>
                                    <div className="details">
                                        <p>{course.description}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <p>loading</p>
                )}
            </div>
            {/*store? <img src="https://res.cloudinary.com/dkbe7c8we/image/upload/v1679289542/olympic_flag.jpg" alt="" />: <p>loading 2</p>*/}
        </div>
    );
}
export default Store
