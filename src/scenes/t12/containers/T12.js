import {AppContainer} from '../../shared';
import {Background, Chart, Info, MfiCorrections, MfiData, Parameters} from '../components';
import {Grid} from 'semantic-ui-react';
import {SliderParameter, ToolGrid, ToolMetaData} from '../../shared/simpleTools';
import {buildPayloadToolInstance, deepMerge} from '../../shared/simpleTools/helpers';
import {defaultsWithSession} from '../defaults/T12';
import {fetchTool, sendCommand} from '../../../services/api';
import {includes} from 'lodash';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import image from '../images/T12.png';

const navigation = [];

class T12 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tool: defaultsWithSession(props.session),
            isLoading: false,
            isDirty: false,
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
            tool: defaultsWithSession(this.props.session),
            isLoading: false,
            isDirty: false
        });
    };

    update = (tool) => this.setState({tool});

    render() {
        const {tool, isLoading} = this.state;
        if (isLoading) {
            return (
                <AppContainer navbarItems={navigation} loader/>
            );
        }

        const {data, isDirty, permissions} = tool;
        const {corrections, mfi, parameters} = data;
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
