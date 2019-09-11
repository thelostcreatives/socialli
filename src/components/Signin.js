import React, { Component } from 'react';
import { connect } from 'react-redux';

import { handleSignIn } from '../actions';

const SignIn = (props) => {

    return (
      <div className="panel-landing" id="section-1">
        <h1 className="landing-heading">Hello, Blockstack!</h1>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signin-button"
              onClick={ (e) => props.handleSignIn(e, props.userSession)}
          >
            Sign In with Blockstack
          </button>
        </p>
      </div>
    );
}

const mstp = state => {
    return {
        userSession: state.auth.userSession
    }
}

export default connect(mstp, {handleSignIn})(SignIn);
