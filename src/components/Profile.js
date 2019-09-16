import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Person,
} from 'blockstack';

import { handleSignOut } from '../actions';
import { List } from '../models';

import ListPreview from './minor_comps/ListPreview';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

const Profile = (props) => {

    const [person, setPerson] = useState({
        name() {
          return 'Anonymous';
        },
        avatarUrl() {
          return avatarFallbackImage;
        },
    });

    const [lists, setLists] = useState([]);

    const { handleSignOut, userSession }  = props;
    useEffect(() => {
        const { userSession } = props;

        List.fetchOwnList().then(data => {
            setLists(data);
        }).catch(err => {
            console.log(err)
        });

        setPerson(new Person(userSession.loadUserData().profile));
    },[])
    //const { person } = this.state;
    return (
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
        </div>
        <h1><span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span></h1>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={ (e) => handleSignOut(e, userSession) }
          >
            Logout
          </button>
        </p>
        <div>
            <ul>
            {
                lists.map(list => {
                    return <ListPreview list = { list }>{list.attrs.title}</ListPreview>
                })
            }
            </ul>
        </div>
      </div> 
    );
}

const mstp = state => {
    return {
        userSession: state.auth.userSession
    }
}

export default connect(mstp, {handleSignOut})(Profile);