import React, { Component, useState, useEffect } from 'react';
import {
  Person,
} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default (props) => {
//  constructor(props) {
//  	super(props);
//
//  	this.state = {
//  	  person: {
//  	  	name() {
//          return 'Anonymous';
//        },
//  	  	avatarUrl() {
//  	  	  return avatarFallbackImage;
//  	  	},
//  	  },
//  	};
//  }
    const [person, setPerson] = useState({
        name() {
          return 'Anonymous';
        },
        avatarUrl() {
          return avatarFallbackImage;
        },
    });

    const { handleSignOut, userSession } = props;
    useEffect(() => {
        const { userSession } = props;
        userSession.getFile("/hello.json", {decrypt: false})
          .then((fileContents) => {
              // get the contents of the file /hello.txt
              console.log(JSON.parse(fileContents));
          });

        setPerson(new Person(userSession.loadUserData().profile));
    },[])
    //const { person } = this.state;
    return (
      !userSession.isSignInPending() ?
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
        </div>
        <h1>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</h1>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={ handleSignOut.bind(this) }
          >
            Logout
          </button>
        </p>
      </div> : null
    );
}
