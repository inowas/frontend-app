import React from 'react';
import {ConnectedRouter} from 'connected-react-router'
import routes from './routes'

const App = ({history}) => (
    <ConnectedRouter history={history}>
        <div>
            {routes}
        </div>
    </ConnectedRouter>
);

export default App;
