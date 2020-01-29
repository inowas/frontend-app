import React, {useState} from 'react';
import {
    Accordion, Checkbox,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Label, PopupProps,
    Segment,
    Table
} from 'semantic-ui-react';
import {FlopyModflowMfdis} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfdis} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfdis';
import {GridSize} from '../../../../../../core/model/modflow';
import {InfoPopup} from '../../../../../shared';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfdis;
    onChange: (pck: FlopyModflowMfdis) => void;
    readonly: boolean;
}

const disPackageProperties = (props: IProps) => {
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfdis>(props.mfPackage.toObject());
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const {readonly} = props;

    const handleClickAccordion = (e: any, titleProps: any) => {
        const {index} = titleProps;
        const newIndex = activeIndex === index ? -1 : index;

        setActiveIndex(newIndex);
    };

    const renderInfoPopup = (
        description: string | JSX.Element,
        title: string,
        position: PopupProps['position'] | undefined = undefined,
        iconOutside: boolean | undefined = undefined
    ) => (
        <InfoPopup description={description} title={title} position={position} iconOutside={iconOutside}/>
    );

    return (
        <Form>
            <Header as={'h3'} dividing={true}>DIS: Discretization Package</Header>
            <Accordion styled={true} fluid={true}>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClickAccordion}>
                    <Icon name="dropdown"/>
                    Spatial Discretization
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Form.Field>
                                    <label>Layers (nlay)</label>
                                    <Input
                                        readOnly={true}
                                        type={'number'}
                                        name="nlay"
                                        value={mfPackage.nlay}
                                        icon={renderInfoPopup(documentation.nlay, 'nlay')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Rows (nrow)</label>
                                    <Input
                                        readOnly={true}
                                        type={'number'}
                                        name="nrow"
                                        value={mfPackage.nrow}
                                        icon={renderInfoPopup(documentation.nrow, 'nrow')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Columns (ncol)</label>
                                    <Input
                                        readOnly={true}
                                        type={'number'}
                                        name="ncol"
                                        value={mfPackage.ncol}
                                        icon={renderInfoPopup(documentation.ncol, 'ncol')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Stress periods (nper)</label>
                                    <Input
                                        readOnly={true}
                                        type={'number'}
                                        name="nper"
                                        value={mfPackage.nper}
                                        icon={renderInfoPopup(documentation.nper, 'nper')}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <label>Row spacing (delr)</label>
                                    <Input
                                        readOnly={true}
                                        name="delr"
                                        value={JSON.stringify(mfPackage.delr)}
                                        icon={renderInfoPopup(documentation.delr, 'delr')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Column spacing (delc)</label>
                                    <Input
                                        readOnly={true}
                                        name="delc"
                                        value={JSON.stringify(mfPackage.delc)}
                                        icon={renderInfoPopup(documentation.delc, 'delc')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Confining bed (laycbd)</label>
                                    <Checkbox
                                        toggle={true}
                                        disabled={readonly}
                                        name="laycbd"
                                        checked={mfPackage.laycbd !== 0}
                                        icon={renderInfoPopup(documentation.laycbd, 'LAYCBD')}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Accordion.Content>

                <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClickAccordion}>
                    <Icon name="dropdown"/>
                    Layer Parameters
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    <Grid divided={'vertically'}>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Label>Top Elevation</Label>
                                <RasterDataImage
                                    data={mfPackage.top}
                                    gridSize={GridSize.fromNxNy(mfPackage.ncol, mfPackage.nrow)}
                                    unit={'m'}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            {Array.isArray(mfPackage.botm) && mfPackage.botm.map((layer: any, idx) => (
                                <Grid.Column key={idx}>
                                    <Label>Bottom Elevation Layer {idx + 1}</Label>
                                    <RasterDataImage
                                        data={layer}
                                        gridSize={GridSize.fromNxNy(mfPackage.ncol, mfPackage.nrow)}
                                        unit={'m'}
                                    />
                                </Grid.Column>
                            ))}
                        </Grid.Row>
                    </Grid>
                </Accordion.Content>

                <Accordion.Title active={activeIndex === 2} index={2} onClick={handleClickAccordion}>
                    <Icon name="dropdown"/>
                    Time Discretization
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                    <Table basic={true}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Perlen</Table.HeaderCell>
                                <Table.HeaderCell>Nstp</Table.HeaderCell>
                                <Table.HeaderCell>Tsmult</Table.HeaderCell>
                                <Table.HeaderCell>Steady</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {Array.isArray(mfPackage.perlen) && mfPackage.perlen.map((perlen: any, idx) => (
                                <Table.Row key={idx}>
                                    <Table.Cell>{idx + 1}</Table.Cell>
                                    <Table.Cell>{perlen}</Table.Cell>
                                    <Table.Cell>{Array.isArray(mfPackage.nstp) && mfPackage.nstp[idx]}</Table.Cell>
                                    <Table.Cell>{Array.isArray(mfPackage.tsmult) && mfPackage.tsmult[idx]}</Table.Cell>
                                    <Table.Cell>
                                        {Array.isArray(mfPackage.steady) && mfPackage.steady[idx] ? 'true' : 'false'}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Accordion.Content>
            </Accordion>
            <Segment>
                <Form.Group>
                    <Form.Field width={4}>
                        <label>Time units (itmuni)</label>
                        <Input
                            readOnly={true}
                            type={'number'}
                            name="itmuni"
                            value={mfPackage.itmuni}
                            icon={renderInfoPopup(documentation.itmuni, 'itmuni')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Length units (lenuni)</label>
                        <Input
                            readOnly={true}
                            type={'number'}
                            name="lenuni"
                            value={mfPackage.lenuni}
                            icon={renderInfoPopup(documentation.lenuni, 'lenuni')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Filename extension</label>
                        <Input
                            readOnly={true}
                            name="extension"
                            value={mfPackage.extension || ''}
                            icon={renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>File unit number</label>
                        <Input
                            readOnly={true}
                            type={'number'}
                            name="unitnumber"
                            value={mfPackage.unitnumber || ''}
                            icon={renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Upper left corner x coordinate (xul)</label>
                        <Input
                            readOnly={true}
                            type={'number'}
                            name="xul"
                            value={mfPackage.xul || ''}
                            icon={renderInfoPopup(documentation.xul, 'xul')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Upper left corner y coordinate (yul)</label>
                        <Input
                            readOnly={true}
                            type={'number'}
                            name="yul"
                            value={mfPackage.yul || ''}
                            icon={renderInfoPopup(documentation.yul, 'yul')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Rotation</label>
                        <Input
                            readOnly={true}
                            type={'number'}
                            name="rotation"
                            value={mfPackage.rotation || 0}
                            icon={renderInfoPopup(documentation.rotation, 'rotation')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths="equal">
                    <Form.Field widths="equal">
                        <label>Coordinate system (proj4_str)</label>
                        <Input
                            readOnly={true}
                            name="proj4_str"
                            value={mfPackage.proj4_str || ''}
                            icon={renderInfoPopup(documentation.proj4_str, 'proj4_str')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Starting date time (start_dateteim)</label>
                        <Input
                            readOnly={true}
                            type={'date'}
                            name="start_dateteim"
                            value={mfPackage.start_datetime || ''}
                            icon={renderInfoPopup(documentation.start_datetime, 'start_datetime')}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
        </Form>
    );
};

export default disPackageProperties;
