import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import AppContainer from "../../shared/AppContainer";
import {Grid, Icon, Menu, Popup} from "semantic-ui-react";
import uuidv4 from "uuid";
import {includes} from "lodash";

import MCDA from "../components/MCDA";
import CriteriaEditor from "../components/criteriaEditor";
import Ranking from "../components/weightAssignment/ranking";

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
            tool: {
                id: uuidv4(),
                name: 'New MCDA',
                description: 'MCDA Description',
                permissions: 'rwx',
                public: false,
                type: 'T05',
                data: {
                    criteria: []
                }
            },
            mcda: (new MCDA()).toObject,
            isLoading: false,
            selectedTool: 'criteria'
        };
    }

    handleClickNavigation = (e, {name}) => this.setState({
        selectedTool: name
    });

    save = ({name, value}) => {
        this.setState({
            mcda: {
                ...this.state.mcda,
                [name]: value
            }
        })
    };

    update = () => {

    };

    render() {
        const {mcda, tool, isLoading, selectedTool} = this.state;
        if (isLoading) {
            return (
                <AppContainer navBarItems={navigation} loader/>
            );
        }

        const {data, permissions} = tool;
        const readOnly = !includes(permissions, 'w');

        let component;

        switch (selectedTool) {
            case 'criteria':
                component = <CriteriaEditor readOnly={readOnly} mcda={MCDA.fromObject(this.state.mcda)}
                                            handleChange={this.save}/>;
                break;
            case 'wa':
                component = <Ranking readOnly={readOnly} mcda={MCDA.fromObject(this.state.mcda)}/>;
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