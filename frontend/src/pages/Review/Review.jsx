import {  useEffect, useState, useRef} from "react";
import { useLocation } from "react-router-dom";
import { insertScriptHead } from "../../utils";
import Video from "../../components/Video";
import Pop from "../../components/Pop";
import {
    postReview
} from "../../admin";
import "./Review.css"

const Review = () => {
    console.log("hi")
    const location = useLocation();
    const review = location.state;
    const {hashedId, previewImg} = review.video;
    const {_id} = location.state;
    const [popContent, setPopContent] = useState();
    const [reviews, setReviews] = useState() 
    useEffect(()=>{
        insertScriptHead({
            name: 'wistia-script',
            src: 'https://fast.wistia.com/assets/external/E-v1.js',
        })
    })
    //console.log("USER ADMIN: ", user)

    return (
        <div id="review" className="page">
            {popContent? <Pop toggle={()=>{setPopContent(null)}}>{popContent}</Pop>: null}
            <Video embedId={hashedId} />
            <p>{review.description}</p>
            <button onClick={()=>{
                setPopContent(<PdfForm id={_id} previewImg={previewImg}></PdfForm>);
                }}>Send Feedback</button>
        </div>
    )
}
const PdfForm = ({id, previewImg}) =>{
    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 2000
    });
    const [comment, setComment] = useState("");
    const [fields, setFields] = useState([
        {
            name: "Padronanaza Camera", 
            rate: 0
        },{
            name: "Storytelling",
            rate:0
        },{
            name: "Composizione",
            rate: 0
        },{
            name: "Movimenti di Camera",
            rate: 0
        },{
            name: "Illuminazione",
            rate: 0
        },{
            name: "Editing", 
            rate: 0
        },{
            name: "Color Grading",
            rate: 0
        },{
            name: "Sound Design",
            rate: 0
        }
    ]);

    const sendPdf = () =>{
        console.log(fields);
        postReview({
            id,
            fields,
            priceRange,
            comment,
            previewImg
        })
    }
    return (
        <>
            <h1>Pdf Form</h1>
            {fields.map((field, i )=>{
                return (
                    <div className="field" key={i}>
                        <h3>{field.name}</h3>
                        <input type="number" value={field.rate} max={5} 
                        onChange={(e)=>{
                                const newFields = [...fields];
                                newFields[i].rate = e.target.value
                                setFields(newFields) 
                            }
                        }/>
                    </div>
                    )
            })}
            <h3>Minimim Price</h3>
            <input type="number" value={priceRange.min} onChange={(e)=>setPriceRange({...priceRange, min: e.target.value})}></input>
            <h3>Maximum Price</h3>
            <input type="number"value={priceRange.max}  onChange={(e)=>setPriceRange({...priceRange,max: e.target.value})}></input>
            <h3>Comment</h3>
            <textarea value={comment} onChange={(e)=>setComment(e.target.value)}></textarea>
            <button onClick={sendPdf}>Send</button>
        </>
    )
}
const PdfFormField = () =>{

}


export default Review