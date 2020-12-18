import {Array2D, Array3D} from '../../../core/model/geometry/Array2D.type';
import {
    Button,
    CheckboxProps,
    Dimmer,
    Dropdown,
    DropdownProps,
    Form,
    Grid,
    Header,
    Input,
    List,
    Loader,
    Menu,
    MenuItemProps,
    Message,
    Modal,
    Radio,
    Segment,
} from 'semantic-ui-react';
import {GridSize} from '../../../core/model/geometry';
import {IRasterFileMetadata} from '../../../services/api/types';
import {InterpolationType} from './types';
import {RainbowOrLegend} from '../../../services/rainbowvis/types';
import {RasterParameter} from '../../../core/model/modflow/soilmodel';
import {fetchRasterData, fetchRasterMetaData, uploadRasterfile} from '../../../services/api';
import RasterDataImage from './rasterDataImage';
import RasterFromCSV from './rasterFromCSV';
import RasterFromPoints from './rasterFromPoints';
import RasterFromProject from './rasterFromProject';
import React, {ChangeEvent, FormEvent, MouseEvent, SyntheticEvent, useState} from 'react';

const styles = {
    input: {
        backgroundColor: 'transparent',
        padding: 0
    }
};

interface IData {
    data: Array2D<number>;
    metadata: IRasterFileMetadata | null;
}

interface IProps {
    gridSize: GridSize;
    onCancel: () => any;
    onChange: (data: IData) => any;
    onSave?: (data: Array2D<number>) => any;
    parameter: RasterParameter;
    legend?: RainbowOrLegend;
    discreteRescaling?: boolean;
}

