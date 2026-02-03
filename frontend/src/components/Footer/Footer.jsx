import { useLocation } from "react-router-dom";
import "./Footer.css"
const Footer = ()=>{
    let location = useLocation()
    return (
        <div id="footer" style={{display: location.pathname.startsWith("/landing-page")? "none": "flex"}}>
            <div id="contact">
                {/* <p>Daniele Giacobbe</p> */}
                <p>Email: danielegiacobbe04@gmail.com</p>
                {/* <p>P. iva:  02712000039</p> */}
            </div>
            <div id="legal">
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms-of-use">Terms of Use</a>
            </div>
            
        </div>
    )
}
export default Footer