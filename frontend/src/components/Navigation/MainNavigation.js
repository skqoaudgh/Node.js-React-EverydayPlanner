import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/authContext';

import './MainNavigation.css';

const mainNavigation = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <header className="main-navigation">
                    <div className="main-navigation__logo">
                        <h1>EVERYDAY</h1>
                    </div>
                    <div className="main-navigation__item">
                        <ul>
                            {context.token && <button onClick={context.logout}>Logout</button>}
                        </ul>
                    </div>
                </header>  
            );
        }}
    </AuthContext.Consumer>
);

export default mainNavigation;