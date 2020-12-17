import {Array2D} from '../../../../../../core/model/geometry/Array2D.type';
import {Button, Checkbox, Grid, Header, Icon} from 'semantic-ui-react';
import {Cells} from '../../../../../../core/model/geometry';
import {DiscretizationMap} from '../../discretization';
import {ICell} from '../../../../../../core/model/geometry/Cells.type';
import {IRasterFileMetadata} from '../../../../../../services/api/types';
import {ModflowModel} from '../../../../../../core/model/modflow';
import {RasterParameter} from '../../../../../../core/model/modflow/soilmodel';
import {RasterfileUploadModal} from '../../../../../shared/rasterData';
import {cloneDeep} from 'lodash';
import BoundaryCollection from '../../../../../../core/model/modflow/boundaries/BoundaryCollection';
import RasterDataImage from '../../../../../shared/rasterData/rasterDataImage';
import React, {useState} from 'react';
import SoilmodelLayer from '../../../../../../core/model/modflow/soilmodel/SoilmodelLayer';

interface IProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    layer: SoilmodelLayer;
    onChange: (layer: SoilmodelLayer) => any;
    parameter: RasterParameter;
}

interface IUploadData {
    data: Array2D<number>;
    metadata: IRasterFileMetadata | null;
}

const Ibound = (props: IProps) => {
    const [rasterUploadModal, setRasterUploadModal] = useState<boolean>(false);

    const handleChangeCells = (cells: Cells) => {
        const cLayer = props.layer.toObject();
        cLayer.parameters = props.layer.parameters.map((p) => {
            if (p.id === props.parameter.id) {
                p.value = cells.calculateIBound(props.model.gridSize.nY, props.model.gridSize.nX);
            }
            return p;
        });
        return props.onChange(SoilmodelLayer.fromObject(cLayer));
    };

    const handleDownloadRaster = () => {
        const param = props.layer.parameters.filter((p) => p.id === props.parameter.id);
        if (param.length === 0 || !param[0].data.data) {
            return;
        }

        const cellSize = (props.model.boundingBox.yMax - props.model.boundingBox.yMin) / props.model.gridSize.nY;

        let content = `NCOLS ${props.model.gridSize.nX}
NROWS ${props.model.gridSize.nY}
XLLCORNER ${props.model.boundingBox.xMin}
YLLCORNER ${props.model.boundingBox.yMin}
CELLSIZE ${cellSize}
NODATA_VALUE -9999
`;

        param[0].data.data.forEach((row) => {
            content += row.join(' ');
            content += '\n';

        });

        const file = new Blob([content], {type: 'text/plain'});
        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = `ibound_${props.layer.id}.txt`;
        element.click();
    };

    const handleToggleDefault = () => {
        const cParameters = cloneDeep(props.layer.toObject().parameters);

        if (cParameters.filter((p) => p.id === props.parameter.id).length === 0) {
            cParameters.push({
                id: props.parameter.id,
                data: {file: null},
                value: props.model.cells.calculateIBound(props.model.gridSize.nY, props.model.gridSize.nX)
            });
            const cLayer = props.layer.toObject();
            cLayer.parameters = cParameters;
            return props.onChange(SoilmodelLayer.fromObject(cLayer));
        }

        const layer = props.layer.toObject();
        layer.parameters = props.layer.parameters.filter((p) => p.id !== props.parameter.id);
        return props.onChange(SoilmodelLayer.fromObject(layer));
    };

    const handleUploadRaster = (result: IUploadData) => {
        const layer = props.layer.toObject();
        layer.parameters = props.layer.parameters.map((p) => {
            if (p.id === props.parameter.id) {
                const fArray = result.data.map((row) => {
                    return row.map((v) => {
                        if (v !== -1 && v !== 0 && v !== 1) {
                            return 0 as number;
                        }
                        return v;
                    });
                });
                p.value = fArray as Array2D<number>;
            }
            return p;
        });
        toggleRasterUploadModal();
        return props.onChange(SoilmodelLayer.fromObject(layer));
    };

    const toggleRasterUploadModal = () => setRasterUploadModal(!rasterUploadModal);

    const renderData = () => {
        let cells: Cells = new Cells();
        const cParameters = props.layer.parameters.filter((p) => p.id === props.parameter.id);

        if (cParameters.length > 0) {
            const parameter = cParameters[0];
            const data = parameter.value !== null && parameter.value !== undefined ? parameter.value :
                parameter.data.data;
            if (Array.isArray(data)) {
                cells = Cells.fromRaster(data as ICell[]);
            }

            return (
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <DiscretizationMap
                            key={props.layer.id}
                            cells={cells}
                            boundingBox={props.model.boundingBox}
                            boundaries={props.boundaries}
                            geometry={props.model.geometry}
                            gridSize={props.model.gridSize}
                            onChangeCells={handleChangeCells}
                            readOnly={props.layer.parameters.filter((p) => p.id === props.parameter.id).length === 0}
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        return (
            <Grid.Row centered={true} columns={1}>
                <Grid.Column width={8}>
                    <RasterDataImage
                        data={props.model.cells.calculateIBound(props.model.gridSize.nY, props.model.gridSize.nX)}
                        gridSize={props.model.gridSize}
                        legend={[
                            {isContinuous: false, value: -1, color: 'red', label: 'const'},
                            {isContinuous: false, value: 0, color: 'white', label: 'no flow'},
                            {isContinuous: false, value: 1, color: 'blue', label: 'flow'},
                        ]}
                        unit={props.parameter.unit}
                    />
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as="h4">{props.parameter.title}, {props.parameter.id} [{props.parameter.unit}]</Header>
                </Grid.Column>
                <Grid.Column width={8} textAlign="right">
                    <Checkbox
                        checked={props.layer.parameters.filter((p) => p.id === props.parameter.id).length === 0}
                        disabled={props.model.readOnly}
                        label="Use default value."
                        onChange={handleToggleDefault}
                        toggle={true}
                    />
                </Grid.Column>
            </Grid.Row>
            {renderData()}
            {!props.model.readOnly && props.layer.parameters.filter(
                (p) => p.id === props.parameter.id
            ).length > 0 &&
            <Grid.Row>
                <Grid.Column>
                    <Button
                        icon={true}
                        labelPosition="left"
                        onClick={handleDownloadRaster}
                        floated="right"
                    >
                        <Icon name="download"/>
                        Download Raster
                    </Button>
                    <Button
                        icon={true}
                        labelPosition="left"
                        onClick={toggleRasterUploadModal}
                        primary={true}
                        floated="right"
                    >
                        <Icon name="upload"/>
                        Upload Raster
                    </Button>
                </Grid.Column>
            </Grid.Row>
            }
            {rasterUploadModal && !props.model.readOnly &&
            <RasterfileUploadModal
                gridSize={props.model.gridSize}
                legend={[
                    {isContinuous: false, value: -1, color: 'red', label: 'const'},
                    {isContinuous: false, value: 0, color: 'white', label: 'no flow'},
                    {isContinuous: false, value: 1, color: 'blue', label: 'flow'},
                ]}
                parameter={props.parameter}
                onCancel={toggleRasterUploadModal}
                onChange={handleUploadRaster}
            />
            }
        </Grid>
    );
};

export default Ibound;
