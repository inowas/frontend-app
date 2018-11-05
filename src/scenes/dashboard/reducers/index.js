import { combineReducers } from 'redux';
import ui from './ui';
import tools from './tools';

const dashboard = combineReducers( {
    tools,
    ui
} );

export default dashboard;
