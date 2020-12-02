import {AppContainer} from '../../shared';
import {Background, ChartT13B as Chart, InfoT13B as Info, Parameters, SettingsT13B as Settings} from '../components';
import {SliderParameter, ToolGrid, ToolMetaData} from '../../shared/simpleTools';
import {buildPayloadToolInstance, deepMerge} from '../../shared/simpleTools/helpers';
import {defaultsWithSession} from '../defaults/T13B';
import {fetchTool, sendCommand} from '../../../services/api';
import {includes} from 'lodash';
import {navigation} from './T13';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import image from '../images/T13B.png';
import withSession from '../../../services/router/withSession';

class T13B extends React.Component {
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

    handleChangeSettings = (settings) => {
        this.setState(prevState => {
            return {
                ...prevState,
                tool: {
                    ...prevState.tool,
                    data: {
                        ...prevState.tool.data, settings
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
                <AppContainer navbarItems={navigation} loader/>
            );
        }

        const {isDirty, tool} = this.state;
        const {data, permissions} = tool;
        const {parameters, settings} = data;
        const readOnly = !includes(permissions, 'w');

        return (
            <AppContainer navbarItems={navigation}>
                <ToolMetaData
                    tool={data}
                    readOnly={readOnly}
                    onSave={this.save}
                    saveButton={true}
                    onReset={this.handleReset}
                    isDirty={isDirty}
                />
                <ToolGrid rows={2}>
                    <Background
                        image={image}
                        title='T13B. Aquifer system with a flow divide within of the system'
                    />
                    <Chart parameters={parameters} settings={settings}/>
                    <div>
                        <Settings settings={settings} onChange={this.handleChangeSettings} parameters={parameters}/>
                        <Info parameters={parameters} settings={settings}/>
                    </div>

                    <Parameters
                        parameters={parameters.map(p => SliderParameter.fromObject(p))}
                        handleChange={this.handleChangeParameters}
                        handleReset={this.handleReset}
                    />
                </ToolGrid>
            </AppContainer>
        )
    }
}

T13B.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
};

export default withSession(withRouter(T13B));
