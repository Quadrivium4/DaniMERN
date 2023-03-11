import Pages from "./pages/Pages";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer"
import { BrowserRouter as Router, Link } from "react-router-dom";
import {Context} from "./Context.js";
import "./App.css"

export const baseUrl =  process.env.NODE_ENV === "production" ? 
                process.env.REACT_APP_ONLINE_SERVER_URL : 
                process.env.REACT_APP_LOCAL_SERVER_URL;
export const protectedUrl =  process.env.NODE_ENV === "production" ? 
                    process.env.REACT_APP_ONLINE_SERVER_URL + "/protected" : 
                    process.env.REACT_APP_LOCAL_SERVER_URL + "/protected";
export const assetsUrl = baseUrl + "/assets/users";
const App = () =>{
    return(
            <Context>
                <Router>
                    <Header />
                    <Pages />
                    <Footer />
                </Router>
            </Context>
    )
}


export default App;
