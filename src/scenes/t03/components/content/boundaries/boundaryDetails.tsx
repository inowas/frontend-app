import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {Button, Dropdown, DropdownProps, Form, Header, InputOnChangeData, List, Popup} from 'semantic-ui-react';
import uuid from 'uuid';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {Boundary, BoundaryCollection, LineBoundary} from '../../../../../core/model/modflow/boundaries';
import {RechargeBoundary, WellBoundary} from '../../../../../core/model/modflow/boundaries';
import EvapotranspirationBoundary from '../../../../../core/model/modflow/boundaries/EvapotranspirationBoundary';
import NoContent from '../../../../shared/complexTools/noContent';
import BoundaryMap from '../../maps/boundaryMap';
import BoundaryGeometryEditor from './boundaryGeometryEditor';
import BoundaryValuesDataTable from './boundaryValuesDataTable';
import ObservationPointEditor from './observationPointEditor';

interface IProps {
    boundary: Boundary;
    boundaries: BoundaryCollection;
    model: ModflowModel;
    soilmodel: Soilmodel;
    onChange: (boundary: Boundary) => any;
    onClick: (bid: string) => any;
    readOnly: boolean;
}

const boundaryDetails = (props: IProps) => {
    const [showBoundaryEditor, setShowBoundaryEditor] = useState<boolean>(false);
    const [showObservationPointEditor, setShowObservationPointEditor] = useState<boolean>(false);
    const [observationPointId, setObservationPointId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!props.boundary) {
            return;
        }

        if (props.boundary instanceof LineBoundary) {
            if (null === observationPointId) {
                return setObservationPointId(props.boundary.observationPoints[0].id);
            }

            try {
                props.boundary.findObservationPointById(observationPointId || '');
            } catch (err) {
                return setObservationPointId(props.boundary.observationPoints[0].id);
            }
        }
    }, [props.boundary]);

    const handleChange = (e: SyntheticEvent<HTMLElement, Event> | ChangeEvent<HTMLInputElement>,
                          data: DropdownProps | InputOnChangeData) => {
        let value = data.value;
        const name = data.name;
        if (name === 'layers' && data.value !== null && typeof data.value === 'number') {
            value = [data.value];
        }
        const cBoundary = props.boundary;
        // @ts-ignore
        cBoundary[name] = value;
        return props.onChange(cBoundary);
    };

    const handleCloneClick = () => {
        if (props.boundary instanceof LineBoundary && observationPointId) {
            const cBoundary = props.boundary;
            const newOpId = uuid.v4();
            cBoundary.cloneObservationPoint(observationPointId, newOpId);
            setObservationPointId(newOpId);
            setShowObservationPointEditor(true);
            return props.onChange(cBoundary);
        }
    };

    const handleRemoveClick = () => {
        if (props.boundary instanceof LineBoundary && observationPointId) {
            const cBoundary = props.boundary;
            cBoundary.removeObservationPoint(observationPointId);
            setObservationPointId(cBoundary.observationPoints[0].id);
            return props.onChange(cBoundary);
        }
    };

    const layerOptions = () => {
        if (!(props.soilmodel)) {
            return [];
        }

        return props.soilmodel.layersCollection.all.map((l, idx) => (
            {key: l.id, value: idx, text: l.name}
        ));
    };

    const renderLayerSelection = () => {
        const cBoundary = props.boundary;
        const multipleLayers = ['chd', 'ghb'].includes(cBoundary.type);

        let options = {enabled: false, label: '', name: ''};

        switch (cBoundary.type) {
            case 'rch':
                options = {enabled: true, label: 'Recharge option', name: 'nrchop'};
                break;
            case 'evt':
                options = {enabled: true, label: 'Evapotranspiration option', name: 'nevtop'};
                break;
            default:
                options = {enabled: false, label: '', name: ''};
                break;
        }

        if (!cBoundary.layers || ['riv'].includes(cBoundary.type)) {
            return null;
        }

        return (
            <React.Fragment>
                {(boundary instanceof RechargeBoundary || boundary instanceof EvapotranspirationBoundary) &&
                <Form.Dropdown
                    label={boundary.type === 'rch' ? 'Recharge option' : 'Evapotranspiration option'}
                    style={{zIndex: 1000}}
                    selection={!props.readOnly}
                    options={[
                        {key: 0, value: 1, text: '1: Top grid layer'},
                        {key: 1, value: 2, text: '2: Specified layer'},
                        {key: 2, value: 3, text: '3: Highest active cell'}
                    ]}
                    value={boundary.optionCode}
                    name={'optionCode'}
                    onChange={handleChange}
                    disabled={props.readOnly}
                />
                }
                <Form.Dropdown
                    disabled={props.readOnly || (boundary instanceof RechargeBoundary ||
                        boundary instanceof EvapotranspirationBoundary) && boundary.optionCode !== 2}
                    loading={!(props.soilmodel)}
                    label={multipleLayers ? 'Selected layers' : 'Selected layer'}
                    style={{zIndex: 1000}}
                    multiple={multipleLayers}
                    selection={!props.readOnly}
                    options={layerOptions()}
                    value={multipleLayers ? boundary.layers : boundary.layers[0]}
                    name={'layers'}
                    onChange={handleChange}
                />
            </React.Fragment>
        );
    };

    const handleCancelGeometryEditor = () => setShowBoundaryEditor(false);
    const handleCancelObservationPointEditor = () => setShowObservationPointEditor(false);
    const handleClickBoundary = (id: string) => props.onClick(id);
    const handleClickShowBoundaryEditor = () => setShowBoundaryEditor(true);
    const handleClickObservationPoint = (id: string) => setObservationPointId(id);
    const handleEditPoint = () => setShowObservationPointEditor(true);
    const handleSelectObservationPoint = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        if (data.value && typeof data.value === 'string') {
            return setObservationPointId(data.value);
        }
    };

    const {boundary, boundaries, model} = props;
    const {geometry, stressperiods} = model;

    if (!boundary || !geometry) {
        return <NoContent message={'No objects.'}/>;
    }

    if (!boundary.layers || boundary.layers.length === 0) {
        return <NoContent message={'No layers.'}/>;
    }

    return (
        <div>
            <Form style={{marginTop: '1rem'}}>
                <Form.Group widths="equal">
                    <Form.Input
                        value={boundary.type.toUpperCase()}
                        label="Type"
                        readOnly={true}
                        width={5}
                    />

                    <Form.Input
                        label={'Name'}
                        name={'name'}
                        value={boundary.name}
                        onChange={handleChange}
                        readOnly={props.readOnly}
                    />

                    {renderLayerSelection()}

                    {boundary.type === 'wel' && boundary instanceof WellBoundary &&
                    <Form.Dropdown
                        label={'Well type'}
                        style={{zIndex: 1000}}
                        selection={true}
                        options={WellBoundary.wellTypes.types.map((t) => (
                            {key: t.value, value: t.value, text: t.name}
                        ))}
                        value={boundary.wellType}
                        name={'wellType'}
                        onChange={handleChange}
                        disabled={props.readOnly}
                    />
                    }
                </Form.Group>
            </Form>

            {!props.readOnly &&
            <List horizontal={true}>
                <List.Item
                    as="a"
                    onClick={handleClickShowBoundaryEditor}
                >
                    Edit boundary on map
                </List.Item>
            </List>
            }
            <BoundaryMap
                geometry={geometry}
                boundary={boundary}
                boundaries={boundaries}
                selectedObservationPointId={observationPointId}
                onClick={handleClickBoundary}
                onClickObservationPoint={handleClickObservationPoint}
            />
            {(boundary instanceof LineBoundary) &&
            <div>
                <Button as={'div'} labelPosition={'left'} fluid={true}>
                    <Popup
                        trigger={
                            <Dropdown
                                fluid={true}
                                selection={true}
                                value={observationPointId}
                                options={boundary.observationPoints.map((op) => (
                                    {key: op.id, value: op.id, text: op.name})
                                )}
                                onChange={handleSelectObservationPoint}
                            />
                        }
                        size="mini"
                        content="Select Observation Point"
                    />
                    <Popup
                        trigger={
                            <Button
                                icon={'edit'}
                                onClick={handleEditPoint}
                                disabled={props.readOnly}
                            />
                        }
                        size="mini"
                        content="Edit point"
                    />
                    <Popup
                        trigger={
                            <Button
                                icon={'clone'}
                                onClick={handleCloneClick}
                                disabled={props.readOnly}
                            />
                        }
                        size="mini"
                        content="Clone point"
                    />
                    {boundary instanceof LineBoundary &&
                    <Popup
                        trigger={
                            <Button
                                icon="trash"
                                onClick={handleRemoveClick}
                                disabled={props.readOnly || boundary.observationPoints.length === 1}
                            />
                        }
                        size="mini"
                        content="Delete point"
                    />
                    }
                </Button>
            </div>
            }
            <Header as={'h4'}>Time dependent boundary values at observation point</Header>
            <BoundaryValuesDataTable
                boundary={boundary}
                onChange={props.onChange}
                readOnly={props.readOnly}
                selectedOP={observationPointId}
                stressperiods={stressperiods}
            />

            {showBoundaryEditor &&
            <BoundaryGeometryEditor
                boundary={boundary}
                boundaries={boundaries}
                model={model}
                onCancel={handleCancelGeometryEditor}
                onChange={props.onChange}
                readOnly={props.readOnly}
            />
            }
            {(showObservationPointEditor && boundary instanceof LineBoundary) &&
            <ObservationPointEditor
                boundary={boundary}
                model={model}
                observationPointId={observationPointId}
                onCancel={handleCancelObservationPointEditor}
                onChange={props.onChange}
                readOnly={props.readOnly}
            />
            }
        </div>
    );
};

export default boundaryDetails;
