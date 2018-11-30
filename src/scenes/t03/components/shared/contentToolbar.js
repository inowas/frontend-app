import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dropdown, Grid, Icon, Message} from 'semantic-ui-react';
import {pure} from 'recompose';

const styles = {
    thinMessage: {
        paddingTop: '6.929px',
        paddingBottom: '6.929px',
        fontSize: '1rem',
        textAlign: 'center'
    }
};

const getMessageFromState = (state) => {
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

const ContentToolBar = ({back, dropdown, message, save, state}) => {

    if (state) {
        message = getMessageFromState(state);
    }

    return (
        <Grid>
            <Grid.Row columns={3}>
                <Grid.Column>
                    {back &&
                    <Button icon onClick={back.onClick} labelPosition="left">
                        <Icon name="left arrow"/>
                        Back
                    </Button>
                    }
                </Grid.Column>
                <Grid.Column>
                    {message && <Message
                        positive={message.positive || false}
                        warning={message.warning || false}
                        style={styles.thinMessage}
                    >
                        {message.content}
                    </Message>
                    }
                </Grid.Column>
                <Grid.Column textAlign="right">
                    {dropdown &&
                    <Dropdown
                        button floating labeled
                        direction="left"
                        name="type"
                        className="icon"
                        text={dropdown.text}
                        icon={dropdown.icon}
                        options={dropdown.options}
                        onChange={dropdown.onChange}
                    />
                    }
                    {save &&
                    <Button icon positive onClick={save.onClick} labelPosition="left">
                        <Icon name="save"/>
                        Save
                    </Button>
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};

ContentToolBar.propTypes = {
    message: PropTypes.object,
    back: PropTypes.object,
    dropdown: PropTypes.object,
    save: PropTypes.object,
    state: PropTypes.string
};

export default pure(ContentToolBar);
