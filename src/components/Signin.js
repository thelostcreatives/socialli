import React, { Component } from 'react';
import { handleSignIn } from '../actions';

export default (props) => {

    return (
      <div className="panel-landing" id="section-1">
        <h1 className="landing-heading">Hello, Blockstack!</h1>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signin-button"
              onClick={ (e) => handleSignIn(e, props.userSession)}
          >
            Sign In with Blockstack
          </button>
        </p>
      </div>
    );
}
