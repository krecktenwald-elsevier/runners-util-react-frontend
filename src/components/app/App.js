import React, { Component } from 'react';
import '../../App.css';
import Home from '../home/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RunList from '../run/RunList';
import RunEdit from "../run/RunEdit";

class App extends Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/runs' exact={true} component={RunList}/>
            <Route path='/runs/:id' component={RunEdit}/>
          </Switch>
        </Router>
    )
  }
}

export default App;