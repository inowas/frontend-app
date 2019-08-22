import React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import SoilmodelLegacy from '../../../../../core/model/modflow/soilmodel/SoilmodelLegacy';
import {fetchUrl} from '../../../../../services/api';
import {
    updateSoilmodel
} from '../../../actions/actions';
import SoilmodelEditor from './soilmodelEditor';
import SoilmodelSynchronizer from './soilmodelSychronizer';

interface IDispatchProps {
    updateSoilmodel: (soilmodel: Soilmodel) => any;
}

interface IStateProps {
    model: ModflowModel;
    soilmodel: Soilmodel | SoilmodelLegacy;
}

type IProps = IStateProps & IDispatchProps & RouteComponentProps;

const soilmodelGuard = (props: IProps) => {
    const handleFinishSynchronization = (soilmodel?: Soilmodel) => {
        if (soilmodel) {
            return props.updateSoilmodel(soilmodel);
        }

        return fetchUrl(`modflowmodels/${props.model.id}/soilmodel`,
            (data) => props.updateSoilmodel(Soilmodel.fromObject(data))
        );
    };

    if (props.soilmodel instanceof Soilmodel) {
        return (
            <SoilmodelEditor
                readOnly={props.model.readOnly}
                soilmodel={props.soilmodel}
            />
        );
    }

    return (
        <SoilmodelSynchronizer
            soilmodel={props.soilmodel}
            model={props.model}
            onChange={handleFinishSynchronization}
        />
    );
};

const mapStateToProps = (state: any) => {
    return ({
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: Soilmodel.fromQuery(state.T03.soilmodel)
    });
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updateSoilmodel: (soilmodel: Soilmodel) => dispatch(updateSoilmodel(soilmodel)),
});

export default withRouter(connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps)
(soilmodelGuard));
