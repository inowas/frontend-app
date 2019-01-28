import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import routes from './routes'

import configureStore from './store';
import {Provider} from 'react-redux';

const store = configureStore();

const App = () => (
    <Provider store={store}>
        <BrowserRouter>
            {routes}
        </BrowserRouter>
    </Provider>
);

export default App;
