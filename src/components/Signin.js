import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { handleSignIn } from '../actions';
import logo from '../imgs/socialli_no_bg.png'

const SignIn = (props) => {

    return (
      <SigninWrapper>
        <img src = {logo} alt = "logo" id = "logo"/>
        <h1 className="heading">Socialli</h1>
        <button
            onClick={ (e) => props.handleSignIn(e, props.userSession)}
            className = "signin-button"
        >
          Sign In with Blockstack
        </button>
      </SigninWrapper>
    );
}

const mstp = state => {
    return {
        userSession: state.auth.userSession
    }
}

export default connect(mstp, {handleSignIn})(SignIn);

const SigninWrapper = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
  height: fill-available;

  font-family: 'Work Sans', sans-serif;

  #logo {
    width: 200px;
  }
  .heading {
    font-size: 50px;
  }


  .signin-button {
    font-size: 15px;
    padding: 10px;
    background: #29356d;
    border: 1px solid #29356d;
    color: white;

    transition-duration: .5s;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      background: #409eff;
    }
  }
`;