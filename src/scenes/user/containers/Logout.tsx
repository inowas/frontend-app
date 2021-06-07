import {Action} from '../actions/index';
import {Redirect} from 'react-router';
import {useDispatch} from 'react-redux';
import React, {useEffect} from 'react';

const Logout = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(Action.logout());
    });

    return (
        <Redirect to={'/'}/>
    );
};

export default Logout;
