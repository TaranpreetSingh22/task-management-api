import { useNavigate } from 'react-router-dom';
import { saveSessionToken } from '../../components/Authentication/AuthService';
import { getSessionToken } from '../../components/Authentication/AuthService';
import { decodeToken } from '../../components/Authentication/DecodeToken';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NavbarUser from '../../components/Navbar/NavbarUser'
import './UserLogin.css';
import { toast } from "react-toastify";

export default function UserLogin(){
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
          email:'',
          password: '',
        });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
          ...prevUserData,
          [name]: value,
        }));
      };

    const handleLogin= async ()=>{
      if(userData.email==='' && userData.password===''){
        toast.error('All fields Required',{
          position:toast.POSITION.TOP_CENTER,
      });
      }else if(userData.email===''){
        toast.error('Email Required',{
          position:toast.POSITION.TOP_CENTER,
      });
      }else if(userData.password===''){
        toast.error('Password Required',{
          position:toast.POSITION.TOP_CENTER,
      });
      }else{
        try {
            const response = await fetch('http://localhost:5000/api/userlogin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            });
            const data = await response.json();

            if(response.ok){
              saveSessionToken(data.token);
              navigate('/',{state: {data: encodeURIComponent(data.details.name)},replace:true});
            }else{
              toast.error(data.error,{
                position:toast.POSITION.TOP_CENTER,
            });
            }
          } catch (error) {
            console.error('Error during Login:', error);
          }
        }
    }

    const gotosignup=()=>{
      navigate('/UserSignup');
    }
  
    useEffect(()=>{
      const session=getSessionToken();
      const sessionvalues=decodeToken(session);

      if(session!=null){
        if(!sessionvalues.isAdmin){
            setIsLoggedIn(true);
        }else{
            setIsLoggedIn(false);
        }
    }
    },[])

    const renderNavbar=()=>{
      if(isLoggedIn){
        return  <NavbarUser />
      }else {
        return  <>
                  <Navbar />
                  <div id='welcome-message'>Welcome to Task Management App</div>
                </>
      }
    }  

    return(
        <>
            {renderNavbar()}
            <section id="user-login">
                <div id='login-div'>
                    <div id='login-text'>Login</div>
                    <div><input type="email" name="email" placeholder="Your Email" onChange={handleInputChange}/></div>
                    <div><input type="password" name="password" placeholder="Your Password" onChange={handleInputChange}/></div>
                    <div id='login-button'><input type="button" value="Login" onClick={handleLogin}/></div>
                    <div>OR New User?</div>
                    <div id='signup-div-button' onClick={gotosignup}>Signup here</div>
                </div>
            </section>
        </>
    )
}