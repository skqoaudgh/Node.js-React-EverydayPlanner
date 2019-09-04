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
  };
  
  logout = () => {
    this.setState({token: null, userId: null, userEmail: null});
  };

  UNSAFE_componentWillMount() {
    const savedToken = localStorage.savedToken;
    const savedUserId = localStorage.savedUserId;
    const savedUserEmail = localStorage.saveduserEmail;
    if(savedToken !== 'null' && savedUserId !== 'null' && savedUserEmail !== 'null') {
      this.setState({token: savedToken, userId: savedUserId, userEmail: savedUserEmail});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.token !== this.state.token && prevState.userId !== this.state.userId && prevState.userEmail !== this.state.userEmail) {
        localStorage.savedToken = this.state.token;
        localStorage.savedUserId = this.state.userId;
        localStorage.savedUserEmail = this.state.userEmail;
      }
  }

  render() {
    console.log(this.state.token);
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
