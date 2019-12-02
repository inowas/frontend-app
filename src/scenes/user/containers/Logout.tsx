import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router';
import {Action} from '../actions/index';

const logout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(Action.logout());
    }, []);

    return (
        <Redirect to={'/'}/>
    );
};

export default logout;