const RasterFileUploadModal = (props: IProps) => {
    const [hash, setHash] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<IRasterFileMetadata | null>(null);
    const [data, setData] = useState<Array3D<number> | null>(null);
    const [interpolation, setInterpolation] = useState<InterpolationType>(InterpolationType.NEAREST_NEIGHBOR);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedBand, setSelectedBand] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [errorFetching, setErrorFetching] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [errorUploading, setErrorUploading] = useState<string | null>(null);
    const [errorGridSize, setErrorGridSize] = useState<boolean>(false);
    const [activeItem, setActiveItem] = useState<string>('file');

    const handleChangeInterpolation = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) =>
        setInterpolation(value as InterpolationType);

    const renderMetaData = () => {
        if (!hash || !metadata) {
            return null;
        }

        return (
            <Segment color="blue">
                <Header as="h3" style={{textAlign: 'left'}}>Metadata</Header>
                <List>
                    <List.Item>
                        <List.Icon name="hashtag"/>
                        <List.Content>{hash}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="attach"/>
                        <List.Content>{metadata.driver}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="marker"/>
                        <List.Content>X: {metadata.origin[0]}, Y: {metadata.origin[1]}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="resize horizontal"/>
                        <List.Content>{metadata.pixelSize[0]}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="resize vertical"/>
                        <List.Content>{metadata.pixelSize[1]}</List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name="map outline"/>
                        <List.Content>{metadata.projection}</List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name="grid layout"/>
                        <List.Content>
                            X: {metadata.rasterXSize}, Y: {metadata.rasterYSize}, Z: {metadata.rasterCount}
                        </List.Content>
                    </List.Item>
                </List>
            </Segment>
        );
    };

    const handleChangeSelectBand = (e: FormEvent<HTMLInputElement>, {value}: CheckboxProps) =>
        setSelectedBand(Number(value));

    const handleClickApply = () => data && data.length > 0 ? props.onChange({
        data: data[selectedBand],
        metadata
    }) : null;

    const renderBands = () => {
        if (errorGridSize || !data) {
            return null;
        }

        const bands = data.map((e, key) => (
            <Form.Field key={key}>
                <Radio
                    label={'Band ' + key}
                    name="radioGroup"
                    value={key}
                    checked={selectedBand === key}
                    onChange={handleChangeSelectBand}
                />
            </Form.Field>
        ));

        return (
            <Segment color="blue">
                <Header as="h3" style={{textAlign: 'left'}}>Data</Header>
                {bands}
            </Segment>
        );
    };

    const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        const {gridSize} = props;
        const files = e.target.files;

        if (files && files.length > 0) {
            const file = files[0];

            setIsLoading(true);

            uploadRasterfile(file, (rData: { hash: string }) => {
                    setData(null);
                    setHash(hash);

                    const fetchOptions = {
                        hash: rData.hash,
                        width: gridSize.nX,
                        height: gridSize.nY,
                        method: interpolation
                    };

                    fetchRasterMetaData({hash: rData.hash},
                        (response: IRasterFileMetadata) => {
                            setErrorGridSize(interpolation === 11 && (response.rasterXSize !== gridSize.nX ||
                                response.rasterYSize !== gridSize.nY));
                            setIsLoading(false);
                            setMetadata(response);
                        },
                        (error: string) => setErrorFetching(error));

                    fetchRasterData(
                        interpolation === 11 ? {hash: rData.hash} : fetchOptions,
                        (fData: Array3D<number>) => {
                            setIsLoading(false);
                            setData(fData);
                        },
                        (error) => setErrorFetching(error));
                },
                (error) => setErrorUploading(error)
            );
        }
    };

    const handleItemClick = (e: MouseEvent<HTMLAnchorElement>, {value}: MenuItemProps) => setActiveItem(value);

    const handleChangeRasterFromProject = (result: Array2D<number>) => setData([result]);

    return (
        <Modal size={'large'} open={true} onClose={props.onCancel} dimmer={'blurring'}>
            <Modal.Header>Import Rasterfile</Modal.Header>
            <Modal.Content>
                <Menu pointing={true} secondary={true}>
                    <Menu.Item
                        name="GeoTiff"
                        active={activeItem === 'file'}
                        onClick={handleItemClick}
                        value="file"
                    />
                    <Menu.Item
                        name="Points to Raster"
                        active={activeItem === 'interpolation'}
                        onClick={handleItemClick}
                        value="interpolation"
                    />
                    <Menu.Item
                        name="Import from Project"
                        active={activeItem === 'project'}
                        onClick={handleItemClick}
                        value="project"
                    />
                    <Menu.Item
                        name="Import from CSV"
                        active={activeItem === 'csv'}
                        onClick={handleItemClick}
                        value="csv"
                    />
                </Menu>
                {activeItem === 'project' &&
                <RasterFromProject
                    onChange={handleChangeRasterFromProject}
                />
                }
                {activeItem === 'csv' &&
                <RasterFromCSV
                    onChange={handleChangeRasterFromProject}
                    unit={props.parameter.unit}
                />
                }
                {activeItem === 'interpolation' &&
                <RasterFromPoints
                    onChange={handleChangeRasterFromProject}
                    unit={props.parameter.unit}
                />
                }
                {activeItem === 'file' &&
                <Grid divided={'vertically'}>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            {isLoading &&
                            <Dimmer active={true} inverted={true}>
                                <Loader>Uploading</Loader>
                            </Dimmer>
                            }
                            {!isLoading &&
                            <Segment color={'green'}>
                                <Header as="h3" style={{textAlign: 'left'}}>Important</Header>
                                <List bulleted={true}>
                                    <List.Item>The rasterfile should have the same bounds as the model
                                        area.</List.Item>
                                    <List.Item>The grid size will be interpolated automatically, if an interpolation
                                        method is selected.</List.Item>
                                </List>
                                <Header as="h4" style={{textAlign: 'left'}}>Interpolation method</Header>
                                <Dropdown
                                    placeholder="Select interpolation method"
                                    fluid={true}
                                    selection={true}
                                    name="interpolation"
                                    options={[
                                        {key: -1, text: 'No interpolation', value: InterpolationType.NO_INTERPOLATION},
                                        {
                                            key: 0, text: 'Nearest-neighbor (default)',
                                            value: InterpolationType.NEAREST_NEIGHBOR
                                        },
                                        {key: 1, text: 'Bi-linear', value: InterpolationType.BI_LINEAR},
                                        {key: 2, text: 'Bi-quadratic', value: InterpolationType.BI_QUADRATIC},
                                        {key: 3, text: 'Bi-cubic', value: InterpolationType.BI_CUBIC},
                                        {key: 4, text: 'Bi-quartic', value: InterpolationType.BI_QUARTIC},
                                        {key: 5, text: 'Bi-quintic', value: InterpolationType.BI_QUINTIC}
                                    ]}
                                    value={interpolation}
                                    onChange={handleChangeInterpolation}
                                /><br/>
                                <Input style={styles.input} type="file" onChange={handleUploadFile}/>
                            </Segment>
                            }
                        </Grid.Column>
                        <Grid.Column>
                            {renderMetaData()}
                            {errorGridSize &&
                            <Message negative={true}>
                                <Message.Header>Error</Message.Header>
                                <p>The grid size of the uploaded raster does not fit the models grid size. Use an
                                    interpolation method or adjust the grid size of the input raster.</p>
                            </Message>
                            }
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            {data && renderBands()}
                        </Grid.Column>
                        <Grid.Column>
                            {!errorGridSize && data &&
                            <Segment color={'green'}>
                                <RasterDataImage
                                    data={data[selectedBand]}
                                    legend={props.legend}
                                    unit={props.parameter.unit}
                                    gridSize={props.gridSize}
                                />
                            </Segment>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                }
            </Modal.Content>
            <Modal.Actions>
                <Button
                    negative={true}
                    onClick={props.onCancel}
                >
                    Cancel
                </Button>
                {!errorGridSize &&
                <Button
                    positive={true}
                    onClick={handleClickApply}
                >
                    Apply
                </Button>
                }
            </Modal.Actions>
        </Modal>
    );
};

export default RasterFileUploadModal;
