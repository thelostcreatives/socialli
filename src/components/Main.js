import React, {} from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';

import { UserFeed, Profile } from './index';

const Main = (props) => {
    //nav || Feed || Bookmarks?
    return(
        <Router>
            <div>
                <div >
                    NAVIGATION
                    <NavLink to = "/profile"><h1 style = {{color: "black"}}>Profile</h1></NavLink>
                </div>
                <div>
                    <Switch>
                        <Route exact path = "/" component = {UserFeed}/>
                        <Route path = "/profile" component = {Profile}/>
                    </Switch>
                </div>
                <div>
                    BOOKMARKS?
                </div>
                
            </div>
        </Router>
    )
}

export default Main;
