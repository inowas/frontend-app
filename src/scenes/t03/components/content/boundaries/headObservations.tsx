import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Grid, Segment} from 'semantic-ui-react';
import {BoundaryCollection, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import Boundary from '../../../../../core/model/modflow/boundaries/Boundary';
import {fetchUrl} from '../../../../../services/api';
import {updateBoundaries, updateModel} from '../../../actions/actions';

interface IHeadObservationsState {
    error: boolean;
    isDirty: boolean;
    isLoading: boolean;
    selectedHob: object | null;
}

interface IHeadObservationsProps {
    boundaries: BoundaryCollection;
    history: any;
    location: any;
    match: any;
    model: ModflowModel;
    soilmodel: Soilmodel;
}

class HeadObservations extends React.Component<IHeadObservationsProps, IHeadObservationsState> {
    public constructor(props: IHeadObservationsProps) {
        super(props);
        this.state = {
            selectedHob: null,
            isLoading: false,
            isDirty: false,
            error: false
        };
    }

    public componentDidMount() {
        const {id, pid} = this.props.match.params;
        if (pid) {
            this.fetchBoundary(id, pid);
        }
    }

    public componentWillReceiveProps(nextProps: IHeadObservationsProps) {
        const {id, pid} = nextProps.match.params;
        if ((this.props.match.params.id !== id) || (this.props.match.params.pid !== pid)) {
            this.fetchBoundary(id, pid);
        }
    }

    public fetchBoundary = (modelId: string, boundaryId: string) =>
        fetchUrl(`modflowmodels/${modelId}/boundaries/${boundaryId}`,
            (boundary: Boundary) => this.setState({selectedHob: boundary})
        );

    public render() {
        const {isLoading} = this.state;

        return (
            <Segment color={'grey'} loading={isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}/>
                        <Grid.Column width={12}/>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    };
};

const mapDispatchToProps = {
    updateBoundaries, updateModel
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeadObservations));
