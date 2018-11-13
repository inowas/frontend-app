import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import image from '../images/T12.png';

import {Background, Chart, Parameters, Info, MfiData} from '../components';

import {defaults} from '../defaults/T12';
import SliderParameter from 'scenes/shared/simpleTools/parameterSlider/SliderParameter';

import {fetchTool, sendCommand} from 'services/api';
import {createToolInstanceCommand, updateToolInstanceCommand} from 'services/commandFactory';
import AppContainer from '../../shared/AppContainer';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import ToolGrid from "../../shared/simpleTools/ToolGrid";

import {includes} from 'lodash';
import {buildPayload, deepMerge} from "../../shared/simpleTools/helpers";
import {Grid} from "semantic-ui-react";
import MfiCorrections from "../components/mfiCorrections";

const navigation = [];

class T12 extends React.Component {
    constructor(props) {
        super(props);
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
                        parameters: parameters.map(p => p.toObject)
                    }
                }
            };
        });
    };


    handleChangeMfi = (mfi) => {
        this.setState(prevState => {
            return {
                ...prevState,
                tool: {
                    ...prevState.tool,
                    data: {
                        ...prevState.tool.data, mfi
                    }
                }
            };
        });
    };

    handleChangeCorrections = (corrections) => {
        this.setState(prevState => {
            return {
                ...prevState,
                tool: {
                    ...prevState.tool,
                    data: {
                        ...prevState.tool.data, corrections
                    }
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
        const {corrections, mfi, parameters} = data;
        const readOnly = !includes(permissions, 'w');

        return (
            <AppContainer navbarItems={navigation}>
                <ToolMetaData tool={tool} readOnly={readOnly} onChange={this.update} onSave={this.save}/>
                <ToolGrid rows={3}>
                    <Background
                        image={image}
                        title='T12. Clogging estimation by MFI-Index'
                    />
                    <Chart corrections={corrections} mfi={mfi} parameters={parameters}/>
                    <Info corrections={corrections} mfiData={mfi} parameters={parameters}/>
                    <Parameters
                        parameters={parameters.map(p => SliderParameter.fromObject(p))}
                        handleChange={this.handleChangeParameters}
                        handleReset={this.handleReset}
                    />
                    {null}
                    <Grid padded divided>
                        <Grid.Column width={6}>
                            <MfiData mfi={mfi} onChange={this.handleChangeMfi}/>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <MfiCorrections corrections={corrections} onChange={this.handleChangeCorrections}/>
                        </Grid.Column>
                    </Grid>
                </ToolGrid>
            </AppContainer>
        );
    }
}

T12.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(T12);
