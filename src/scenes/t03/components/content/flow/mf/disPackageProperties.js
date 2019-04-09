import PropTypes from 'prop-types';
import React from 'react';
import {Accordion, Form, Grid, Header, Icon, Input, Segment} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfdis} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from '../../../../../../core/model/modflow';

class DisPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage} = this.props;
        const {activeIndex} = this.state;

        return (
            <Form>
                <Segment>
                <Form.Group>
                    <Form.Field width={4}>
                        <label>No. of layers (nlay)</label>
                        <Input
                            readOnly
                            type={'number'}
                            name='nlay'
                            value={mfPackage.nlay}
                            icon={this.renderInfoPopup(documentation.nlay, 'nlay')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>No. of rows (nrow)</label>
                        <Input
                            readOnly
                            type={'number'}
                            name='nrow'
                            value={mfPackage.nrow}
                            icon={this.renderInfoPopup(documentation.nrow, 'nrow')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>No. of columns (ncol)</label>
                        <Input
                            readOnly
                            type={'number'}
                            name='ncol'
                            value={mfPackage.ncol}
                            icon={this.renderInfoPopup(documentation.ncol, 'ncol')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Stress periods (nper)</label>
                        <Input
                            readOnly
                            type={'number'}
                            name='nper'
                            value={mfPackage.nper}
                            icon={this.renderInfoPopup(documentation.nper, 'nper')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Row spacing (delr)</label>
                        <Input
                            readOnly
                            name='delr'
                            value={JSON.stringify(mfPackage.delr)}
                            icon={this.renderInfoPopup(documentation.delr, 'delr')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Column spacing (delc)</label>
                        <Input
                            readOnly
                            name='delc'
                            value={JSON.stringify(mfPackage.delc)}
                            icon={this.renderInfoPopup(documentation.delc, 'delc')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Confining bed (laycbd)</label>
                        <Input
                            readOnly
                            name='laycbd'
                            value={JSON.stringify(mfPackage.laycbd)}
                            icon={this.renderInfoPopup(documentation.laycbd, 'laycbd')}
                        />
                    </Form.Field>
                </Form.Group>
                </Segment>

                <Accordion styled fluid>
                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Layer Parameters
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <Grid divided={'vertically'}>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Header size='small' as={'label'}>Top Elevation</Header>
                                    <RasterDataImage
                                        data={mfPackage.top}
                                        gridSize={GridSize.fromNxNy(mfPackage.ncol, mfPackage.nrow)}
                                        unit={'m'}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                {mfPackage.botm.map((layer, idx) => (
                                    <Grid.Column key={idx}>
                                        <Header size='small' as={'label'}>Bottom Elevation Layer {idx + 1}</Header>
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
                </Accordion>

                <Segment>
                <Form.Group widths='equal'>
                    <Form.Field width={4}>
                        <label>Time steps in stress period (nstp)</label>
                        <Input readOnly
                               name='nstp'
                               value={JSON.stringify(mfPackage.nstp)}
                               icon={this.renderInfoPopup(documentation.nstp, 'nstp')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Time step multiplier (tsmult)</label>
                        <Input readOnly
                               name='tsmult'
                               value={JSON.stringify(mfPackage.tsmult)}
                               icon={this.renderInfoPopup(documentation.tsmult, 'tsmult')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>State of stress period (steady)</label>
                        <Input readOnly
                               name='steady'
                               value={JSON.stringify(mfPackage.steady)}
                               icon={this.renderInfoPopup(documentation.steady, 'steady')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Stress period lengths (perlen)</label>
                        <Input readOnly
                               name='perlen'
                               value={JSON.stringify(mfPackage.perlen)}
                               icon={this.renderInfoPopup(documentation.perlen, 'perlen')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Time units (itmuni)</label>
                        <Input readOnly
                               type={'number'}
                               name='itmuni'
                               value={JSON.stringify(mfPackage.itmuni)}
                               icon={this.renderInfoPopup(documentation.itmuni, 'itmuni')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Length units (lenuni)</label>
                        <Input readOnly
                               type={'number'}
                               name='lenuni'
                               value={JSON.stringify(mfPackage.lenuni)}
                               icon={this.renderInfoPopup(documentation.lenuni, 'lenuni')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension</label>
                        <Input readOnly
                               name='extension'
                               value={mfPackage.extension}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number</label>
                        <Input readOnly
                               type={'number'}
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Upper left corner x coordinate (xul)</label>
                        <Input readOnly
                               type={'number'}
                               name='xul'
                               value={JSON.stringify(mfPackage.xul)}
                               icon={this.renderInfoPopup(documentation.xul, 'xul')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Upper left corner y coordinate (yul)</label>
                        <Input readOnly
                               type={'number'}
                               name='yul'
                               value={JSON.stringify(mfPackage.yul)}
                               icon={this.renderInfoPopup(documentation.yul, 'yul')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Rotation</label>
                        <Input readOnly
                               type={'number'}
                               name='rotation'
                               value={JSON.stringify(mfPackage.rotation)}
                               icon={this.renderInfoPopup(documentation.rotation, 'rotation')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field widths='equal'>
                        <label>Coordinate system (proj4_str)</label>
                        <Input readOnly
                               name='proj4_str'
                               value={mfPackage.proj4_str}
                               icon={this.renderInfoPopup(documentation.proj4_str, 'proj4_str')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Starting date time (start_dateteim)</label>
                        <Input readOnly
                               type={'date'}
                               name='start_dateteim'
                               value={mfPackage.start_datetime}
                               icon={this.renderInfoPopup(documentation.start_datetime, 'start_datetime')}
                        />
                    </Form.Field>
                </Form.Group>
                </Segment>
            </Form>
        );
    }
}

DisPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfdis),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default DisPackageProperties;
