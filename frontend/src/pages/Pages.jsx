import  {Routes, Route, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import AdminDashboard from "./Admin/Dashboard/Dashboard";
import Store from "./Store/Store";
import Product from "./Product/Product";
import Verified from "./Verified";
import Admin, { Admin1,} from "./Admin/Admin";
import View from "./View/View";
import Payment from "./Payment/Payment";
import {useUser} from "../Context";
import Review from "./Review/Review";
import { EditSubcourse } from "./Admin/Dashboard/Components/EditSubcourse/EditSubcourse.tsx";

const Pages = () =>{
    const {isLogged, info }= useUser();
    console.log("Pages: ",{isLogged, info})
    return (
        <Routes>
            <Route
                path="/"
                element={isLogged ? <Navigate to="/dashboard" /> : <Store />}
            ></Route>
            <Route path="/store" element={<Store />}></Route>
            {isLogged && info.role === "admin" ? (
                <Route path="dashboard" element={<Admin />}>

                    <Route index element={<AdminDashboard />} ></Route>
                    <Route
                        path="edit-subcourse"
                        element={<EditSubcourse />}
                    ></Route>
                </Route>
            ) : isLogged ? (
                <Route path="/dashboard" element={<Dashboard />}></Route>
            ) : (
                <Route path="/dashboard" element={<Navigate to="/" />}></Route>
            )}
            {/* <Route path="/dashboard" element={isLogged  && info.role === "admin" ? <Admin />  : isLogged? <Dashboard /> : <Navigate to="/" /> }></Route> */}
            <Route
                path="/review"
                element={
                    isLogged && info.role === "admin" ? (
                        <Review />
                    ) : (
                        <Navigate to="/" />
                    )
                }
            ></Route>
            <Route
                path="/view/:id"
                element={isLogged ? <View /> : <Navigate to="/" />}
            ></Route>
            <Route path="/product" element={<Product />}></Route>
            <Route path="/checkout" element={<Payment />}></Route>
            <Route path="/verified" element={<Verified />}></Route>
        </Routes>
    );
}


export default Pages;
