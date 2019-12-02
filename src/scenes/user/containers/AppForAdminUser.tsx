import React, {ReactNode} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {IRootReducer} from '../../../reducers';
import {Action} from '../actions/index';
import {getFetched, hasSessionKey, isAdmin} from '../reducers';

interface IProps {
    children: ReactNode;
}

const appForAdminUser = (props: IProps) => {

    const dispatch = useDispatch();
    const session = useSelector((state: IRootReducer) => state.session);
    const userIsLoggedIn = hasSessionKey(session);

    const user = useSelector((state: IRootReducer) => state.user);
    const userShouldBeFetched = !getFetched(user);
    const userIsAdmin = isAdmin(user);

    if (!userIsLoggedIn) {
        return <Redirect to={'/login'}/>;
    }

    if (userShouldBeFetched) {
        dispatch(Action.fetchUser());
    }

    if (!userIsAdmin) {
        return <Redirect to={'/'}/>;
    }

    return props.children;
};

export default appForAdminUser;
