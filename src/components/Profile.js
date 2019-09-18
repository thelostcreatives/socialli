import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
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
      <ProfileWrapper>
        <div >
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } id = "avatar-image" alt=""/>
            <button
                onClick={ (e) => handleSignOut(e, userSession) }
              >
            Logout
          </button>
        </div>
        <h1><span>{ person.name() ? person.name() : 'Nameless Person' }</span></h1>
          
        <Grid>
            {
                lists.map(list => {
                    return <ListPreview key = {list._id} list = { list }>{list.attrs.title}</ListPreview>
                })
            }
        </Grid>
      </ProfileWrapper> 
    );
}

const mstp = state => {
    return {
        userSession: state.auth.userSession
    }
}

export default connect(mstp, {handleSignOut})(Profile);

const ProfileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    #avatar-image {
        width: 100px;
        border-radius: 50%;
    }
`;

const Grid = styled.div`
   display: flex;
   width: 100%;
   flex-wrap: wrap;
   justify-content: center;
`




