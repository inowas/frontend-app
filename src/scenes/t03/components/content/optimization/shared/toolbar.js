import {Button, Dropdown, Grid, Icon, Message, Transition} from 'semantic-ui-react';
import {OPTIMIZATION_EDIT_SAVED, OPTIMIZATION_EDIT_UNSAVED} from '../../../../defaults/optimization';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {
    thinMessage: {
        paddingTop: '6.929px',
        paddingBottom: '6.929px',
        fontSize: '1rem',
        textAlign: 'center'
    }
};

class OptimizationToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editState: props.editState
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            editState: nextProps.editState
        });
    }

    render() {
        return (
            <Grid>
                <Grid.Row columns={3}>
                    <Grid.Column>
                        {this.props.back &&
                        <Button icon
                                onClick={this.props.back.onClick}
                                labelPosition="left">
                            <Icon name="left arrow"/>
                            Back
                        </Button>
                        }
                    </Grid.Column>
                    <Grid.Column>
                        {this.state.editState === OPTIMIZATION_EDIT_UNSAVED &&
                        <Message warning style={styles.thinMessage}>Changes not saved!</Message>
                        }
                        <Transition visible={this.state.editState === OPTIMIZATION_EDIT_SAVED} animation="drop"
                                    duration={500}>
                            <Message positive style={styles.thinMessage}>Changes saved!</Message>
                        </Transition>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        {this.props.dropdown &&
                        <Dropdown
                            button floating labeled
                            direction="left"
                            name="type"
                            className="icon"
                            text={this.props.dropdown.text}
                            icon={this.props.dropdown.icon}
                            options={this.props.dropdown.options}
                            onChange={this.props.dropdown.onChange}
                        />
                        }
                        {this.props.save &&
                        <Button icon positive
                                onClick={this.props.save.onClick}
                                labelPosition="left">
                            <Icon name="save"/>
                            Save
                        </Button>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

OptimizationToolbar.propTypes = {
    back: PropTypes.object,
    dropdown: PropTypes.object,
    save: PropTypes.object,
    editState: PropTypes.number
};

export default OptimizationToolbar;
