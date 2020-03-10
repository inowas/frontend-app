import React, {ComponentType} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Route, useHistory} from 'react-router-dom';
import {IRootReducer} from '../../reducers';
import {setUser, unauthorized} from '../../scenes/user/actions/actions';
import {getFetched, hasSessionKey} from '../../scenes/user/reducers';
import {fetchUrl} from '../api';

interface IProps {
    component: ComponentType<any>;
    exact?: boolean;
    forRoles: string[];
    path: string;
}

const privateRoute = (props: IProps) => {

    const dispatch = useDispatch();
    const userStore = useSelector((state: IRootReducer) => state.user);
    const sessionStore = useSelector((state: IRootReducer) => state.session);

    const history = useHistory();

    const fetchUser = () => {
        fetchUrl('/user',
            (response) => {
                dispatch(setUser(response));
            },
            (error: any) => {
                if (error.response.status === 401) {
                    dispatch(unauthorized);
                    return history.push('/login');
                }
            }
        );
    };

    const userHasAccessToRoute = () => {
        const {forRoles} = props;
        const userRoles = userStore.roles;

        let hasAccess = false;
        userRoles.forEach((role) => {
            if (forRoles.indexOf(role) >= 0) {
                hasAccess = true;
            }
        });

        return hasAccess;
    };

    if (!(getFetched(userStore))) {
        fetchUser();
        return null;
    }

    if (!hasSessionKey(sessionStore)) {
        return history.push('/login');
    }

    if (!userHasAccessToRoute()) {
        return history.push('/tools');
    }

    const {component, ...rest} = props;
    return (<Route {...rest} component={component}/>);
};

export default privateRoute;
