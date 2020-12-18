import {Action} from '../actions/index';
import {IRootReducer} from '../../../reducers';
import {Redirect} from 'react-router-dom';
import {getFetched, hasSessionKey, isAdmin} from '../reducers';
import {useDispatch, useSelector} from 'react-redux';
import React, {ReactNode} from 'react';

interface IProps {
    children: ReactNode;
}

const AppForAdminUser = (props: IProps) => {

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

export default AppForAdminUser;
