import PropTypes from 'prop-types';
import React from 'react';

import {includes} from 'lodash';
import {withRouter} from 'react-router-dom';

import {AppContainer} from '../../shared';
import {Background, ChartT13E as Chart, InfoT13E as Info, Parameters} from '../components';
import {SliderParameter, ToolGrid, ToolMetaData} from '../../shared/simpleTools';
import {navigation} from './T13';

import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';

import {defaultsWithSession} from '../defaults/T13E';
import image from '../images/T13E.png';

import {buildPayloadToolInstance, deepMerge} from '../../shared/simpleTools/helpers';
import {fetchTool, sendCommand} from '../../../services/api';
import withSession from '../../../services/router/withSession';

class T13E extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tool: defaultsWithSession(props.session),
            isDirty: true,
            isLoading: false,
            error: false
        };
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.setState({isLoading: true});
            fetchTool(
                this.state.tool.tool,
                this.props.match.params.id,
                tool => this.setState({
                    tool: deepMerge(this.state.tool, tool),
                    isDirty: false,
                    isLoading: false
                }),
                error => this.setState({error, isLoading: false})
            );
        }
    }

    save = (tool) => {
        const {id} = this.props.match.params;

        const t = {
            ...this.state.tool, name: tool.name, description: tool.description, public: tool.public
        };

        if (id) {
            sendCommand(
                SimpleToolsCommand.updateToolInstance(buildPayloadToolInstance(t)),
                () => this.setState({isDirty: false}),
                () => this.setState({error: true})
            );
            return;
        }

        sendCommand(
            SimpleToolsCommand.createToolInstance(buildPayloadToolInstance(tool)),
            () => this.props.history.push(`${this.props.location.pathname}/${t.id}`),
            () => this.setState({error: true})
        );
    };

    handleChangeParameters = (parameters) => {
        this.setState(prevState => {
            return {
                ...prevState,
                tool: {
                    ...prevState.tool,
                    data: {
                        ...prevState.tool.data,
                        parameters: parameters.map(p => p.toObject)
                    }
                },
                isDirty: true
            };
        });
    };

    handleReset = () => {
        this.setState(prevState => {
            return {
                tool: {...prevState.tool, data: defaultsWithSession(this.props.session).data},
                isLoading: false,
                isDirty: true
            }
        });
    };

    update = (tool) => this.setState({tool});

    render() {
        if (this.state.isLoading) {
            return (
                <AppContainer navbarItems={navigation} loader>Loading</AppContainer>
            );
        }

        const {isDirty, tool} = this.state;
        const {data, permissions} = tool;
        const {parameters, settings} = data;
        const readOnly = !includes(permissions, 'w');

        return (
            <AppContainer navbarItems={navigation}>
                <ToolMetaData
                    tool={tool}
                    readOnly={readOnly}
                    onSave={this.save}
                    saveButton={true}
                    onReset={this.handleReset}
                    isDirty={isDirty}
                />
                <ToolGrid rows={2}>
                    <Background
                        image={image}
                        title={'T13E. Aquifer system with one pumping well at constant rate, no groundwater recharge'}
                    />
                    <Chart parameters={parameters} settings={settings}/>
                    <Info parameters={parameters} settings={settings}/>
                    <Parameters
                        parameters={parameters.map(p => SliderParameter.fromObject(p))}
                        handleChange={this.handleChangeParameters}
                        handleReset={this.handleReset}
                    />
                </ToolGrid>
            </AppContainer>
        );
    }
}

T13E.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
};

export default withSession(withRouter(T13E));
