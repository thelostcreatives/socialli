import React, { Component, useState, useEffect } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import {
  UserSession,
  AppConfig
} from 'blockstack';

const appConfig = new AppConfig(
  ["store_write", "publish_data"],
)
const userSession = new UserSession({ appConfig: appConfig })

export default (props) => {

    useEffect (() => {
        if (userSession.isSignInPending()) {
          userSession.handlePendingSignIn().then((userData) => {
            window.history.replaceState({}, document.title, "/")
            this.setState({ userData: userData})
            userSession.putFile("/hello.json", JSON.stringify({data: "test"}), {encrypt: false})
          });
        }
    });

    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !userSession.isUserSignedIn() ?
            <Signin userSession={userSession} handleSignIn={ handleSignIn } />
            : <Profile userSession={userSession} handleSignOut={ handleSignOut } />
          }
        </div>
      </div>
    );
}

function handleSignIn(e) {
    e.preventDefault();
    userSession.redirectToSignIn();
}

function handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
}
