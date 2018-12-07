import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dropdown, Grid, Icon, Message, Transition} from 'semantic-ui-react';

const styles = {
    thinMessage: {
        paddingTop: '6.929px',
        paddingBottom: '6.929px',
        fontSize: '1rem',
        textAlign: 'center'
    }
};

class ContentToolBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hide: 2500,
            visible: false,
            isDirty: false,
            isError: false,
            message: null
        }
    };

    componentWillReceiveProps(nextProps, nextContext) {

        const hasBeenSaved = this.props.isDirty === true && nextProps.isDirty === false;
        const error = nextProps.isError;
        const notSaved = nextProps.isDirty;

        let state = 'default';
        if (hasBeenSaved) {state = 'hasBeenSaved'}
        if (error) {state = 'error'}
        if (notSaved) {state = 'notSaved'}

        const message = this.getMessage(state);

        if (hasBeenSaved || error || notSaved) {
            this.setState({
                visible: true,
                message: message
            }, () => setTimeout(function () {
                if (this.state.message && this.state.message.positive) {
                    this.setState({visible: false})
                }
            }.bind(this), 1000))
        }
    }

    getMessage = (state) => {
        switch (state) {
            case 'notSaved': {
                return {
                    content: 'Changes not saved!',
                    warning: true
                };
            }
            case 'error': {
                return {
                    content: 'Error saving changes!',
                    warning: true
                };
            }

            case 'hasBeenSaved': {
                return {
                    content: 'Changes saved!',
                    positive: true
                };
            }
            default:
                return null;

        }
    };

    render() {
        const saveButton = this.props.saveButton || true;
        const message = this.state.message;
        const {isDirty} = this.props;

        return (
            <Grid>
                <Grid.Row columns={3}>
                    <Grid.Column>
                        {this.props.backButton &&
                        <Button icon onClick={this.props.back.onClick} labelPosition="left">
                            <Icon name="left arrow"/>
                            Back
                        </Button>
                        }
                    </Grid.Column>
                    <Grid.Column>
                        {message &&
                        <Transition duration={{hide: this.state.hide}} visible={this.state.visible}>
                            <Message
                                positive={message.positive || false}
                                warning={message.warning || false}
                                style={styles.thinMessage}
                            >
                                {message.content}
                            </Message>
                        </Transition>
                        }
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
                        {saveButton &&
                        <Button icon positive onClick={this.props.onSave} labelPosition="left" disabled={!isDirty}>
                            <Icon name="save"/>Save
                        </Button>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

ContentToolBar.propTypes = {
    backButton: PropTypes.object,
    dropdown: PropTypes.object,
    message: PropTypes.object,
    onSave: PropTypes.func,
    saveButton: PropTypes.bool,
    isDirty: PropTypes.bool,
    isError: PropTypes.bool
};

export default ContentToolBar;
