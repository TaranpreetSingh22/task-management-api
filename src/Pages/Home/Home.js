import Tasks from "../../components/Tasks/Tasks.js";
import UserLogin from "../UserLogin/UserLogin.js";
import { getSessionToken } from "../../components/Authentication/AuthService.js";
import {decodeToken} from "../../components/Authentication/DecodeToken.js";
import React, {useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavbarUser from "../../components/Navbar/NavbarUser.js";
import NavbarAdmin from "../../components/Navbar/NavbarAdmin.js";
import { toast } from "react-toastify";

export default function Home(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const location = useLocation();
    const receivedData = location.state && location.state.data;
    const session=getSessionToken();

    useEffect(()=>{
        if(session!=null){
            const sessionvalues=decodeToken(session);

            if(sessionvalues.isAdmin){
                setIsAdminLoggedIn(true);
                setIsLoggedIn(false);
            }else if(!sessionvalues.isAdmin){
                setIsLoggedIn(true);
                setIsAdminLoggedIn(false);
                toast.success("Login Successful",{
                    position:toast.POSITION.TOP_CENTER,
                });
            }
        }else{
            setIsAdminLoggedIn(false);
            setIsLoggedIn(false);
        }
    },[session])

    const renderComponenets=()=>{
        if(isLoggedIn){
            return  <>
                        <NavbarUser />
                        <Tasks user={decodeURIComponent(receivedData)}/> 
                    </>
        }else if(isAdminLoggedIn){
            return  <>
                        <NavbarAdmin />
                        <Tasks user='Admin' />
                    </>
        }else {
            return  <div>
                        <UserLogin />
                    </div>
        }
    }

    return(
        <>
            <section id="home">
                <div>
                    {renderComponenets()}
                </div>
            </section>
        </>
    )
}