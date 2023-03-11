import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { baseUrl } from "../../App";
import "./Product.css"
const Product = () => {
    const location = useLocation();
    const item = location.state;
    console.log(item)
    return (
        <div id="product" className="page">
            <div className="course">
                <h1>{item.name}</h1>
                <p>{item.description}</p>
                <img src={baseUrl + "/assets/images/" + item.coverImg} alt="subcourse cover" className="subcourse-img"></img>
                <p className="price">€{(item.price/100).toFixed(2)}</p>
                <Link to="/checkout" state={item}>
                    <button>Aquista | {item.name}</button>
                </Link>
            </div>
            <div className="subcourses">
                {item.subcourses? 
                        item.subcourses.map(subcourse=>{
                            return (
                                <div key={subcourse.id} className="subcourse">
                                    <h2>{subcourse.name}</h2>
                                    <img src={baseUrl+ "/assets/images/" + subcourse.coverImg} alt="subcourse cover" className="subcourse-img"></img>
                                    <p className="price">€{(subcourse.price/100).toFixed(2)}</p>
                                    <Link to="/checkout" state={subcourse}>
                                        <button>buy</button>
                                    </Link>
                                </div>
                            )
                        })
                    : null}
            </div>
            
        </div>
    )
}
export default Product
