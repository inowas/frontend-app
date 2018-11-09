import PropTypes from 'prop-types';
import React from 'react';

import image from '../images/T02.png';
import {Background, Chart, Parameters, Settings} from '../components/index';

import {each, includes} from 'lodash';
import {defaults} from '../selectors';
import {Icon} from 'semantic-ui-react';
import SliderParameter from 'scenes/shared/simpleTools/parameterSlider/SliderParameter';
import applyParameterUpdate from 'scenes/shared/simpleTools/parameterSlider/parameterUpdate';

import {fetchTool, sendCommand} from 'services/api';
import {createToolInstanceCommand, updateToolInstanceCommand} from 'services/commandFactory';
import AppContainer from '../../shared/AppContainer';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import ToolGrid from "../../shared/simpleTools/ToolGrid";

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t02-groundwater-mounding-hantush/',
    icon: <Icon name="file"/>
}];

class T02 extends React.Component {
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
                    tool: this.merge(this.state.tool, tool),
                    isLoading: false
                }),
                error => this.setState({error, isLoading: false}));
        }
    }

    buildPayload = (tool) => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        public: tool.public,
        type: tool.type,
        data: {
            ...tool.data,
            parameters: tool.data.parameters.map(p => ({
                id: p.id,
                max: p.max,
                min: p.min,
                value: p.value
            }))
        }
    });

    // Thanks to https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
    merge = (target, source) => {
        // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
        for (let key of Object.keys(source)) {
            if (source[key] instanceof Object) Object.assign(source[key], this.merge(target[key], source[key]))
        }

        // Join `target` and modified `source`
        Object.assign(target || {}, source);
        return target
    };

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

    updateParameter(updatedParam) {
        const parameters = this.state.parameters.map(p => {
            if (p.id === updatedParam.id) {
                return applyParameterUpdate(p, updatedParam);
            }

            return p;
        });

        this.setState(prevState => {
            return {
                ...prevState,
                data: {...prevState.data, parameters}
            };
        });
    }

    handleChange = parameter => {
        this.updateParameter(parameter.toObject);
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

        const chartParams = {settings};
        each(parameters, v => {
            chartParams[v.id] = v.value;
        });

        return (
            <AppContainer navbarItems={navigation}>
                <ToolMetaData tool={tool} readOnly={readOnly} onChange={this.update} onSave={this.save}/>
                <ToolGrid rows={2}>
                    <Background image={image} title={'T02. GROUNDWATER MOUNDING (HANTUSH)'}/>
                    <Chart {...chartParams}/>
                    <Settings settings={settings} onChange={this.handleChangeSettings} {...chartParams}/>
                    <Parameters
                        parameters={parameters.map(p => SliderParameter.fromObject(p))}
                        handleChange={this.handleChange}
                        handleReset={this.handleReset}
                    />
                </ToolGrid>
            </AppContainer>
        );
    }
}

T02.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default T02;
