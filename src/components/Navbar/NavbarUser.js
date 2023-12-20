import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clearSessionToken } from '../Authentication/AuthService.js';
import { useNavigate } from 'react-router-dom';
import '../FontAwesome/FontAwesomeIcons.js';
import './Navbar.css';
import {  toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function NavbarUser() {
    const [display,setDisplay]=useState('');
    const [bg,setBg]=useState('');
    const navigate=useNavigate();

    const showMenu=()=>{
        if (display==='None'){
            setDisplay('flex');
            setBg("linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75))");
        }else{
            setDisplay('None');
            setBg('');
        }
    };

    const handleLogout=()=>{
        clearSessionToken();
        setTimeout(()=>{
            toast.success("Logout Successful",{
              position:toast.POSITION.TOP_CENTER,
          });
          },500)
        navigate('/')
    }

    return(
        <>
            <header>
                <nav>
                    <div id='welcome-and-menu-div'>
                        <div id='welcome'>
                            Task Management
                        </div>

                        <div id='menu-icon'>
                            <button onClick={showMenu}><FontAwesomeIcon icon="bars" width='100%' height='100%' /></button>
                        </div>
                    </div>

                    <ul style={{'display':display,"backgroundImage":bg}}>
                        <li onClick={handleLogout}>
                            Logout
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}