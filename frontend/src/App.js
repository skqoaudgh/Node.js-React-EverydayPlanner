import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/authContext';

import AuthPage from './pages/Auth';
import PlannerPage from './pages/Planner';

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null,
    userEmail: null
  }

  login = (token, userId, email) => {
    this.setState({token: token, userId: userId, userEmail: email});
    if(localStorage.savedToken !== token || localStorage.savedUserId !== userId || localStorage.savedUserEmail !== email) {
      localStorage.savedToken = token;
      localStorage.savedUserId = userId;
      localStorage.savedUserEmail = email;
    }
  };
  
  logout = () => {
    this.setState({token: null, userId: null, userEmail: null});
    localStorage.clear();
  };

  UNSAFE_componentWillMount() {
    const savedToken = localStorage.savedToken;
    const savedUserId = localStorage.savedUserId;
    const savedUserEmail = localStorage.saveduserEmail;
    if(savedToken !== 'null' && savedUserId !== 'null' && savedUserEmail !== 'null') {
      this.setState({token: savedToken, userId: savedUserId, userEmail: savedUserEmail});
    }
  }

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
          <main className="main-content">
            <Switch>
              {this.state.token && <Redirect path="/" to="/my" exact/>}
              {this.state.token && <Redirect path="/auth" to="/my" exact/>}
              {!this.state.token && <Route path="/auth" component={AuthPage}/>}
              {this.state.token && <Route path="/my" component={PlannerPage}/>}
              {!this.state.token && <Redirect to="/auth" exact/>}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
