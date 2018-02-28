import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/';
import Archive from '../../views/Archive/';
import ArchiveMonth from '../../views/ArchiveMonth/ArchiveMonth';
import ArchiveUser from '../../views/ArchiveUser/ArchiveUser';
import RealTime from '../../views/RealTime/RealTime';

class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                
                <Route path="/archive/user/:id" name="ArchiveUser" component={ArchiveUser}/>
                <Route path="/archive/user" name="ArchiveUser" component={ArchiveUser}/>
                <Route path="/archive/month" name="ArchiveMonth" component={ArchiveMonth}/>
                <Route path="/archive" name="Archive" component={Archive}/>
                <Route path="/realtime" name="RealTime" component={RealTime}/>
                <Redirect from="/" to="/dashboard"/>
              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
