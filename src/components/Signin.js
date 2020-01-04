import React, { } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { handleSignIn } from '../actions';
import logo from '../imgs/socialli_no_bg.png'

import socialli_config from '../socialli_config';

const SignIn = (props) => {

    return (
      <SigninWrapper>
        <div className = "section">
          <img src = {logo} alt = "logo" id = "logo"/>
          <div className = "heading">
            <h1>Socialli</h1>

            {
              window.location.href !== "https://socialli.st/" ?
              <p>
                {socialli_config.instance_description}
              </p>
              :
              null
            }
          </div>
          <button
              onClick={ (e) => props.handleSignIn(e, props.userSession)}
              className = "signin-button"
          >
            Sign In with Blockstack
          </button>
        </div>
        {
          window.location.href.includes("https://socialli.st/") ?
          <>
            <div className = "section">
              <div>
                <h1>
                  Social Media Problem
                </h1>
                <p>
                  Big social media companies collect your data to optimize for advertisements. 
                  You are using their services for free in exchange for your data. How much your 
                  data is worth? Who knows.
                </p>
              </div>
            </div>
            <div className = "section">
              <div>
                <h1>
                  What is socialli?
                </h1>
                <p>
                  Nobody is one-dimensional, why should we only have one social media feed? On socialli we can have multiple "lists", a feed for our different interests. 
                  We might like a person's art, but not their politics, then just follow their "art list".
                </p>
                <p>
                  Socialli is an opensource decentralized social media app built with Blockstack.
                </p>
                <h2>
                  Features
                </h2>
                <h3>
                  Data Ownership
                </h3>
                <p>
                  Your data is your own. Private data, like the "lists" you follow are only accessible by you. Thus, can't be exploited.
                </p>

                <h3>
                  Host Independent Socialli Instances
                </h3>
                <p>
                  You are not stuck with <a href = "https://socialli.st/">socialli.st</a>. 
                  If you want to host or join an instance of Socialli exclusively for your family, friends, or community, you can do so.
                  As a host, you can choose to make it public or private where only people you add as members can access. 
                </p>

                <h3>
                  Universal Login
                </h3>
                <p>
                  As a user, you don't need to make multiple accounts, you only need your Blockstack account to access different socialli instances. 
                </p>
                <a href="https://www.notion.so/socialli/Socialli-55db29d73b7e43118b65167b4b1691dd" target="_blank" rel="noopener noreferrer">More</a>
              </div>
            </div>

            <div className = "section">
              <div>
                <h1>
                  What is Blockstack?
                </h1>
                <p>
                  Blockstack provides user-controlled login and storage that enable you to take back control of your identity and data.
                </p>
                <a href="https://blockstack.org/try-blockstack" target="_blank" rel="noopener noreferrer">Learn more</a>
              </div>
            </div>

            <div className = "footer">
              <p>
              Made with <span role="img" aria-label="coffee">☕</span> by <a href="https://twitter.com/xanderjakeq" target="_blank" rel="noopener noreferrer">xanderjakeq</a>
              </p>
            </div>
          </>
          :
          null
        } 
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

  font-family: 'Work Sans', sans-serif;

  #logo {
    width: 200px;
  }
  .heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      font-size: 50px;
      margin-bottom: 0;
    }

    margin-bottom: 50px;
  }

  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 45vh;
    width: 100%;

    p {
      margin: 10px 0;
      max-width: 500px;
      line-height: 1.5;
    }
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
  
  .footer {
    margin: 50px 0;
    max-width: 500px;
    width: 100%;
  }
`;