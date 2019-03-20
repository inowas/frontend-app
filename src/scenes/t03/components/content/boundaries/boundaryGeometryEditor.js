import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Modal, Segment, Menu, Icon} from 'semantic-ui-react';
import {Boundary, BoundaryCollection, BoundaryFactory, ModflowModel} from 'core/model/modflow';
import BoundaryDiscretizationMap from '../../maps/boundaryDiscretizationMap';

class BoundaryGeometryEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'geometry',
            boundary: props.boundary.toObject()
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({boundary: nextProps.boundary.toObject()})
    }

    handleChange = (e) => {
        const target = e.target;
        const {name, value} = target;
        const boundary = BoundaryFactory.fromObject(this.state.boundary);
        boundary[name] = value;
        this.setState({boundary: boundary.toObject()})
    };

    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    render() {
        const {boundaries, model, onCancel, onChange, readOnly} = this.props;
        const {activeItem} = this.state;
        const boundary = BoundaryFactory.fromObject(this.state.boundary);

        return (
            <Modal size={'large'} open onClose={onCancel} dimmer={'inverted'}>
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

                    <Menu attached="top" tabular>
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
                            onChange={onChange}
                            readOnly={readOnly}
                            showBoundaryGeometry={true}
                            showActiveCells={false}
                        />}
                        {activeItem === 'affected cells' && <BoundaryDiscretizationMap
                            model={model}
                            boundary={boundary}
                            boundaries={boundaries}
                            onChange={onChange}
                            readOnly={readOnly}
                            showBoundaryGeometry={true}
                            showActiveCells={true}
                        />}
                    </Segment>

                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={onCancel}>Cancel</Button>
                    <Button positive onClick={() => {
                        onChange(boundary);
                        onCancel();
                    }}>Apply</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

BoundaryGeometryEditor.propTypes = {
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
};

export default BoundaryGeometryEditor;
