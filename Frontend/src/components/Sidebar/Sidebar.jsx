import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {


    return (
        <div className="sidebar">
            <ul className="sidebar-list">
                <li>
                    <Link to="/home" className="sidebar-link">Home</Link>
                </li>
                <li>
                    <Link to="/stories" className="sidebar-link">Stories</Link>
                </li>
                <li>
                    <Link to="/books" className="sidebar-link">Books</Link>
                </li>
                
            </ul>
        </div>
    );
};

export default Sidebar;
