import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import TicketsPage from './pages/Tickets';
import TicketTrackingPage from './pages/TicketTracking';
import TimeTrackerPage from './pages/TimeTracker';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {

  state = {
    token: null,
    userId: null,
  };

  constructor(props){
    super(props);
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ 
      token: token, 
      userId: userId,
     });
  };

  logout = () => {
    this.setState({ 
      token: null, 
      userId: null,
    });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from ="/" to="/tickets" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/tickets" exact />
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                {this.state.token && (<Route path="/tickets" component={TicketsPage} />)}
                {!this.state.token && <Redirect to="/auth" exact />}
                {this.state.token && <Route path="/tickettracking" component={TicketTrackingPage} />}
                {this.state.token && <Route path="/timetracker" component={TimeTrackerPage} />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;