import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  UserSession,
  AppConfig
} from 'blockstack';

import Main from './components/Main';
import Profile from './components/Profile';
import Signin from './components/Signin';

import { storeUserSession} from './actions';

const appConfig = new AppConfig(
  ["store_write", "publish_data"],
)
const userSession = new UserSession({ appConfig: appConfig })

const App = (props) => {
    const [userData, setUserData] = useState({});

    props.storeUserSession(userSession);

    useEffect (() => {
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                window.history.replaceState({}, document.title, "/")
                setUserData(userData);
            });
        } 
    }, [props.userSession]);
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !userSession.isUserSignedIn() ?
            <Signin/>
            : <Main/>
          }
        </div>
      </div>
    );
}

const mstp = state => {
    return {
        userSession: state.auth.userSession
    }
}

export default connect(mstp, {storeUserSession})(App);
