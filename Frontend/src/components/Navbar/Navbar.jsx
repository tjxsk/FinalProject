import React from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();

    let clearUser = () => {
        localStorage.removeItem('token');
        navigate('/')
    }

    return (
        <>
            <header className="header">
                <a href="/home" className="logo">BookBuddies</a>

                <nav className="navbar">
                    <a onClick={clearUser}>Log out</a>
                </nav>
            </header>
        </>
    )
}

export default Navbar