import React from 'react';
import { Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import rootStore from './redux/rootStore';
import PublicRoute from './route/PublicRoute';
import Layout from './layouts/Layout';
import MainPage from './pages/MainPage';
import WalkingDeadPage from './pages/WalkingDeadPage';
// import { TransitionGroup } from 'react-transition-group';
import historyService from './services/HistoryService';

export default () => (
  <Provider store={rootStore}>
    <Router history={historyService}>
      <Switch>
        <PublicRoute exact path="/" layout={Layout} page={MainPage} />
        <PublicRoute exact path="/wd/" layout={Layout} page={WalkingDeadPage} />
      </Switch>
    </Router>
  </Provider>
);
