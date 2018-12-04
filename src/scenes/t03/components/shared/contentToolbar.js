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
            message: null
        }
    };

    componentDidMount() {
        if (this.state.visible) {
            this.toggleVisibility();
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.state) {
            this.setState({
                message: this.getMessageFromState(nextProps.state),
                visible: true
            }, () => setTimeout(function () {
                if (this.state.message && this.state.message.positive) {
                    this.setState({visible: false})
                }
            }.bind(this), 1000))
        }
    }

    getMessageFromState = (state) => {
        switch (state) {
            case 'notSaved':
                return {
                    content: 'Changes not saved!',
                    warning: true
                };
            case 'saved':
                return {
                    content: 'Changes saved!',
                    positive: true
                };
            default:
                return null
        }
    };

    toggleVisibility = () => (
        this.setState({visible: !this.state.visible})
    );

    render() {
        const {message} = this.state;
        return (
            <Grid>
                <Grid.Row columns={3}>
                    <Grid.Column>
                        {this.props.back &&
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
                        {this.props.save &&
                        <Button icon positive onClick={this.props.onSave} labelPosition="left">
                            <Icon name="save"/>
                            Save
                        </Button>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

ContentToolBar.propTypes = {
    back: PropTypes.object,
    dropdown: PropTypes.object,
    message: PropTypes.object,
    onSave: PropTypes.func,
    save: PropTypes.bool,
    state: PropTypes.string
};

export default ContentToolBar;
