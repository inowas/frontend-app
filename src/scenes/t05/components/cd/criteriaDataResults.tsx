import React, {FormEvent, useState} from 'react';
import {Button, Checkbox, CheckboxProps, Form, Grid, Icon, Radio, Segment} from 'semantic-ui-react';
import GridSize from '../../../../core/model/geometry/GridSize';
import {Criterion} from '../../../../core/model/mcda/criteria';
import {RainbowOrLegend} from '../../../../services/rainbowvis/types';
import {heatMapColors} from '../../defaults/gis';
import CriteriaRasterMap from './criteriaRasterMap';

interface IProps {
    criterion: Criterion;
    gridSize: GridSize;
    onChange: (criterion: Criterion) => any;
}

const CriteriaDataResults = (props: IProps) => {
    const [colors, setColors] = useState<string>('default');
    const [layer, setLayer] = useState<string>('suitability');
    const [showBasicLayer, setShowBasicLayer] = useState<boolean>(false);

    const handleChange = (e: FormEvent, {name, value}: CheckboxProps) => {
        if (name === 'layer') {
            setLayer(value as string);
            return setColors('default');
        }
        if (name === 'colors') {
            return setColors(value as string);
        }
    };

    const handleDownload = () => {
        const hSuitability = props.criterion.suitability;

        const cellSize = (hSuitability.boundingBox.yMax - hSuitability.boundingBox.yMin) /
            props.gridSize.nY;

        let content = `NCOLS ${props.gridSize.nX}
NROWS ${props.gridSize.nY}
XLLCORNER ${hSuitability.boundingBox.xMin}
YLLCORNER ${hSuitability.boundingBox.yMin}
CELLSIZE ${cellSize}
NODATA_VALUE -9999
`;

        suitability.data.forEach((row) => {
            content += row.join(' ');
            content += '\n';

        });

        const file = new Blob([content], {type: 'text/plain'});
        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = `suitability_${criterion.name}.asc`;
        element.click();
    };

    const handleToggleBasicLayer = () => setShowBasicLayer(!showBasicLayer);

    const {criterion} = props;
    const suitability = criterion.suitability;

    let legend: RainbowOrLegend | null = null;
    if (layer === 'criteria') {
        if (colors === 'classes') {
            legend = criterion.generateLegend('classified') as RainbowOrLegend;
        }
        if (colors === 'default') {
            legend = criterion.generateLegend() as RainbowOrLegend;
        }
    }
    if (layer === 'suitability' || layer === 'constraints') {
        if (colors === 'default') {
            legend = suitability.generateRainbow(heatMapColors.default, [0, 1]);
        }
        if (colors === 'colorBlind') {
            legend = suitability.generateRainbow(heatMapColors.colorBlind, [0, 1]);
        }
    }

    let raster;
    switch (layer) {
        case 'suitability':
            raster = criterion.suitability;
            break;
        case 'constraints':
            raster = criterion.constraintRaster;
            break;
        default:
            raster = criterion.raster;
            break;
    }

    return (
        <Grid>
            <Grid.Column width={5}>
                <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                    Layer
                </Segment>
                <Segment>
                    <Form>
                        <Form.Field>
                            <Checkbox
                                radio={true}
                                label="Suitability"
                                name="layer"
                                value="suitability"
                                checked={layer === 'suitability'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox
                                radio={true}
                                label="Criteria Data"
                                name="layer"
                                value="criteria"
                                checked={layer === 'criteria'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        {criterion.constraintRaster && criterion.constraintRaster.data.length > 0 &&
                        <Form.Field>
                            <Checkbox
                                radio={true}
                                label="Constraints"
                                name="layer"
                                value="constraints"
                                checked={layer === 'constraints'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        }
                    </Form>
                </Segment>
                <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                    Color Scheme
                </Segment>
                <Segment>
                    {layer === 'criteria' &&
                    <Form>
                        <Form.Field>
                            <Checkbox
                                radio={true}
                                label="Default"
                                value="default"
                                name="colors"
                                checked={colors === 'default'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox
                                radio={true}
                                label="Reclassified"
                                value="classes"
                                name="colors"
                                checked={colors === 'classes'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                    </Form>
                    }
                    {(layer === 'suitability' || layer === 'constraints') &&
                    <Form>
                        <Form.Field>
                            <Checkbox
                                radio={true}
                                label="Default heat map"
                                name="colors"
                                value="default"
                                checked={colors === 'default'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox
                                radio={true}
                                label="Barrier-free colors"
                                name="colors"
                                value="colorBlind"
                                checked={colors === 'colorBlind'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                    </Form>
                    }
                </Segment>
                <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                    Base map
                </Segment>
                <Segment>
                    <Form>
                        <Form.Field>
                            <Radio
                                checked={showBasicLayer}
                                label={`Turn ${showBasicLayer ? 'off' : 'on'} base map`}
                                name="showBasicLayer"
                                onChange={handleToggleBasicLayer}
                                toggle={true}
                            />
                        </Form.Field>
                    </Form>
                </Segment>
                <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                    Commands
                </Segment>
                <Button
                    fluid={true}
                    primary={true}
                    icon={true}
                    labelPosition="left"
                    onClick={handleDownload}
                >
                    <Icon name="download"/>
                    Download Suitability Raster
                </Button>
            </Grid.Column>
            <Grid.Column width={11}>
                {criterion.suitability.data.length > 0 && !!legend &&
                <CriteriaRasterMap
                    gridSize={props.gridSize}
                    raster={raster}
                    showBasicLayer={showBasicLayer}
                    showButton={true}
                    showLegend={true}
                    legend={legend}
                />
                }
            </Grid.Column>
        </Grid>
    );
};

export default CriteriaDataResults;
