import React, {ComponentType, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect, Route} from 'react-router-dom';
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
    const [isError, setIsError] = useState<boolean>(false);

    const fetchUser = () => {
        fetchUrl('/user',
            (response) => {
                dispatch(setUser(response));
            },
            (error: any) => {
                if (error.response.status === 401) {
                    dispatch(unauthorized);
                    return (<Redirect to={'/login'}/>);
                }
                setIsError(true);
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
        return (
            <Redirect to={'/login'}/>
        );
    }

    if (!userHasAccessToRoute()) {
        return (<Redirect to={'/tools'}/>);
    }

    const {component, ...rest} = props;
    return (<Route {...rest} component={component}/>);
};

export default privateRoute;
