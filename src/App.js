import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { configure, User, getConfig } from 'radiks';
import {
  UserSession,
  AppConfig
} from 'blockstack';

import { Main, Signin } from './components';
import { storeUserSession, createCustomUser } from './actions';
import { List } from './models';

const appConfig = new AppConfig(
  ["store_write", "publish_data"],
)

const userSession = new UserSession({ appConfig: appConfig })

configure({
    apiServer: process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : 'http://localhost:5000',
    userSession
})

const App = (props) => {
    const [userData, setUserData] = useState({});

    props.storeUserSession(userSession);

    useEffect (() => {
        const isSigninPending = async (userSession) => {
            if (userSession.isSignInPending()) {
                let data;
                await userSession.handlePendingSignIn().then( async (userData) => {
                    window.history.replaceState({}, document.title, "/")
                    setUserData(userData);
                    data = userData;
                });
                await User.createWithCurrentUser();
                props.createCustomUser(data)
            }
        }
        isSigninPending(userSession);
    }, []);
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

export default connect(mstp, {storeUserSession, createCustomUser})(App);
