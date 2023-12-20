import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../FontAwesome/FontAwesomeIcons.js';
import './Navbar.css';

export default function Navbar() {
    const [display,setDisplay]=useState('');
    const [bg,setBg]=useState('');

    const showMenu=()=>{
        if (display==='None'){
            setDisplay('flex');
            setBg("linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75))");
        }else{
            setDisplay('None');
            setBg('');
        }
    };

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
                        <li>
                            <Link to='/'>Home</Link>
                        </li>
                        <li>
                            <Link to='/UserSignup'>UserSignup</Link>
                        </li>
                        <li>
                            <Link to='/AdminLogin'>AdminLogin</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}