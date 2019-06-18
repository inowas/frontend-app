import {connect} from 'react-redux';

const mapStateToProps = state => ({ session: state.session });

const withSession = (component) => {
    return connect(mapStateToProps)(component);
};

export default withSession;
