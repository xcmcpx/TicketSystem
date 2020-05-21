import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>Ticket System</h1>
          </div>
          <nav className="main-navigation__items">

            {context.token && (
              <React.Fragment>
                <ul className="nav-left">
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </ul>
                <ul className="nav-right">
                  <li>
                  <NavLink to="/tickets">Tickets</NavLink>
                  </li>
                  <li>
                    <NavLink to="/tickettracking">Ticket Tracking</NavLink>
                  </li>
                  <li>
                    <NavLink to="/timetracker">Time Keeping</NavLink>
                  </li>
                </ul>
              </React.Fragment>
            )}
          </nav>
        </header>
);
    }}
  </AuthContext.Consumer >
);

export default mainNavigation;