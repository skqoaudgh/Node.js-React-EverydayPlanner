import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/authContext';

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null,
    userEmail: null
  }

  login = (token, userId, email) => {
    this.setState({token: token, userId: userId, userEmail: email});
  };
  
  logout = () => {
    this.setState({token: null, userId: null, userEmail: null});
  };

  render() {
    return (
      <BrowserRouter>
      <AuthContext.Provider
          value={{
            token: this.state.token, 
            userId: this.state.userId, 
            userEmail: this.state.userEmail,
            login: this.login,
            logout: this.logout
          }}>
          <MainNavigation />
          <main class="main-content">
            <Switch>

            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
