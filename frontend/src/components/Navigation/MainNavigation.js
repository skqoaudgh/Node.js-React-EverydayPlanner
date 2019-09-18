import React from 'react';

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
                            {context.token && <button onClick={() => {window.location.reload(false)}}>Refresh</button>}
                            {context.token && <button onClick={context.logout}>Logout</button>}
                        </ul>
                    </div>
                </header>  
            );
        }}
    </AuthContext.Consumer>
);

export default mainNavigation;