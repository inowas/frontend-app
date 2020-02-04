import {cloneDeep} from 'lodash';
import React, {useState} from 'react';
import {Button, Checkbox, Grid, Header, Icon} from 'semantic-ui-react';
import {Cells} from '../../../../../../core/model/geometry';
import {Array2D} from '../../../../../../core/model/geometry/Array2D.type';
import {ICell} from '../../../../../../core/model/geometry/Cells.type';
import {ModflowModel} from '../../../../../../core/model/modflow';
import BoundaryCollection from '../../../../../../core/model/modflow/boundaries/BoundaryCollection';
import {RasterParameter} from '../../../../../../core/model/modflow/soilmodel';
import SoilmodelLayer from '../../../../../../core/model/modflow/soilmodel/SoilmodelLayer';
import {IRasterFileMetadata} from '../../../../../../services/api/types';
import {RasterfileUploadModal} from '../../../../../shared/rasterData';
import RasterDataImage from '../../../../../shared/rasterData/rasterDataImage';
import {DiscretizationMap} from '../../discretization';

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

const ibound = (props: IProps) => {
    const [rasterUploadModal, setRasterUploadModal] = useState<boolean>(false);
    const parameters = props.layer.toObject().parameters;

    const handleChangeCells = (cells: Cells) => {
        const layer = props.layer.toObject();
        layer.parameters = parameters.map((p) => {
            if (p.id === props.parameter.id) {
                p.value = cells.calculateIBound(props.model.gridSize.nY, props.model.gridSize.nX);
            }
            return p;
        });
        return props.onChange(SoilmodelLayer.fromObject(layer));
    };

    const handleToggleDefault = () => {
        const cParameters = cloneDeep(parameters);

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
        layer.parameters = parameters.filter((p) => p.id !== props.parameter.id);
        return props.onChange(SoilmodelLayer.fromObject(layer));
    };

    const handleUploadRaster = (result: IUploadData) => {
        const layer = props.layer.toObject();
        layer.parameters = parameters.map((p) => {
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
        const cParameters = parameters.filter((p) => p.id === props.parameter.id);

        if (cParameters.length > 0) {
            const parameter = cParameters[0];
            const data = parameter.value !== null && parameter.value !== undefined ? parameter.value :
                parameter.data.data;
            if (Array.isArray(data)) {
                cells = Cells.fromRaster(data as ICell[]);
            }

            return (
                <DiscretizationMap
                    cells={cells}
                    boundingBox={props.model.boundingBox}
                    boundaries={props.boundaries}
                    geometry={props.model.geometry}
                    gridSize={props.model.gridSize}
                    onChangeCells={handleChangeCells}
                    readOnly={parameters.filter((p) => p.id === props.parameter.id).length === 0}
                />
            );
        }

        return (
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
        );
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Header as="h4">{props.parameter.title}, {props.parameter.id} [{props.parameter.unit}]
                        <Checkbox
                            checked={parameters.filter((p) => p.id === props.parameter.id).length === 0}
                            disabled={props.model.readOnly}
                            label="Use default value."
                            onChange={handleToggleDefault}
                            style={{float: 'right'}}
                            toggle={true}
                        />
                    </Header>
                    {renderData()}
                    {!props.model.readOnly && parameters.filter((p) => p.id === props.parameter.id).length > 0 &&
                    <Button
                        icon={true}
                        labelPosition="left"
                        onClick={toggleRasterUploadModal}
                        primary={true}
                        fluid={true}
                    >
                        <Icon name="upload"/>
                        Upload Raster
                    </Button>
                    }
                </Grid.Column>
            </Grid.Row>
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

export default ibound;
