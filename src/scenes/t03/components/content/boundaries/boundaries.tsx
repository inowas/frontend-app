import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Grid, Segment} from 'semantic-ui-react';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {Boundary, BoundaryCollection, BoundaryFactory} from '../../../../../core/model/modflow/boundaries';
import {BoundaryType, IBoundary} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import ContentToolBar from '../../../../../scenes/shared/ContentToolbar';
import {fetchUrl, sendCommand} from '../../../../../services/api';
import {usePrevious} from '../../../../shared/simpleTools/helpers/customHooks';
import {updateBoundaries, updateModel} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import BoundaryDetails from './boundaryDetails';
import BoundaryImport from './boundaryImport';
import BoundaryList from './boundaryList';

const baseUrl = '/tools/T03';

interface IOwnProps {
    history: any;
    location: any;
    match: any;
    readOnly: boolean;
    types: BoundaryType[];
}

interface IStateProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    soilmodel: Soilmodel;
}

interface IDispatchProps {
    updateBoundaries: (packages: BoundaryCollection) => any;
    updateModel: (model: ModflowModel) => any;
}

type Props = IStateProps & IDispatchProps & IOwnProps;

const boundaries = (props: Props) => {
    const [selectedBoundary, setSelectedBoundary] = useState<IBoundary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const prevPid = usePrevious<string>(props.match.params.pid);
    const prevTypes = usePrevious<BoundaryType[]>(props.types);

    const {id, pid, property} = props.match.params;
    const {model, soilmodel, types} = props;
    const readOnly = model.readOnly;

    const filteredBoundaries = () => {
        const bc = new BoundaryCollection();
        bc.items = props.boundaries.all.filter((b) => props.types.includes(b.type));
        return bc;
    };

    useEffect(() => {
        if (!props.match.params.pid) {
            setIsLoading(true);
            return redirectToFirstBoundary();
        }
    }, []);

    useEffect(() => {
        if (prevTypes && JSON.stringify(props.types) !== JSON.stringify(prevTypes)) {
            setSelectedBoundary(null);
            setIsLoading(true);
            if (!props.match.params.pid) {
                return redirectToFirstBoundary();
            }
        }
    }, [props.types]);

    useEffect(() => {
        setIsLoading(true);
        if (!props.match.params.pid) {
            return redirectToFirstBoundary();
        }
        if (filteredBoundaries().findById(props.match.params.pid)) {
            return fetchBoundary(props.model.id, props.match.params.pid);
        }
    }, [props.boundaries]);

    useEffect(() => {
        if (props.match.params.pid !== prevPid) {
            setSelectedBoundary(null);
            if (filteredBoundaries().findById(props.match.params.pid)) {
                setIsLoading(true);
                return fetchBoundary(props.model.id, props.match.params.pid);
            }
            return redirectToFirstBoundary();
        }
    }, [props.match.params.pid]);

    const redirectToFirstBoundary = () => {
        if (filteredBoundaries().length > 0) {
            const bid = filteredBoundaries().first.id;
            return props.history.push(`${baseUrl}/${id}/${property}/!/${bid}`);
        }
        if (pid) {
            setIsLoading(false);
            return props.history.push(`${baseUrl}/${id}/${property}`);
        }
        setIsLoading(false);
    };

    const fetchBoundary = (modelId: string, boundaryId: string) => {
        fetchUrl(`modflowmodels/${modelId}/boundaries/${boundaryId}`,
            (cBoundary: IBoundary) => {
                setIsLoading(false);
                setSelectedBoundary(cBoundary);
            },
            () => setError(true)
        );
    };

    const handleChangeBoundary = (cBoundary: Boundary) => {
        setSelectedBoundary(cBoundary.toObject());
        setIsDirty(true);
    };

    const handleBoundaryClick = (bid: string) => {
        props.history.push(`${baseUrl}/${id}/${property}/!/${bid}`);
    };

    const handleAdd = (type: BoundaryType) => {
        if (BoundaryFactory.availableTypes.indexOf(type) >= 0) {
            props.history.push(`${baseUrl}/${id}/${property}/${type}`);
        }
    };

    const handleClone = (boundaryId: string) => {
        fetchUrl(`modflowmodels/${model.id}/boundaries/${boundaryId}`,
            (cBoundary: IBoundary) => {
                const b = BoundaryFactory.fromObject(cBoundary);
                if (b) {
                    const clonedBoundary = b.clone();
                    sendCommand(ModflowModelCommand.addBoundary(model.id, clonedBoundary),
                        () => {
                            const cBoundaries = props.boundaries;
                            cBoundaries.addBoundary(clonedBoundary);
                            props.updateBoundaries(cBoundaries);
                            handleBoundaryClick(clonedBoundary.id);
                        },
                        () => setError(true)
                    );
                }
            },
            () => setError(true)
        );
    };

    const handleRemove = (boundaryId: string) => {
        return sendCommand(ModflowModelCommand.removeBoundary(model.id, boundaryId),
            () => {
                const cBoundaries = props.boundaries.removeById(boundaryId);
                props.updateBoundaries(cBoundaries);
                return redirectToFirstBoundary();
            },
            () => setError(true)
        );
    };

    const handleUpdate = () => {
        if (!selectedBoundary) {
            return;
        }
        const cBoundary = BoundaryFactory.fromObject(selectedBoundary);
        return sendCommand(ModflowModelCommand.updateBoundary(model.id, cBoundary),
            () => {
                setIsDirty(false);
                if (cBoundary) {
                    const cBoundaries = props.boundaries;
                    cBoundaries.update(cBoundary);
                    props.updateBoundaries(cBoundaries);
                }
            },
            () => setError(true)
        );
    };

    const handleChangeImport = (cBoundaries: BoundaryCollection) => {
        return props.updateBoundaries(cBoundaries);
    };

    return (
        <Segment color={'grey'} loading={isLoading}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <BoundaryList
                            boundaries={filteredBoundaries()}
                            onAdd={handleAdd}
                            onClick={handleBoundaryClick}
                            onClone={handleClone}
                            onRemove={handleRemove}
                            readOnly={model.readOnly}
                            selected={pid}
                            types={types}
                        />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <ContentToolBar
                                        onSave={handleUpdate}
                                        isDirty={isDirty}
                                        isError={error}
                                        saveButton={!readOnly}
                                        importButton={props.readOnly ||
                                        <BoundaryImport
                                            model={props.model}
                                            soilmodel={props.soilmodel}
                                            boundaries={props.boundaries}
                                            onChange={handleChangeImport}
                                        />
                                        }
                                    />
                                    {!isLoading && selectedBoundary &&
                                    <BoundaryDetails
                                        boundary={BoundaryFactory.fromObject(selectedBoundary)}
                                        boundaries={filteredBoundaries()}
                                        model={model}
                                        soilmodel={soilmodel}
                                        onClick={handleBoundaryClick}
                                        onChange={handleChangeBoundary}
                                        readOnly={readOnly}
                                    />}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

const mapStateToProps = (state: any) => {
    return ({
        readOnly: ModflowModel.fromObject(state.T03.model).readOnly,
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    });
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updateBoundaries: (cBoundaries: BoundaryCollection) => dispatch(updateBoundaries(cBoundaries)),
    updateModel: (model: ModflowModel) => dispatch(updateModel(model))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(boundaries));
