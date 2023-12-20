import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import './UserSignup.css'
import { toast } from 'react-toastify'

export default function UserSignup(){
        const [userData, setUserData] = useState({
          name: '',
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
      
        const handleSignup = async () => {
          if(userData.email==='' && userData.name==='' && userData.password===''){
            toast.error('All fields Required',{
              position: 'top-center',
            })
          }else if(userData.email===''){
            toast.error('Email Required',{
              position: 'top-center',
            })
          }else if(userData.name===''){
            toast.error('Name Required',{
              position: 'top-center',
            })
          }else if(userData.password===''){
            toast.error('Password Required',{
              position: 'top-center',
            })
          }else{
            try {
              const response = await fetch('http://localhost:5000/api/usersignup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
              });
              const data = await response.json();
              if(response.ok){
                setTimeout(() => {
                  toast.success('Signup Successful',{
                    position: 'top-center',
                  })
                }, 500);
                navigate('/');
              }else{
                toast.error(data.error,{
                  position: 'top-center',
                })
              }
            } catch (error) {
              console.error('Error during signup:', error);
            }
        }
      };
      
    return(
        <>
            <Navbar />
            <section id="user-signup">
                <div id="signup-div">
                    <div id="signup-text">Sign up</div>
                    <div><input type="text" name="name" placeholder="Your Name" onChange={handleInputChange} required/></div>
                    <div><input type="email" name="email" placeholder="Your Email"  onChange={handleInputChange} required/></div>
                    <div><input type="password" name="password" placeholder="Enter Password" onChange={handleInputChange} required /></div>
                    <div><input type="button" value="signup" onClick={handleSignup} /></div>
                </div>
            </section>
        </>
    )
}