import {ComponentType} from 'react';
import {connect} from 'react-redux';

const mapStateToProps = (state: any) => ({ session: state.session });

const withSession = (component: ComponentType) => {
    return connect(mapStateToProps)(component);
};

export default withSession;
