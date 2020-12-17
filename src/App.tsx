import {BrowserRouter} from 'react-router-dom';
import React from 'react';
import routes from './routes';

import {Provider} from 'react-redux';
import configureStore from './store';

const store = configureStore();

const app = () => (
    <Provider store={store}>
        <BrowserRouter>
            {routes}
        </BrowserRouter>
    </Provider>
);

export default app;
