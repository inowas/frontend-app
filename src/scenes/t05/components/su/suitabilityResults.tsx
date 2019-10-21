import React, {FormEvent, useState} from 'react';
import {Button, Checkbox, CheckboxProps, Form, Grid, Icon, Radio, Segment} from 'semantic-ui-react';
import {MCDA} from '../../../../core/model/mcda';
import {heatMapColors} from '../../defaults/gis';
import CriteriaRasterMap from '../cd/criteriaRasterMap';
import CellAnalyzer from './cellAnalyzer';

interface IProps {
    mcda: MCDA;
}

const suitabilityResults = (props: IProps) => {
    const [colors, setColors] = useState<string>('reclassified');
    const [layer, setLayer] = useState<string>('suitability');
    const [selectedCell, setSelectedCell] = useState<{ x: number, y: number } | null>(null);
    const [showBasicLayer, setShowBasicLayer] = useState<boolean>(false);

    const {mcda} = props;
    const suitability = mcda.suitability;

    const handleChange = (e: FormEvent<HTMLInputElement>, {name, value}: CheckboxProps) => {
        if (name === 'layer') {
            setLayer(value as string);
            setColors('default');
        }
        if (name === 'colors') {
            setColors(value as string);
        }
    };

    const handleClickCell = (iSelectedCell: { x: number, y: number }) => setSelectedCell(iSelectedCell);

    const handleDownload = () => {
        if (mcda.constraints) {
            const cellSize = (mcda.constraints.boundingBox.yMax - mcda.constraints.boundingBox.yMin) /
                mcda.gridSize.nY;

            let content = `NCOLS ${mcda.gridSize.nX}
NROWS ${mcda.gridSize.nY}
XLLCORNER ${mcda.suitability.raster.boundingBox.xMin}
YLLCORNER ${mcda.suitability.raster.boundingBox.yMin}
CELLSIZE ${cellSize}
NODATA_VALUE -9999
`;

            mcda.suitability.raster.data.forEach((row) => {
                content += row.join(' ');
                content += '\n';
            });

            const file = new Blob([content], {type: 'text/plain'});
            const element = document.createElement('a');
            element.href = URL.createObjectURL(file);
            element.download = 'suitability.asc';
            element.click();
        }
    };

    const handleToggleBasicLayer = () => setShowBasicLayer(!showBasicLayer);

    const handleClickCellAnalyzer = () => setSelectedCell(null);

    let legend = null;
    if (layer === 'suitability') {
        if (colors === 'default') {
            legend = suitability.raster.generateRainbow(heatMapColors.default, [0, 1]);
        }
        if (colors === 'reclassified') {
            legend = suitability.generateLegend('reclassified');
        }
        if (colors === 'colorBlind') {
            legend = suitability.raster.generateRainbow(heatMapColors.colorBlind, [0, 1]);
        }
    }

    let raster;
    switch (layer) {
        default:
            raster = suitability.raster;
            break;
    }

    return (
        <Grid>
            <Grid.Column width={5}>
                {selectedCell ?
                    <CellAnalyzer
                        cell={selectedCell}
                        mcda={props.mcda}
                        onClose={handleClickCellAnalyzer}
                    /> :
                    <div>
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
                            </Form>
                        </Segment>
                        <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                            Color Scheme
                        </Segment>
                        <Segment>
                            {layer === 'suitability' &&
                            <Form>
                                <Form.Field>
                                    <Checkbox
                                        radio={true}
                                        label="Reclassified"
                                        name="colors"
                                        value="reclassified"
                                        checked={colors === 'reclassified'}
                                        onChange={handleChange}
                                    />
                                </Form.Field>
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
                            Download Raster
                        </Button>
                    </div>
                }
            </Grid.Column>
            <Grid.Column width={11}>
                {mcda.suitability.raster.data.length > 0 && !!legend &&
                <CriteriaRasterMap
                    gridSize={props.mcda.gridSize}
                    onClickCell={handleClickCell}
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

export default suitabilityResults;
