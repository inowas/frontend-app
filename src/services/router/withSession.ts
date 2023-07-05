import {ComponentType} from 'react';
import {connect} from 'react-redux';

const mapStateToProps = (state: any) => ({ session: state.session });

const withSession = (component: ComponentType) => connect(mapStateToProps)(component as any);

export default withSession;
