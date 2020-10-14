import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router';
import {Action} from '../actions/index';

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
