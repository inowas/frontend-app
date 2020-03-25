import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import {Grid, Segment} from 'semantic-ui-react';
import {EMessageState, IMessage} from '../../../../../core/model/messages/Message.type';
import MessagesCollection from '../../../../../core/model/messages/MessagesCollection';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {Boundary, BoundaryCollection, BoundaryFactory} from '../../../../../core/model/modflow/boundaries';
import {BoundaryType, IBoundary} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {IRootReducer} from '../../../../../reducers';
import {fetchUrl, sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {usePrevious} from '../../../../shared/simpleTools/helpers/customHooks';
import {addMessage, removeMessage, updateBoundaries, updateMessage} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {messageDirty, messageError, messageSaving} from '../../../defaults/messages';
import BoundaryDetails from './boundaryDetails';
import BoundaryImport from './boundaryImport';
import BoundaryList from './boundaryList';

const baseUrl = '/tools/T03';

interface IProps {
    types: BoundaryType[];
}

const boundaries = (props: IProps) => {
    const [selectedBoundary, setSelectedBoundary] = useState<IBoundary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const {id, pid, property} = useParams();
    const prevPid = usePrevious<string>(pid);

    const types = props.types;
    const prevTypes = usePrevious<BoundaryType[]>(props.types);

    const dispatch = useDispatch();
    const history = useHistory();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const boundaryCollection = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const messages = MessagesCollection.fromObject(T03.messages);
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

    const boundaryRef = useRef<IBoundary>();
    const editingState = useRef<{ [key: string]: IMessage | null }>({
        dirty: null,
        saving: null
    });

    if (!boundaryCollection || !model || !soilmodel) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    const readOnly = model.readOnly;

    const filteredBoundaries = () => {
        const bc = new BoundaryCollection();
        bc.items = boundaryCollection.all.filter((b) => props.types.includes(b.type));
        return bc;
    };

    useEffect(() => {
        return function cleanup() {
            handleUpdate();
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            editingState.current = messages.getEditingState('boundaries');
        }
        if (selectedBoundary) {
            boundaryRef.current = selectedBoundary;
        }
    }, [messages, selectedBoundary]);

    useEffect(() => {
        if (!pid) {
            setIsLoading(true);
            return redirectToFirstBoundary();
        }
    }, []);

    useEffect(() => {
        if (prevTypes && JSON.stringify(props.types) !== JSON.stringify(prevTypes)) {
            setSelectedBoundary(null);
            setIsLoading(true);
            if (!pid) {
                return redirectToFirstBoundary();
            }
        }
    }, [props.types]);

    useEffect(() => {
        setIsLoading(true);
        if (!pid) {
            return redirectToFirstBoundary();
        }
        if (filteredBoundaries().findById(pid)) {
            return fetchBoundary(id, pid);
        }
    }, [boundaries]);

    useEffect(() => {
        if (pid !== prevPid) {
            setSelectedBoundary(null);
            if (filteredBoundaries().findById(pid)) {
                setIsLoading(true);
                return fetchBoundary(id, pid);
            }
            return redirectToFirstBoundary();
        }
    }, [pid]);

    const redirectToFirstBoundary = () => {
        if (filteredBoundaries().length > 0) {
            const bid = filteredBoundaries().first.id;
            return history.push(`${baseUrl}/${id}/${property}/!/${bid}`);
        }
        if (pid) {
            setIsLoading(false);
            return history.push(`${baseUrl}/${id}/${property}`);
        }
        setIsLoading(false);
    };

    const fetchBoundary = (modelId: string, boundaryId: string) => {
        fetchUrl(`modflowmodels/${modelId}/boundaries/${boundaryId}`,
            (cBoundary: IBoundary) => {
                setIsLoading(false);
                setSelectedBoundary(cBoundary);
            },
            (e) => dispatch(addMessage(messageError('boundaries', e)))
        );
    };

    const handleChangeBoundary = (cBoundary: Boundary) => {
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty('boundaries')));
        }
        return setSelectedBoundary(cBoundary.toObject());
    };

    const handleBoundaryClick = (bid: string) => {
        history.push(`${baseUrl}/${id}/${property}/!/${bid}`);
    };

    const handleAdd = (bType: BoundaryType) => {
        if (BoundaryFactory.availableTypes.indexOf(bType) >= 0) {
            history.push(`${baseUrl}/${id}/${property}/${bType}`);
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
                            const cBoundaries = boundaryCollection;
                            cBoundaries.addBoundary(clonedBoundary);
                            dispatch(updateBoundaries(cBoundaries));
                            dispatch(handleBoundaryClick(clonedBoundary.id));
                        },
                        (e) => dispatch(addMessage(messageError('boundaries', e)))
                    );
                }
            },
            (e) => dispatch(addMessage(messageError('boundaries', e)))
        );
    };

    const handleRemove = (boundaryId: string) => {
        return sendCommand(ModflowModelCommand.removeBoundary(model.id, boundaryId),
            () => {
                const cBoundaries = boundaryCollection.removeById(boundaryId);
                dispatch(updateBoundaries(cBoundaries));
                return redirectToFirstBoundary();
            },
            (e) => dispatch(addMessage(messageError('boundaries', e)))
        );
    };

    const handleUpdate = () => {
        if (!boundaryRef.current || !editingState.current.dirty) {
            return;
        }
        const message = messageSaving('boundaries');
        dispatch(addMessage(message));
        const cBoundary = BoundaryFactory.fromObject(boundaryRef.current);
        return sendCommand(ModflowModelCommand.updateBoundary(model.id, cBoundary),
            () => {
                if (editingState.current.dirty) {
                    dispatch(removeMessage(editingState.current.dirty));
                }
                if (cBoundary) {
                    const cBoundaries = boundaryCollection;
                    cBoundaries.update(cBoundary);
                    dispatch(updateBoundaries(cBoundaries));
                }
                dispatch(updateMessage({...message, state: EMessageState.SUCCESS}));
            },
            (e) => dispatch(addMessage(messageError('boundaries', e)))
        );
    };

    const handleChangeImport = (cBoundaries: BoundaryCollection) => {
        return dispatch(updateBoundaries(cBoundaries));
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
                                        buttonSave={!readOnly}
                                        buttonImport={readOnly ||
                                        <BoundaryImport
                                            model={model}
                                            soilmodel={soilmodel}
                                            boundaries={boundaryCollection}
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

export default boundaries;
