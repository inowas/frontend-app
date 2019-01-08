import React from 'react';
import PropTypes from 'prop-types';
import {Form, Grid, Message} from 'semantic-ui-react';
import {MCDA} from 'core/mcda';
import ConstraintsMap from './constraintsMap';
import {GridSize} from 'core/geometry';

class ConstraintsEditor extends React.Component {
    constructor(props) {
        super();

        this.state = {
            nX: 10,
            nY: 10
        }
    }

    onChangeState = (e, {name, value}) => this.setState({
        [name]: value
    });

    onChangeMap = e => {
        console.log('constraintsEditor@onChangeMap', e)
    };

    render() {
        const {mcda, readOnly} = this.props;
        const {nX, nY} = this.state;

        return (
            <div>
                <Message>
                    <Message.Header>Spatial Discretization</Message.Header>
                    <p>Set the outline of your project area and define the grid size.</p>
                </Message>
                <Grid>
                    <Grid.Column width={5}>
                        <Form>
                            <Form.Input
                                type='number'
                                label='Rows'
                                name='nY'
                                value={nY}
                                onChange={this.onChangeState}
                            />
                            <Form.Input
                                type='number'
                                label='Columns'
                                name='nX'
                                value={nX}
                                onChange={this.onChangeState}
                            />
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <ConstraintsMap
                            gridSize={GridSize.fromNxNy(nX, nY)}
                            onChange={this.onChangeMap}
                        />
                    </Grid.Column>
                </Grid>
            </div>
        );
    }

}

ConstraintsEditor.propTypes = {
    handleChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    readOnly: PropTypes.bool
};

export default ConstraintsEditor;