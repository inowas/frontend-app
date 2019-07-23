import React, {ChangeEvent, MouseEvent} from 'react';
import {Button, Form, Icon, Menu, MenuItemProps, Modal, Segment} from 'semantic-ui-react';
import {Boundary, BoundaryCollection, BoundaryFactory, ModflowModel} from '../../../../../core/model/modflow';
import {BoundaryInstance} from '../../../../../core/model/modflow/boundaries/types';
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
}

interface IState {
    activeItem: ActiveItemType;
    boundary: BoundaryInstance;
    buttonsDisabled: boolean;
}

function isActiveItemType(value: any): value is ActiveItemType {
    return true;
}

class BoundaryGeometryEditor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            activeItem: 'geometry',
            boundary: props.boundary.toObject(),
            buttonsDisabled: true
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({boundary: nextProps.boundary.toObject()});
    }

    public handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const boundary: IIndexedBoundary | null = BoundaryFactory.fromObject(this.state.boundary);
        if (boundary) {
            boundary[name] = value;
            this.setState({
                boundary: boundary.toObject(),
                buttonsDisabled: false
            });
        }
    };

    public onChangeGeometry = (boundary: Boundary) => {
        this.setState({
            boundary: boundary.toObject(),
            buttonsDisabled: false
        }, () => this.props.onChange(boundary));
    };

    public handleItemClick = (e: MouseEvent<HTMLAnchorElement, Event>, data: MenuItemProps) => {
        if (isActiveItemType(data.name)) {
            return this.setState({
                activeItem: data.name
            });
        }
    };

    public render() {
        const {boundaries, model, onCancel, readOnly} = this.props;
        const {activeItem, buttonsDisabled} = this.state;
        const boundary = BoundaryFactory.fromObject(this.state.boundary);

        if (!boundary) {
            return;
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
                                value={boundary.name}
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                    </Form>

                    <Menu attached="top" tabular={true}>
                        <Menu.Item
                            name="geometry"
                            active={activeItem === 'geometry'}
                            onClick={this.handleItemClick}
                        >
                            <Icon name="location arrow"/>
                            Geometry
                        </Menu.Item>

                        <Menu.Item
                            name="affected cells"
                            active={activeItem === 'affected cells'}
                            onClick={this.handleItemClick}
                        >
                            <Icon name="table"/>
                            Affected cells
                        </Menu.Item>
                    </Menu>

                    <Segment attached="bottom">
                        {activeItem === 'geometry' && <BoundaryDiscretizationMap
                            model={model}
                            boundary={boundary}
                            boundaries={boundaries}
                            onChange={this.onChangeGeometry}
                            readOnly={readOnly}
                            showBoundaryGeometry={true}
                            showActiveCells={false}
                        />}
                        {activeItem === 'affected cells' && <BoundaryDiscretizationMap
                            model={model}
                            boundary={boundary}
                            boundaries={boundaries}
                            onChange={this.onChangeGeometry}
                            readOnly={readOnly}
                            showBoundaryGeometry={true}
                            showActiveCells={true}
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
                        onClick={this.handleOnClickApply}
                        disabled={buttonsDisabled}
                    >
                        Apply
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    private handleOnClickApply = () => {
        const boundary = BoundaryFactory.fromObject(this.state.boundary);
        if (boundary) {
            this.props.onChange(boundary);
        }
        return this.props.onCancel();
    };
}

export default BoundaryGeometryEditor;
