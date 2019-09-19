import {ParseResult} from 'papaparse';
import React, {ChangeEvent, CSSProperties, useEffect, useState} from 'react';
import {ColorResult, SketchPicker} from 'react-color';
import {Button, Dropdown, Grid, Icon, Input, InputOnChangeData, Message, Segment, Table} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import {Criterion} from '../../../../core/model/mcda/criteria';
import {ICriterion} from '../../../../core/model/mcda/criteria/Criterion.type';
import {IRule} from '../../../../core/model/mcda/criteria/Rule.type';
import {dropData} from '../../../../services/api';
import Rainbow from '../../../../services/rainbowvis/Rainbowvis';
import {rainbowFactory} from '../../../shared/rasterData/helpers';
import CsvUpload from '../../../shared/simpleTools/upload/CsvUpload';
import {heatMapColors} from '../../defaults/gis';

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

interface IProps {
    criterion: Criterion;
    onChange: (criterion: Criterion) => any;
    readOnly: boolean;
}

interface IUploadState {
    activeInput: null;
    error: boolean;
    errorMsg: [];
    id: string;
    success: boolean;
}

const criteriaReclassificationDiscrete = (props: IProps) => {
    // TODO: criterion.rulesCollection.orderBy('from');
    const [criterion, setCriterion] = useState<ICriterion>(props.criterion.toObject());
    const [ruleToPickColorFor, setRuleToPickColorFor] = useState<IRule | null>(null);
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const [uploadState, setUploadState] = useState<IUploadState>({
        activeInput: null,
        error: false,
        errorMsg: [],
        id: uuidv4(),
        success: false
    });

    useEffect(() => {
        const uCriterion = props.criterion;
        uCriterion.rulesCollection.orderBy('from');
        return setCriterion(uCriterion.toObject());
    }, [props.criterion]);

    const saveRaster = (uCriterion: Criterion) => {
        dropData(
            uCriterion.suitability.data,
            (response) => {
                uCriterion.suitability.url = response.filename;
                props.onChange(uCriterion);
            },
            (response) => {
                throw new Error(response);
            }
        );
    };

    const handleDismiss = () => setShowInfo(false);

    const handleChange = () => {
        if (props.readOnly) {
            return;
        }
        return props.onChange(Criterion.fromObject(criterion));
    };

    const handleLocalChange = (id: string) => (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        if (props.readOnly) {
            return;
        }
        return setCriterion({
            ...criterion,
            rules: criterion.rules.map((rule: IRule & {[name: string]: any}) => {
                if (rule.id === id) {
                    rule[name] = value;
                }
                return rule;
            }),
            step: 2
        });
    };

    const handleChangeColor = (color: ColorResult) => {
        if (props.readOnly || !ruleToPickColorFor) {
            return;
        }
        return setCriterion({
            ...criterion,
            rules: criterion.rules.map((r) => {
                if (ruleToPickColorFor.id === r.id) {
                    r.color = color.hex;
                }
                return r;
            }),
            step: 2
        });
    };

    const handleClickCalculate = () => {
        if (props.readOnly) {
            return;
        }
        const uCriterion = props.criterion;
        uCriterion.step = 3;
        uCriterion.calculateSuitability();
        return saveRaster(uCriterion);
    };

    const handleCloseColorPicker = () => {
        setRuleToPickColorFor(null);
        return handleChange();
    };

    const handleCsv = (response: ParseResult) => {
        if (!response || props.readOnly) {
            return;
        }

        if (response.errors && response.errors.length > 0) {
            throw new Error('ERROR HANDLING FILE UPLOAD');
        }

        const uCriterion = Criterion.fromObject(criterion);

        response.data.forEach((row) => {
            const cRules = uCriterion.rulesCollection.findByValue(row[0]);
            if (cRules.length > 0) {
                const rule = cRules[0];
                rule.color = row[1];
                rule.name = row[2];
                rule.value = row[3];
                uCriterion.rulesCollection.update(rule);
            }
        });
        return props.onChange(uCriterion);
    };

    const handleSelectScale = (value: string) => () => {
        const scale = heatMapColors[value];
        const rainbow = rainbowFactory({
            min: criterion.raster.min,
            max: criterion.raster.max
        }, scale);

        const uCriterion = criterion;
        uCriterion.rules = criterion.rules.map((rule) => {
            rule.color = `#${rainbow.colorAt(rule.from)}`;
            return rule;
        });

        return props.onChange(Criterion.fromObject(uCriterion));
    };

    const handleClickEditColor = (rule: IRule) => () => setRuleToPickColorFor(rule);

    const renderTableRow = (rule: IRule, key: number) => {
        let isConstraint = false;

        if (criterion.constraintRules.length > 0) {
            const constraint = criterion.constraintRules.filter((r) => r.from === rule.from && r.value === 0);
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
                        onClick={handleClickEditColor(rule)}
                        fluid={true}
                        style={{color: rule.color}}
                        readOnly={props.readOnly}
                        icon="circle"
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        name="name"
                        onBlur={handleChange}
                        onChange={handleLocalChange(rule.id)}
                        type="text"
                        readOnly={props.readOnly}
                        value={rule.name}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        name="value"
                        onBlur={handleChange}
                        onChange={handleLocalChange(rule.id)}
                        type="number"
                        readOnly={isConstraint || props.readOnly}
                        value={isConstraint ? 0 : rule.value}
                    />
                </Table.Cell>
            </Table.Row>
        );
    };

    const renderLegend = (rainbow: Rainbow, name: string) => {
        const gradients = rainbow.gradients.slice().reverse();
        const lastGradient = gradients[gradients.length - 1];
        const legend = gradients.map((mGradient) => ({
            color: '#' + mGradient.endColor,
            value: Number(mGradient.maxNum).toFixed(2)
        }));

        legend.push({
            color: '#' + lastGradient.startColor,
            value: Number(lastGradient.minNum).toFixed(2)
        });

        let gradient = 'linear-gradient(to right';
        legend.forEach((l, index) => {
            gradient += ', ' + l.color + ' ' + ((index + 1) / legend.length * 100) + '%';
        });
        gradient += ')';

        return (
            <div>
                <div style={{display: 'flex'}}>
                    <div
                        style={{
                            backgroundImage: gradient,
                            height: '20px',
                            width: '50px'
                        }}
                    />
                    <div
                        style={{
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '20px'
                        }}
                    >
                        {name}
                    </div>
                </div>
            </div>
        );
    };

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
                    <Message onDismiss={handleDismiss}>
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
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Commands
                    </Segment>
                    <Segment>
                        <Button
                            disabled={props.readOnly}
                            positive={true}
                            icon={true}
                            fluid={true}
                            labelPosition="left"
                            onClick={handleClickCalculate}
                        >
                            <Icon name="calculator"/>
                            Perform Reclassification
                        </Button>
                        <br/>
                        {!props.readOnly &&
                        <div>
                            <CsvUpload
                                baseClasses="ui icon button fluid left labeled"
                                onUploaded={handleCsv}
                                uploadState={uploadState}
                            />
                            <br/>
                            <Dropdown
                                placeholder="Select predefined colors"
                                fluid={true}
                                className="selection"
                            >
                                <Dropdown.Menu>
                                    {colors.map((option, key) =>
                                        <Dropdown.Item
                                            key={key}
                                            onClick={handleSelectScale(option.value)}
                                            value={option.value}
                                        >
                                            {
                                                renderLegend(
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
                    {!props.readOnly && ruleToPickColorFor &&
                    <div style={styles.popover as CSSProperties}>
                        <div style={styles.cover as CSSProperties} onClick={handleCloseColorPicker}/>
                        <SketchPicker
                            disableAlpha={true}
                            color={ruleToPickColorFor.color}
                            onChange={handleChangeColor}
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
                            {rules.map((rule, key) => renderTableRow(rule, key))}
                        </Table.Header>
                    </Table>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default criteriaReclassificationDiscrete;
