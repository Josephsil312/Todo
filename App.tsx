import {Provider} from 'react-redux';
import store from './src/store';
import React from 'react';
import HomeScreenNavigator from './src/navigators/HomeScreenNavigator';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <HomeScreenNavigator />
    </Provider>
  );
}

export default App;
