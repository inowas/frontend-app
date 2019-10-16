import React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {
    updateSoilmodel
} from '../../../actions/actions';
import SoilmodelEditor from './soilmodelEditor';

interface IDispatchProps {
    updateSoilmodel: (soilmodel: Soilmodel) => any;
}

interface IStateProps {
    model: ModflowModel;
    soilmodel: Soilmodel;
}

type IProps = IStateProps & IDispatchProps & RouteComponentProps & RouteComponentProps<any>;

const soilmodelGuard = (props: IProps) => {
    return (
        <SoilmodelEditor
            readOnly={props.model.readOnly}
            soilmodel={props.soilmodel}
        />
    );
};

const mapStateToProps = (state: any) => {
    return ({
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    });
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updateSoilmodel: (soilmodel: Soilmodel) => dispatch(updateSoilmodel(soilmodel)),
});

export default withRouter(connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps)
(soilmodelGuard));
