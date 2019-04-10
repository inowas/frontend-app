import PropTypes from 'prop-types';
import React from 'react';
import {Accordion, Form, Grid, Header, Icon, Popup, Segment, Table} from 'semantic-ui-react';

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
                <Accordion styled fluid>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Spatial Discretization
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Table basic='very'>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell collapsing>No. of layers (nlay)</Table.Cell>
                                                <Table.Cell>{this.renderInfoPopup(documentation.nlay, 'nlay', 'left center')}</Table.Cell>
                                                <Table.Cell textAlign='right'>{mfPackage.nlay}</Table.Cell>
                                            </Table.Row>

                                            <Table.Row>
                                                <Table.Cell collapsing>No. of rows (nrow)</Table.Cell>
                                                <Table.Cell>{this.renderInfoPopup(documentation.nrow, 'nrow', 'left center')}</Table.Cell>
                                                <Table.Cell textAlign='right'>{mfPackage.nrow}</Table.Cell>
                                            </Table.Row>

                                            <Table.Row>
                                                <Table.Cell collapsing>No. of columns (ncol)</Table.Cell>
                                                <Table.Cell>{this.renderInfoPopup(documentation.ncol, 'ncol', 'left center')}</Table.Cell>
                                                <Table.Cell textAlign='right'>{mfPackage.ncol}</Table.Cell>
                                            </Table.Row>

                                            <Table.Row>
                                                <Table.Cell collapsing>Stress periods (nper)</Table.Cell>
                                                <Table.Cell>{this.renderInfoPopup(documentation.nper, 'nper', 'left center')}</Table.Cell>
                                                <Table.Cell textAlign='right'>{mfPackage.nper}</Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                </Grid.Column>
                                <Grid.Column>
                                    <Table basic='very'>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell collapsing>Row spacing (delr)</Table.Cell>
                                                <Table.Cell>{this.renderInfoPopup(documentation.delr, 'delr', 'left center')}</Table.Cell>
                                                <Table.Cell textAlign='right'>{JSON.stringify(mfPackage.delr)}</Table.Cell>
                                            </Table.Row>

                                            <Table.Row>
                                                <Table.Cell collapsing>Column spacing (delc)</Table.Cell>
                                                <Table.Cell>{this.renderInfoPopup(documentation.delc, 'delc', 'left center')}</Table.Cell>
                                                <Table.Cell textAlign='right'>{JSON.stringify(mfPackage.delc)}</Table.Cell>
                                            </Table.Row>

                                            <Table.Row>
                                                <Table.Cell collapsing>Confining bed (laycbd)</Table.Cell>
                                                <Table.Cell>{this.renderInfoPopup(documentation.laycbd, 'laycbd', 'left center')}</Table.Cell>
                                                <Table.Cell textAlign='right'>{JSON.stringify(mfPackage.laycbd)}</Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

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

                    <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Time Discretization
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    <Table basic='very'>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>#</Table.HeaderCell>
                                                <Table.HeaderCell>
                                                    <span>perlen </span>
                                                    <Popup className='popupFix'
                                                        trigger={
                                                            <Icon className='iconFix'
                                                              name='info'
                                                              circular
                                                              link
                                                            />}
                                                        content='Stress period lengths'
                                                        hideOnScroll
                                                        size='tiny'
                                                    />
                                                </Table.HeaderCell>
                                                <Table.HeaderCell>
                                                    <span>nstp </span>
                                                    <Popup className='popupFix'
                                                       trigger={
                                                           <Icon className='iconFix'
                                                                 name='info'
                                                                 circular
                                                                 link
                                                           />}
                                                        content='No. of time steps in stress period'
                                                        hideOnScroll
                                                        size='tiny'
                                                    />
                                                </Table.HeaderCell>
                                                <Table.HeaderCell>
                                                    <span>tsmult </span>
                                                    <Popup className='popupFix'
                                                       trigger={
                                                           <Icon className='iconFix'
                                                                 name='info'
                                                                 circular
                                                                 link
                                                           />}
                                                        content='Time step multiplier'
                                                        hideOnScroll
                                                        size='tiny'
                                                    />
                                                </Table.HeaderCell>
                                                <Table.HeaderCell>
                                                    <span>steady </span>
                                                    <Popup className='popupFix'
                                                       trigger={
                                                           <Icon className='iconFix'
                                                                 name='info'
                                                                 circular
                                                                 link
                                                           />}
                                                        content='State of stress period'
                                                        hideOnScroll
                                                        size='tiny'
                                                    />
                                                </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {mfPackage.perlen.map((perlen, idx) => (
                                                <Table.Row key={idx}>
                                                    <Table.Cell>{idx + 1}</Table.Cell>
                                                    <Table.Cell>{perlen}</Table.Cell>
                                                    <Table.Cell>{mfPackage.nstp[idx]}</Table.Cell>
                                                    <Table.Cell>{mfPackage.tsmult[idx]}</Table.Cell>
                                                    <Table.Cell>{mfPackage.steady[idx] ? <Icon name='checkmark' /> : <Icon name='close' />}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>
                </Accordion>

                <Segment basic>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={7}>
                                <Table basic='very'>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell collapsing>Time units (itmuni)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.itmuni, 'itmuni', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.itmuni}</Table.Cell>
                                        </Table.Row>

                                        <Table.Row>
                                            <Table.Cell collapsing>Length units (lenuni)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.lenuni, 'lenuni', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.lenuni}</Table.Cell>
                                        </Table.Row>

                                        <Table.Row>
                                            <Table.Cell collapsing>Filename extension</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.extension, 'extension', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.extension || ''}</Table.Cell>
                                        </Table.Row>

                                        <Table.Row>
                                            <Table.Cell collapsing>File unit number</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.unitnumber, 'unitnumber', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.unitnumber || ''}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            <Grid.Column width={9}>
                                <Table basic='very'>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell collapsing>Upper left corner x coordinate (xul)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.xul, 'xul', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.xul || ''}</Table.Cell>
                                        </Table.Row>

                                        <Table.Row>
                                            <Table.Cell collapsing>Upper left corner y coordinate (yul)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.yul, 'yul', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.yul || ''}</Table.Cell>
                                        </Table.Row>

                                        <Table.Row>
                                            <Table.Cell collapsing>Rotation</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.rotation, 'rotation', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.rotation || 0}</Table.Cell>
                                        </Table.Row>

                                        <Table.Row>
                                            <Table.Cell collapsing>Coordinate system (proj4_str)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.proj4_str, 'proj4_str', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.proj4_str || ''}</Table.Cell>
                                        </Table.Row>

                                        <Table.Row>
                                            <Table.Cell collapsing>Starting date time (start_dateteim)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.start_datetime, 'start_datetime', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.start_datetime || ''}</Table.Cell>
                                        </Table.Row>

                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
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
