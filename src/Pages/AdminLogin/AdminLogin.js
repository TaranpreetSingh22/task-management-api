import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSessionToken } from "../../components/Authentication/AuthService";
import Navbar from "../../components/Navbar/Navbar";
import './AdminLogin.css';
import { toast } from "react-toastify";

export default function AdminLogin(){
    const [userData, setUserData] = useState({
      email:'',
      password: '',
    });
    const navigate=useNavigate();

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
            const response = await fetch('http://localhost:5000/api/adminlogin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            });
            const data = await response.json();
            if(response.ok){
              saveSessionToken(data.token);
              setTimeout(()=>{
                toast.success("Login Successful",{
                  position:toast.POSITION.TOP_CENTER,
              });
              },500)
              navigate('/',{state: {data: encodeURIComponent('admin')},replace:true})
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

    return(
        <>
            <Navbar />
            <section id="Admin-login">
                <div id="adminlogin-div">
                    <div id="login-text">Login</div>
                    <div><input type="email" name="email" placeholder="Your Email" onChange={handleInputChange} required /></div>
                    <div><input type="password" name="password" placeholder="Your Password" onChange={handleInputChange} required/></div>
                    <div><input type="button" value="Login" onClick={handleLogin}/></div>
                </div>
            </section>
        </>
    )
}