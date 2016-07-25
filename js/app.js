import 'babel-polyfill';

import App from './components/App';
import AppHomeRoute from './routes/AppHomeRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import RelayEnvironmentSerializer from 'react-relay/lib/RelayEnvironmentSerializer'

import RelayEnvironment from 'react-relay/lib/RelayEnvironment';
import CacheManager from './CacheManager';
import RelayProfiler from 'react-relay/lib/RelayProfiler';

let RelayStore = new RelayEnvironment();

RelayStore._storeData.injectCacheManager(CacheManager);

RelayStore.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql')
);

ReactDOM.render(
  <Relay.Renderer
    environment={RelayStore}
    Container={App}
    queryConfig={new AppHomeRoute()}
  />,
  document.getElementById('root')
);
