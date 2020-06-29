import React, {ComponentType, useEffect} from 'react';
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

    useEffect(() => {
        if (!(getFetched(userStore))) {
            fetchUser();
            return;
        }

        if (!hasSessionKey(sessionStore)) {
            history.push('/login');
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
            () => {
                dispatch(unauthorized);
                history.push('/login');
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
