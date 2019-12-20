import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { configure, User, getConfig } from 'radiks';
import {
  UserSession,
  AppConfig
} from 'blockstack';

import { Main, Signin, NoAccessMessage } from './components';
import { storeUserSession, getCustomUser } from './actions';
import { List } from './models';

import socialli_config from './socialli_config';

const appConfig = new AppConfig(
  ["store_write", "publish_data"],
)

const userSession = new UserSession({ appConfig: appConfig })

configure({
    apiServer: process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : 'http://localhost:5000',
    userSession
})

const App = (props) => {

    document.title = socialli_config.instance_name;
    
    const [userData, setUserData] = useState({});

    props.storeUserSession(userSession);

    useEffect (() => {
        const isSigninPending = async (userSession) => {
            let data;
            if (userSession.isSignInPending()) {
                await userSession.handlePendingSignIn().then( async (userData) => {
                    window.history.replaceState({}, document.title, "/")
                    setUserData(userData);
                    data = userData;
                });
                await User.createWithCurrentUser();
                props.getCustomUser(data)
            } else if (userSession.isUserSignedIn()) {
                data = userSession.loadUserData();
                setUserData(data);
                props.getCustomUser(data)
            }
        }
        isSigninPending(userSession);
    }, []);
    return (
      <div>
        { !userSession.isUserSignedIn() ?
          <Signin/>
          : 
          userData.username ?
          <Main/>
          :
          <NoAccessMessage fullWidth/>
        }
      </div>
    );
}

const mstp = state => {
    return {
        userSession: state.auth.userSession
    }
}

export default connect(mstp, {storeUserSession, getCustomUser})(App);
