"use client";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<div>Loading...</div>}
        persistor={persistor}
        onBeforeLift={() => console.log('Rehydration complete')}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
