import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { handleSignIn } from '../actions';
import { Post, AnyListUser } from '../models';
import logo from '../imgs/socialli_no_bg.png'

const SignIn = (props) => {

    const [postsCount, setPostsCount ] = useState(0);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
      Post.count().then((data) => {
        setPostsCount(data);
      }).catch((error) => {
        console.log("error counting posts")
      });

      AnyListUser.count().then((data) => {
        setUserCount(data);
      }).catch((error) => {
        console.log("error counting users");
      });
    });

    return (
      <SigninWrapper>
        <div className = "section">
          <img src = {logo} alt = "logo" id = "logo"/>
          <h1 className="heading">Socialli</h1>
          <button
              onClick={ (e) => props.handleSignIn(e, props.userSession)}
              className = "signin-button"
          >
            Sign In with Blockstack
          </button>
          <h2>
            Users: {userCount} Posts: {postsCount}
          </h2>
        </div>

        <div className = "section">
          <div>
            <h2>
              What is socialli?
            </h2>
            <p>
              Socialli is just another social media app. But decentralized.
            </p>
          </div>
        </div>

        <div className = "section">
          <div>
            <h2>
              What is Blockstack?
            </h2>
            <p>
              Blockstack provides user-controlled login and storage that enable you to take back control of your identity and data.
            </p>
            <a href="https://blockstack.org/try-blockstack" target="_blank" rel="noopener noreferrer">Learn more</a>
          </div>
        </div>

        <div className = "footer">
          <h3>
            Join <a href="https://discord.gg/zYzh9Zy">discord</a> for development discussions and other things.
          </h3>     
          <p>
          Made with <span role="img" aria-label="coffee">☕</span> by <a href="https://socialli.st/xanderjakeq.id.blockstack">xanderjakeq</a>
          </p>
        </div>
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
    font-size: 50px;
  }

  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%

    p {
      max-width: 500px;
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
`;