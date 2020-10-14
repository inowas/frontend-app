import React, {ChangeEvent, MouseEvent, useEffect, useState} from 'react';
import {Button, Form, Icon, Menu, MenuItemProps, Modal, Segment} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {Boundary, BoundaryCollection, BoundaryFactory} from '../../../../../core/model/modflow/boundaries';
import {IBoundary} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import Soilmodel from '../../../../../core/model/modflow/soilmodel/Soilmodel';
import BoundaryDiscretizationMap from '../../maps/boundaryDiscretizationMap';

interface IIndexedBoundary {
    [name: string]: any;
}

type ActiveItemType = 'geometry' | 'affected cells';

interface IProps {
    boundary: Boundary;
    boundaries: BoundaryCollection;
    model: ModflowModel;
    onCancel: () => any;
    onChange: (boundary: Boundary) => any;
    readOnly: boolean;
    soilmodel: Soilmodel;
}

function isActiveItemType(value: any): value is ActiveItemType {
    return true;
}

const BoundaryGeometryEditor = (props: IProps) => {
    const [activeItem, setActiveItem] = useState<string>('geometry');
    const [boundary, setBoundary] = useState<IBoundary>(props.boundary.toObject());
    const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(true);

    useEffect(() => {
        setBoundary(props.boundary.toObject());
    }, [props.boundary]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const b: IIndexedBoundary | null = BoundaryFactory.fromObject(boundary);
        if (b) {
            b[name] = value;
            setBoundary(b.toObject());
            setButtonsDisabled(false);
        }
    };

    const handleChangeBoundary = (b: Boundary) => {
        setBoundary(b.toObject());
        setButtonsDisabled(false);
        setActiveItem('affected cells');
        props.onChange(b);
    };

    const handleItemClick = (e: MouseEvent<HTMLAnchorElement, Event>, data: MenuItemProps) => {
        if (isActiveItemType(data.name)) {
            setActiveItem(data.name);
        }
    };

    const handleOnClickApply = () => {
        const b = BoundaryFactory.fromObject(boundary);
        if (b) {
            props.onChange(b);
        }
        return props.onCancel();
    };

    const {boundaries, model, onCancel, readOnly} = props;
    const iBoundary = BoundaryFactory.fromObject(boundary);

    if (!iBoundary) {
        return null;
    }

    return (
        <Modal size={'large'} open={true} onClose={onCancel} dimmer={'inverted'}>
            <Modal.Header>Edit boundary properties</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <input
                            placeholder="Boundary name"
                            name={'name'}
                            value={iBoundary.name}
                            onChange={handleChange}
                        />
                    </Form.Field>
                </Form>

                <Menu attached="top" tabular={true}>
                    <Menu.Item
                        name="geometry"
                        active={activeItem === 'geometry'}
                        onClick={handleItemClick}
                    >
                        <Icon name="location arrow"/>
                        Geometry
                    </Menu.Item>

                    <Menu.Item
                        name="affected cells"
                        active={activeItem === 'affected cells'}
                        onClick={handleItemClick}
                    >
                        <Icon name="table"/>
                        Affected cells
                    </Menu.Item>
                </Menu>

                <Segment attached="bottom">
                    {activeItem === 'geometry' && <BoundaryDiscretizationMap
                        model={model}
                        boundary={iBoundary}
                        boundaries={boundaries}
                        onChange={handleChangeBoundary}
                        readOnly={readOnly}
                        showBoundaryGeometry={true}
                        showActiveCells={false}
                        soilmodel={props.soilmodel}
                    />}
                    {activeItem === 'affected cells' && <BoundaryDiscretizationMap
                        model={model}
                        boundary={iBoundary}
                        boundaries={boundaries}
                        onChange={handleChangeBoundary}
                        readOnly={readOnly}
                        showBoundaryGeometry={true}
                        showActiveCells={true}
                        soilmodel={props.soilmodel}
                    />}
                </Segment>

            </Modal.Content>
            <Modal.Actions>
                <Button
                    negative={true}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    positive={true}
                    onClick={handleOnClickApply}
                    disabled={buttonsDisabled}
                >
                    Apply
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default BoundaryGeometryEditor;
