import React, {MouseEvent, SyntheticEvent, useState} from 'react';
import {Accordion, AccordionTitleProps, DropdownProps, Form, Grid, Header, Icon, Input, Label} from 'semantic-ui-react';
import {FlopyModflowMfbas} from '../../../../../../core/model/flopy/packages/mf';
import {Array2D} from '../../../../../../core/model/geometry/Array2D.type';
import {GridSize, Soilmodel} from '../../../../../../core/model/modflow';
import {ILegendItemDiscrete} from '../../../../../../services/rainbowvis/types';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {PopupPosition} from '../../../../../types';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfbas;
    onChange: (p: FlopyModflowMfbas) => any;
    onClickEdit: (layer: string, set: string, parameter: string) => any;
    readonly: boolean;
    gridSize: GridSize;
    soilmodel: Soilmodel;
}

const basPackageProperties = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const handleClickAccordion = (e: MouseEvent, titleProps: AccordionTitleProps) => {
        const {index} = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        if (typeof newIndex === 'number') {
            return setActiveIndex(newIndex);
        }
    };

    const handleClickEdit = (layer: string, set: string, parameter: string) => () =>
        props.onClickEdit(layer, set, parameter);

    const handleOnSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        const cMfPackage = props.mfPackage.toObject();
        if (cMfPackage.hasOwnProperty(name)) {
            cMfPackage[name] = value;
            return props.onChange(FlopyModflowMfbas.fromObject(cMfPackage));
        }
    };

    const renderIBoundImage = (data: number | Array2D<number>, idx: number) => {
        const layers = props.soilmodel.layersCollection.all;

        if (layers[idx]) {
            return (
                <Grid.Column key={idx}>
                    <div>
                        <Label>{layers[idx].number}: {layers[idx].name}</Label>
                        <Icon
                            link={true}
                            style={{float: 'right', zIndex: 10000}}
                            name="edit"
                            onClick={handleClickEdit(layers[idx].id, 'bas', 'ibound')}
                        />
                        <div style={{clear: 'both'}}/>
                    </div>
                    <RasterDataImage
                        data={data}
                        gridSize={Array.isArray(data) ? GridSize.fromData(data) : props.gridSize}
                        unit={''}
                        legend={[
                            {value: -1, color: 'red', label: 'constant'},
                            {value: 0, color: 'white', label: 'no modflow'},
                            {value: 1, color: 'blue', label: 'flow'},
                        ] as ILegendItemDiscrete[]}
                    />
                </Grid.Column>
            );
        }
        return null;
    };

    const renderStrtImage = (data: number | Array2D<number>, idx: number) => {
        const layers = props.soilmodel.layersCollection.all;

        if (layers[idx]) {
            return (
                <Grid.Column key={idx}>
                    <div>
                        <label style={{float: 'left'}}>{layers[idx].number}: {layers[idx].name}</label>
                        <Icon
                            link={true}
                            style={{float: 'right', zIndex: 10000}}
                            name="edit"
                            onClick={handleClickEdit(layers[idx].id, 'bas', 'strt')}
                        />
                        <div style={{clear: 'both'}}/>
                    </div>
                    <RasterDataImage
                        data={data}
                        gridSize={Array.isArray(data) ? GridSize.fromData(data) : props.gridSize}
                        unit={'m'}
                    />
                </Grid.Column>
            );
        }
        return null;
    };

    return (
        <div>
            <Header as={'h3'} dividing={true}>BAS: Basic Package</Header>
            <Accordion styled={true} fluid={true}>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClickAccordion}>
                    <Icon name="dropdown"/>
                    Boundary variable (ibound)
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    <Grid>
                        <Grid.Row columns={2}>
                            {
                                Array.isArray(props.mfPackage.ibound) ?
                                    props.mfPackage.ibound.map((d, idx) => renderIBoundImage(d, idx)) :
                                    renderIBoundImage(props.mfPackage.ibound, 0)
                            }
                        </Grid.Row>
                    </Grid>
                </Accordion.Content>
                <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClickAccordion}>
                    <Icon name="dropdown"/>
                    Starting Head
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    <Grid>
                        <Grid.Row columns={2}>
                            {
                                Array.isArray(props.mfPackage.strt) ?
                                    props.mfPackage.strt.map((d, idx) => renderStrtImage(d, idx)) :
                                    renderStrtImage(props.mfPackage.strt, 0)
                            }
                        </Grid.Row>
                    </Grid>
                </Accordion.Content>
            </Accordion>
            <Grid style={{marginTop: '10px'}}>
                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Form.Group>
                                <Form.Field>
                                    <label>Flow between chd cells (ICHFLG)</label>
                                    <Form.Dropdown
                                        options={[
                                            {key: 0, value: true, text: 'true'},
                                            {key: 1, value: false, text: 'false'},
                                        ]}
                                        placeholder="Select ichflg"
                                        name="ichflg"
                                        selection={true}
                                        value={props.mfPackage.ichflg}
                                        disabled={props.readonly}
                                        onChange={handleOnSelect}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>&nbsp;</label>
                                    {renderInfoPopup(documentation.bas.ichflg, 'ICHFLG', PopupPosition.TOP_LEFT, true)}
                                </Form.Field>
                                <Form.Field>
                                    <label>Head assigned to all no flow cells (HNOFLO)</label>
                                    <Form.Input
                                        readOnly={true}
                                        type={'number'}
                                        name="hnoflo"
                                        value={props.mfPackage.hnoflo}
                                        icon={renderInfoPopup(documentation.bas.hnoflo, 'HNOFLO')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Budget percent discrepancy (STOPER)</label>
                                    <Input
                                        readOnly={true}
                                        name="stoper"
                                        value={props.mfPackage.stoper || ''}
                                        icon={renderInfoPopup(documentation.bas.stoper, 'STOPER')}
                                    />
                                </Form.Field>
                            </Form.Group>

                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

export default basPackageProperties;
