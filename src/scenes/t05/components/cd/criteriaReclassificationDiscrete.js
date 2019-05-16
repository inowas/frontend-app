import PropTypes from 'prop-types';
import React from 'react';
import {Criterion} from '../../../../core/model/mcda/criteria';
import {Button, Dropdown, Grid, Icon, Input, Message, Segment, Table} from 'semantic-ui-react';
import {SketchPicker} from 'react-color';
import {dropData} from '../../../../services/api';
import CsvUpload from '../../../shared/simpleTools/upload/CsvUpload';
import uuidv4 from 'uuid/v4';
import {heatMapColors} from '../../defaults/gis';
import {rainbowFactory} from '../../../shared/rasterData/helpers';

const styles = {
    popover: {
        position: 'absolute',
        zIndex: '2',
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }
};

class CriteriaReclassificationDiscrete extends React.Component {

    constructor(props) {
        super(props);

        const criterion = props.criterion;
        criterion.rulesCollection.orderBy('from');

        this.state = {
            criterion: criterion.toObject(),
            ruleToPickColorFor: false,
            selectedRule: null,
            showInfo: true,
            uploadState: {
                activeInput: null,
                error: false,
                errorMsg: [],
                id: uuidv4(),
                success: false
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const criterion = nextProps.criterion;
        criterion.rulesCollection.orderBy('from');

        this.setState({
            criterion: criterion.toObject(),
        });
    }

    saveRaster(criterion) {
        dropData(
            criterion.suitability.data,
            response => {
                criterion.suitability.url = response.filename;
                this.props.onChange(criterion);
            },
            response => {
                throw new Error(response);
            }
        );
    }

    handleDismiss = () => this.setState({showInfo: false});

    handleChange = () => {
        if (this.props.readOnly) {
            return;
        }
        return this.props.onChange(Criterion.fromObject(this.state.criterion));
    };

    handleLocalChange = id => (e, {name, value}) => {
        if (this.props.readOnly) {
            return;
        }
        return this.setState(prevState => ({
            criterion: {
                ...prevState.criterion,
                rules: prevState.criterion.rules.map(rule => {
                    if (rule.id === id) {
                        rule[name] = value;
                    }
                    return rule;
                }),
                step: 2
            }
        }));
    };

    handleChangeColor = color => {
        if (this.props.readOnly) {
            return;
        }
        const rule = this.state.ruleToPickColorFor;
        return this.setState(prevState => ({
            criterion: {
                ...prevState.criterion,
                rules: prevState.criterion.rules.map(r => {
                    if (rule.id === r.id) {
                        r.color = color.hex;
                    }
                    return r;
                }),
                step: 2
            }
        }));
    };

    handleClickCalculate = () => {
        if (this.props.readOnly) {
            return;
        }
        const criterion = this.props.criterion;
        criterion.step = 3;
        criterion.calculateSuitability();
        this.saveRaster(criterion);
    };

    handleCloseColorPicker = () => {
        this.setState({ruleToPickColorFor: false}, this.handleChange());
    };

    handleCsv = response => {
        if (!response || this.props.readOnly) {
            return;
        }

        if (response.errors && response.errors.length > 0) {
            throw new Error('ERROR HANDLING FILE UPLOAD');
        }

        const criterion = Criterion.fromObject(this.state.criterion);

        response.data.forEach(row => {
            const rules = criterion.rulesCollection.findByValue(row[0]);
            if (rules.length > 0) {
                const rule = rules[0];
                rule.color = row[1];
                rule.name = row[2];
                rule.value = row[3];
                criterion.rulesCollection.update(rule);
            }
        });
        return this.props.onChange(criterion);
    };

    handleSelectScale = value => e => {
        const scale = heatMapColors[value];
        const rainbow = rainbowFactory({
            min: this.state.criterion.raster.min,
            max: this.state.criterion.raster.max
        }, scale);

        const criterion = this.state.criterion;
        criterion.rules = criterion.rules.map(rule => {
             rule.color = `#${rainbow.colorAt(rule.from)}`;
             return rule;
        });

        return this.props.onChange(Criterion.fromObject(criterion));
    };

    renderTableRow(rule, key) {
        let isConstraint = false;
        const criterion = this.state.criterion;

        if (criterion.constraintRules.length > 0) {
            const constraint = criterion.constraintRules.filter(r => r.from === rule.from && r.value === 0);
            if (constraint.length > 0) {
                isConstraint = true;
            }
        }

        return (
            <Table.Row key={key}>
                <Table.Cell>
                    {rule.from}
                </Table.Cell>
                <Table.Cell>
                    <Button
                        onClick={() => this.setState({ruleToPickColorFor: rule})}
                        fluid
                        style={{color: rule.color}}
                        readOnly={this.props.readOnly}
                        icon='circle'
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        name='name'
                        onBlur={this.handleChange}
                        onChange={this.handleLocalChange(rule.id)}
                        type='text'
                        readOnly={this.props.readOnly}
                        value={rule.name}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        name='value'
                        onBlur={this.handleChange}
                        onChange={this.handleLocalChange(rule.id)}
                        type='number'
                        readOnly={isConstraint || this.props.readOnly}
                        value={isConstraint ? 0 : rule.value}
                    />
                </Table.Cell>
            </Table.Row>
        );
    }

    renderLegend(rainbow, name) {
        const gradients = rainbow.getGradients().slice().reverse();
        const lastGradient = gradients[gradients.length - 1];
        const legend = gradients.map(gradient => ({
            color: '#' + gradient.getEndColour(),
            value: Number(gradient.getMaxNum()).toFixed(2)
        }));

        legend.push({
            color: '#' + lastGradient.getStartColour(),
            value: Number(lastGradient.getMinNum()).toFixed(2)
        });

        let gradient = 'linear-gradient(to right';
        legend.forEach((l, index) => {
            gradient += ', ' + l.color + ' ' + ((index + 1) / legend.length * 100) + '%';
        });
        gradient += ')';

        return (
            <div>
                <div style={{display: 'flex'}}>
                    <div style={{
                        backgroundImage: gradient,
                        height: '20px',
                        width: '50px'
                    }}
                    />
                    <div style={{
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '20px'
                    }}>
                        {name}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const {criterion, showInfo, uploadState} = this.state;
        const rules = criterion.rules;

        const colors = [
            {value: 'discrete', scale: heatMapColors.discrete, name: 'Discrete'},
            {value: 'default', scale: heatMapColors.default, name: 'Heatmap'},
            {value: 'colorBlind', scale: heatMapColors.colorBlind, name: 'Heatmap (barrier free)'}
        ];

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {showInfo &&
                        <Message onDismiss={this.handleDismiss}>
                            <Message.Header>Reclassification for discrete values</Message.Header>
                            <p>
                                A suitability value between 0 and 1 can be set for each unique value of the uploaded
                                raster. It is also possible to choose a color and name for each value for a better
                                visualization of the criteria data in the next step. It is necessary to click on the
                                'Perform Reclassification' button after making changes.
                            </p>
                        </Message>
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Commands
                        </Segment>
                        <Segment>
                            <Button disabled={this.props.readOnly} positive icon fluid labelPosition='left'
                                    onClick={this.handleClickCalculate}>
                                <Icon name='calculator'/>
                                Perform Reclassification
                            </Button>
                            <br/>
                            {!this.props.readOnly &&
                            <div>
                                <CsvUpload
                                    baseClasses='ui icon button fluid left labeled'
                                    onUploaded={this.handleCsv}
                                    uploadState={uploadState}
                                />
                                <br/>
                                <Dropdown
                                    placeholder='Select predefined colors'
                                    fluid
                                    className='selection'
                                >
                                    <Dropdown.Menu>
                                        {colors.map((option, key) =>
                                            <Dropdown.Item
                                                key={key}
                                                onClick={this.handleSelectScale(option.value)}
                                                value={option.value}
                                            >
                                                {
                                                    this.renderLegend(
                                                        rainbowFactory({
                                                            min: 0,
                                                            max: 100
                                                        }, option.scale)
                                                    , option.name)
                                                }
                                            </Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            }
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        {!this.props.readOnly && this.state.ruleToPickColorFor &&
                        <div style={styles.popover}>
                            <div style={styles.cover} onClick={this.handleCloseColorPicker}/>
                            <SketchPicker
                                disableAlpha={true}
                                color={this.state.ruleToPickColorFor.color}
                                onChange={this.handleChangeColor}
                            />
                        </div>
                        }
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Value</Table.HeaderCell>
                                    <Table.HeaderCell>Color</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Class</Table.HeaderCell>
                                </Table.Row>
                                {rules.map((rule, key) => this.renderTableRow(rule, key))}
                            </Table.Header>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

CriteriaReclassificationDiscrete.propTypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default CriteriaReclassificationDiscrete;