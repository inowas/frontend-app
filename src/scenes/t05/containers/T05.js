import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import AppContainer from "../../shared/AppContainer";
import {Button, Grid, Icon, Menu, Popup} from "semantic-ui-react";
import {includes} from "lodash";

import {defaultsT05} from '../defaults';

import MCDA from "../components/MCDA";
import CriteriaEditor from "../components/criteriaEditor";
import Ranking from "../components/weightAssignment/ranking";
import {deepMerge} from "../../shared/simpleTools/helpers";
import {fetchTool, sendCommand} from "../../../services/api";
import {createToolInstanceCommand, updateToolInstanceCommand} from "../../../services/commandFactory";

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t05-mar-mcda/',
    icon: <Icon name="file"/>
}];

const styles = {
    actionWrapper: {
        position: 'absolute',
        right: 10,
    },
    wrapper: {
        padding: '0 40px 0 40px',
        width: '1280px'
    },
    columnPadding: {
        padding: '12px'
    },
    columnContainer: {
        background: '#fff',
        boxShadow: '0 1px 2px 0 rgba(34, 36, 38, 0.15)',
        border: '1px solid rgba(34, 36, 38, 0.15)',
        borderRadius: '.28571429rem',
        height: '100%',
    },
    menu: {
        width: '100%'
    },
    grid: {
        marginTop: '25px'
    }
};

class T05 extends React.Component {
    constructor() {
        super();

        this.state = {
            tool: defaultsT05(),
            isLoading: false,
            selectedTool: 'criteria'
        };
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.setState({isLoading: true});
            fetchTool(
                this.state.tool.type,
                this.props.match.params.id,
                tool => this.setState({
                    tool: deepMerge(this.state.tool, tool),
                    isLoading: false
                }),
                error => this.setState({error, isLoading: false})
            );
        }
    }

    buildPayload = (tool) => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        public: tool.public,
        type: tool.type,
        data: {
            mcda: MCDA.fromObject(this.state.tool.data.mcda).toObject
        }
    });

    handleClickNavigation = (e, {name}) => this.setState({
        selectedTool: name
    });

    save = () => {
        const {id} = this.props.match.params;
        const {tool} = this.state;

        if (id) {
            sendCommand(
                updateToolInstanceCommand(this.buildPayload(tool)),
                () => this.setState({dirty: false}),
                () => this.setState({error: true})
            );
            return;
        }

        sendCommand(
            createToolInstanceCommand(this.buildPayload(tool)),
            () => this.props.history.push(`${this.props.location.pathname}/${tool.id}`),
            () => this.setState({error: true})
        );
    };

    onChange = ({name, value}) => {
        this.setState({
            tool: {
                ...this.state.tool,
                data: {
                    ...this.state.tool.data,
                    mcda: {
                        ...this.state.tool.data.mcda,
                        [name]: value
                    }
                }
            }
        }, console.log('onChange', this.state))
    };

    update = () => {

    };

    render() {
        const {mcda} = this.state.tool.data;
        const {tool, isLoading, selectedTool} = this.state;

        if (isLoading) {
            return (
                <AppContainer navBarItems={navigation} loader/>
            );
        }

        const {permissions} = tool;
        const readOnly = !includes(permissions, 'w');

        let component;

        switch (selectedTool) {
            case 'criteria':
                component = <CriteriaEditor readOnly={readOnly} mcda={MCDA.fromObject(mcda)}
                                            handleChange={this.onChange}/>;
                break;
            case 'wa':
                component = <Ranking readOnly={readOnly} mcda={MCDA.fromObject(mcda)}/>;
                break;
            default:
                component = <div/>;
                break;
        }

        return (
            <AppContainer navbarItems={navigation}>
                <Grid>
                    <Grid.Column width={3}>
                        <Menu vertical style={styles.menu}>
                            <Menu.Item header>Navigation</Menu.Item>
                            <Menu.Item
                                active={selectedTool === 'criteria'}
                                name='criteria'
                                onClick={this.handleClickNavigation}>
                                {mcda.criteria.length > 0 &&
                                <Icon name='check circle' color='green'/>
                                }
                                Criteria
                            </Menu.Item>
                            <Menu.Item
                                active={selectedTool === 'wa'}
                                disabled={mcda.criteria.length < 2}
                                name='wa'
                                onClick={this.handleClickNavigation}>
                                {mcda.criteria.length < 2 &&
                                <Popup
                                    trigger={<Icon name='exclamation circle'/>}
                                    content='At least two criteria are needed for weight assignment.'
                                />
                                }
                                Weight Assignment
                                {selectedTool === 'wa' &&
                                <Menu.Menu>
                                    <Menu.Item>
                                        Method 1: Ranking
                                    </Menu.Item>
                                    <Menu.Item>
                                        Method 2: Multi-influence
                                    </Menu.Item>
                                    <Menu.Item>
                                        Method 3: Pairwise
                                    </Menu.Item>
                                    <Menu.Item>
                                        Method 4: Analytical hierarchy
                                    </Menu.Item>
                                    <Menu.Item>
                                        Results
                                    </Menu.Item>
                                </Menu.Menu>
                                }
                            </Menu.Item>
                            <Menu.Item>
                                Raster Editor
                            </Menu.Item>
                            <Menu.Item disabled><Icon name='exclamation circle'/> Suitability</Menu.Item>
                            <Menu.Item disabled><Icon name='exclamation circle'/> Results</Menu.Item>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <Button positive fluid onClick={this.save}>Save</Button>
                        {component}
                    </Grid.Column>
                </Grid>
            </AppContainer>
        );
    }
}

T05.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(T05);