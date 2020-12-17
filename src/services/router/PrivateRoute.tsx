import {IRootReducer} from '../../reducers';
import {Route, useHistory} from 'react-router-dom';
import {fetchUrl} from '../api';
import {getFetched, hasSessionKey} from '../../scenes/user/reducers';
import {setUser, unauthorized} from '../../scenes/user/actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import React, {ComponentType, useEffect, useState} from 'react';

interface IProps {
    component: ComponentType<any>;
    exact?: boolean;
    forRoles: string[];
    path: string;
}

const PrivateRoute = (props: IProps) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default PrivateRoute;
