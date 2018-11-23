import React from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Form, Grid, Segment} from 'semantic-ui-react';


class General extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            dirty: false
        }
    }

    handleInputChange = (e, {value, name, checked}) => {
        this.setState({
            data: {...this.state.data, [name]: value || checked},
            dirty: true
        });
    };

    handleSave = () => {

        this.props.update(this.state);
    };

    render() {
        const {readOnly} = this.props;
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Segment color={'grey'}>
                            <Form color={'grey'}>
                                <Form.Group>
                                    <Form.Input
                                        label='Name'
                                        name={'name'}
                                        value={this.state.data.name}
                                        width={7}
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.TextArea
                                        label="Description"
                                        disabled={readOnly}
                                        name="description"
                                        onChange={this.handleInputChange}
                                        placeholder="Description"
                                        value={this.state.data.description}
                                        width={8}
                                    />
                                    <Form.Field width={1}>
                                        <label>Public</label>
                                        <Checkbox
                                            toggle
                                            checked={this.state.data.public}
                                            onChange={this.handleInputChange}
                                            name={'public'}
                                        />
                                    </Form.Field>
                                </Form.Group>
                            </Form>
                            <Button
                                type='submit'
                                onClick={this.handleSave}
                                disabled={!this.state.dirty}
                            >
                                Save
                            </Button>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

General.proptypes = {
    data: PropTypes.object.isRequired,
    readOnly: PropTypes.bool.isRequired,
    update: PropTypes.func.isRequired,
};


export default General;
