import PropTypes from 'prop-types';
import React from 'react';
import {Icon} from 'semantic-ui-react';

import {includes} from 'lodash';
import {withRouter} from 'react-router-dom';

import {AppContainer} from '../../shared';
import {Background, Chart, Info, Parameters, Settings} from '../components/index';
import {SliderParameter, ToolGrid, ToolMetaData} from '../../shared/simpleTools';

import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';

import image from '../images/T08.png';
import {T08 as defaults} from '../defaults';

import {fetchTool, sendCommand} from 'services/api';
import {buildPayloadToolInstance, deepMerge} from '../../shared/simpleTools/helpers';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t08-one-dimensional-transport-equation/',
    icon: <Icon name="file"/>
}];

class T08 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tool: defaults(),
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

    save = () => {
        const {id} = this.props.match.params;
        const {tool} = this.state;

        if (id) {
            sendCommand(
                SimpleToolsCommand.updateToolInstance(buildPayloadToolInstance(tool)),
                () => this.setState({isDirty: false}),
                () => this.setState({error: true})
            );
            return;
        }

        sendCommand(
            SimpleToolsCommand.createToolInstance(buildPayloadToolInstance(tool)),
            () => this.props.history.push(`${this.props.location.pathname}/${tool.id}`),
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
                    data: {...prevState.tool.data, settings}
                },
                isDirty: true
            };
        });
    };

    handleReset = () => {
        this.setState(prevState => {
            return {
                tool: {...prevState.tool, data: defaults().data},
                isLoading: false,
                isDirty: true
            }
        });
    };


    update = (tool) => this.setState({tool});

    render() {
        if (this.state.isLoading) {
            return (
                <AppContainer navBarItems={navigation} loader/>
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
                    onChange={this.update}
                    onSave={this.save}
                    isDirty={isDirty}
                />
                <ToolGrid rows={2}>
                    <Background image={image} title={'T08. 1D transport model (Ogata-Banks)'}/>
                    <Chart settings={settings} parameters={parameters}/>
                    <div>
                        <Settings settings={settings} onChange={this.handleChangeSettings}/>
                        <Info parameters={parameters} settings={settings}/>
                    </div>
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

T08.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(T08);
