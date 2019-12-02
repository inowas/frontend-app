import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {withRouter} from 'react-router-dom';
import {Action} from '../actions/index';

type IProps = RouteComponentProps<any>;

const logout = (props: IProps) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(Action.logout());
        props.history.push('/');
    }, []);

    return null;
};

export default withRouter(logout);
