import PropTypes from 'prop-types';
import React from 'react';

import image from '../images/T08.png';
import {Background, Chart, Info, Parameters, Settings} from '../components/index';

import {includes} from 'lodash';
import {T08 as defaults} from '../defaults';
import {Icon} from 'semantic-ui-react';
import SliderParameter from 'scenes/shared/simpleTools/parameterSlider/SliderParameter';

import {fetchTool, sendCommand} from 'services/api';
import {createToolInstanceCommand, updateToolInstanceCommand} from 'services/commandFactory';
import AppContainer from '../../shared/AppContainer';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import ToolGrid from "../../shared/simpleTools/ToolGrid";
import {buildPayload, deepMerge} from "../../shared/simpleTools/helpers";

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t02-groundwater-mounding-hantush/',
    icon: <Icon name="file"/>
}];

class T08 extends React.Component {
    constructor() {
        super();
        this.state = {
            tool: defaults(),
            isLoading: false,
            isDirty: false,
            error: false
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

    save = () => {
        const {id} = this.props.match.params;
        const {tool} = this.state;

        if (id) {
            sendCommand(
                updateToolInstanceCommand(buildPayload(tool)),
                () => this.setState({dirty: false}),
                () => this.setState({error: true})
            );
            return;
        }

        sendCommand(
            createToolInstanceCommand(buildPayload(tool)),
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
                        parameters: parameters.map(p => p.toArray)
                    }
                }
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
                }
            };
        });
    };

    handleReset = () => {
        this.setState({
            tool: defaults(),
            isLoading: false,
            isDirty: false
        });
    };

    update = (tool) => this.setState({tool});

    render() {
        const {tool, isLoading} = this.state;
        if (isLoading) {
            return (
                <AppContainer navBarItems={navigation} loader/>
            );
        }

        const {data, permissions} = tool;
        const {settings, parameters} = data;
        const readOnly = !includes(permissions, 'w');

        return (
            <AppContainer navbarItems={navigation}>
                <ToolMetaData tool={tool} readOnly={readOnly} onChange={this.update} onSave={this.save}/>
                <ToolGrid rows={2}>
                    <Background image={image} title={'T08. GROUNDWATER MOUNDING (HANTUSH)'}/>
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

export default T08;
