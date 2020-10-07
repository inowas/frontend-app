import React, {ComponentType, useEffect, useState} from 'react';
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
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);

    const dispatch = useDispatch();
    const userStore = useSelector((state: IRootReducer) => state.user);
    const sessionStore = useSelector((state: IRootReducer) => state.session);

    const history = useHistory();

    useEffect(() => {
        if (redirectToLogin) {
            history.push('/login');
            setRedirectToLogin(false);
        }
    }, [redirectToLogin]);

    useEffect(() => {
        if (!(getFetched(userStore))) {
            fetchUser();
            return;
        }

        if (!hasSessionKey(sessionStore)) {
            setRedirectToLogin(true);
            return;
        }

        if (!userHasAccessToRoute()) {
            history.push('/tools');
        }
    }, []);

    const fetchUser = () => {
        fetchUrl('/user',
            (response) => {
                dispatch(setUser(response));
            },
            (e: any) => {
                if (e.response && e.response.status && e.response.status === 401) {
                    dispatch(unauthorized());
                    setRedirectToLogin(true);
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

    const {component, ...rest} = props;
    return (<Route {...rest} component={component}/>);
};

export default privateRoute;
