import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dropdown, Grid, Icon, Message, Transition} from 'semantic-ui-react';

const styles = {
    thinMessage: {
        paddingTop: '6.929px',
        paddingBottom: '6.929px',
        fontSize: '1rem',
        textAlign: 'center'
    },
    thinMessageIcon: {
        display: 'inline-block',
        fontSize: '1em'
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

        const isValid = typeof this.props.isValid === 'boolean' ? this.props.isValid : true;
        const hasBeenSaved = this.props.isDirty === true && nextProps.isDirty === false;
        const error = nextProps.isError;
        const notSaved = nextProps.isDirty;

        let state = 'default';
        if (hasBeenSaved) {state = 'hasBeenSaved'}
        if (hasBeenSaved) {state = 'hasBeenSaved'}
        if (error) {state = 'error'}
        if (notSaved) {state = 'notSaved'}
        if (!isValid) {state = 'notValid'}

        let message = this.getMessage(state);

        if (!this.props.saveButton && nextProps.isDirty) {
            message = null;
        }

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
            case 'notValid': {
                return null;
            }
            case 'notSaved': {
                return {
                    content: 'Changes not saved!',
                    warning: true,
                    icon: <Icon name="exclamation triangle" style={styles.thinMessageIcon}/>
                };
            }
            case 'error': {
                return {
                    content: 'Error saving changes!',
                    warning: true,
                    icon: <Icon name="exclamation triangle" style={styles.thinMessageIcon}/>
                };
            }

            case 'hasBeenSaved': {
                return {
                    content: 'Changes saved!',
                    positive: true,
                    icon: <Icon name="check circle" style={styles.thinMessageIcon}/>
                };
            }
            default:
                return null;

        }
    };

    render() {
        const saveButton = typeof this.props.saveButton === 'boolean' ? this.props.saveButton : true;
        const isValid = typeof this.props.isValid === 'boolean' ? this.props.isValid : true;
        const message = this.state.message;
        const {isDirty} = this.props;

        const canBeSaved = isDirty && isValid;

        return (
            <Grid>
                <Grid.Row columns={3}>
                    <Grid.Column>
                        {this.props.backButton &&
                        <Button icon onClick={() => this.props.onBack()} labelPosition="left">
                            <Icon name="left arrow"/>
                            Back
                        </Button>
                        }
                    </Grid.Column>
                    <Grid.Column>
                        {message &&
                        <Transition duration={{hide: this.state.hide}} visible={this.state.visible}>
                            <Message icon
                                positive={message.positive || false}
                                warning={message.warning || false}
                                style={styles.thinMessage}
                            >
                                {message.icon}
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
                        <Button icon positive onClick={this.props.onSave} labelPosition="left" disabled={!canBeSaved}>
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
    backButton: PropTypes.bool,
    onBack: PropTypes.func,
    saveButton: PropTypes.bool,
    onSave: PropTypes.func,
    dropdown: PropTypes.object,
    message: PropTypes.object,
    isDirty: PropTypes.bool,
    isError: PropTypes.bool,
    isValid: PropTypes.bool
};

export default ContentToolBar;
