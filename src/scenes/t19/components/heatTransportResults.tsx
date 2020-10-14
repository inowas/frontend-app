import _ from 'lodash';
import moment from 'moment';
import React, {MouseEvent, useEffect, useState} from 'react';
import {Label, ReferenceDot, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from 'recharts';
import {Button, Checkbox, Icon, Menu, MenuItemProps, Segment, Table} from 'semantic-ui-react';
import {SemanticCOLORS} from 'semantic-ui-react/dist/commonjs/generic';
import {downloadFile} from '../../shared/simpleTools/helpers';
import {IHeatTransportResults} from '../../../core/model/htm/Htm.type';

interface IProps {
    results: IHeatTransportResults;
}

const HeatTransportResults = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [timesteps, setTimesteps] = useState<[number, number]>([0, 0]);
    const [useSameTimes, setUseSameTimes] = useState<boolean>(true);

    useEffect(() => {
        const ts = props.results.data.map((row) => row.date);
        const fTs = _.orderBy(_.uniq(ts));
        const min = moment(fTs[0]).unix();
        const max = moment(fTs[fTs.length - 1]).unix();
        setTimesteps([min, max]);
    }, [props.results]);

    const traveltimes = props.results.traveltimes;

    const handleChangeCheckbox = () => setUseSameTimes(!useSameTimes);

    const handleClickMenuItem = (e: MouseEvent, {index}: MenuItemProps) =>
        setActiveIndex(typeof index === 'number' ? index : 0);

    const exportData = (arrayOfObjects: Array<{ [key: string]: any }>, filename: string) => () => {
        if (arrayOfObjects.length < 1) {
            return null;
        }
        const keys = Object.keys(arrayOfObjects[0]);
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += keys.join(',');
        csvContent += '\r\n';
        arrayOfObjects.forEach((row) => {
            csvContent += Object.values(row).join(',');
            csvContent += '\r\n';
        });
        const encodedUri = encodeURI(csvContent);

        downloadFile(`${filename}.csv`, encodedUri);
    };

    const renderChart = (type: string, dataObs: Array<{ x: number, y: number }>,
                         dataSim: Array<{ x: number, y: number }>) => {
        const RENDER_NO_SHAPE = () => null;

        const formatDateTimeTicks = (dt: number) => {
            return moment.unix(dt).format('YYYY-MM-DD');
        };

        const filteredPoints: Array<{
            fill: SemanticCOLORS,
            x: number,
            y: number,
            type: string
        }> = props.results.points.filter((point) => point.label.includes(type)).map((point) => ({
            fill: point.point_type === 'max' ? 'red' : (point.point_type === 'min' ? 'green' : 'blue'),
            x: moment(point.date).unix(),
            y: point.simulated,
            type: point.point_type
        }));

        return (
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'x'}
                        domain={useSameTimes ? timesteps : ['auto', 'auto']}
                        name={'Date Time'}
                        tickFormatter={formatDateTimeTicks}
                        type={'number'}
                    />
                    <YAxis
                        label={{value: 'T', angle: -90, position: 'insideLeft'}}
                        dataKey={'y'}
                        name={''}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                    <Scatter
                        data={dataObs}
                        line={{strokeWidth: 2, stroke: '#db3434'}}
                        lineType={'joint'}
                        name={'observed'}
                        shape={<RENDER_NO_SHAPE/>}
                    />
                    <Scatter
                        data={dataSim}
                        line={{strokeWidth: 2, stroke: '#3498DB'}}
                        lineType={'joint'}
                        name={'simulated'}
                        shape={<RENDER_NO_SHAPE/>}
                    />
                    {filteredPoints.map((point, key) => (
                        <ReferenceDot
                            key={key}
                            label={
                                <Label
                                    fill={point.fill}
                                    fontSize={12}
                                    offset={5}
                                    position="top"
                                    value={point.type}
                                />
                            }
                            x={point.x}
                            y={point.y}
                            r={10}
                            fill={point.fill}
                            fillOpacity={0.4}
                            stroke="none"
                        />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
        );
    };

    const renderGraph = () => {
        const dataSw = props.results.data.filter((row) => row.type === 'surface-water');
        const dataSwObs = dataSw.map((row) => ({
            x: moment(row.date).unix(),
            y: row.observed
        }));
        const dataSwSim = dataSw.map((row) => ({
            x: moment(row.date).unix(),
            y: row.simulated
        }));

        const dataGw = props.results.data.filter((row) => row.type === 'groundwater');
        const dataGwObs = dataGw.map((row) => ({
            x: moment(row.date).unix(),
            y: row.observed
        }));
        const dataGwSim = dataGw.map((row) => ({
            x: moment(row.date).unix(),
            y: row.simulated
        }));

        return (
            <React.Fragment>
                <Checkbox
                    label="Use same time scale"
                    onChange={handleChangeCheckbox}
                    checked={useSameTimes}
                    toggle={true}
                />
                <h3>groundwater</h3>
                {renderChart('groundwater', dataGwObs, dataGwSim)}
                <div className="downloadButtons">
                    <Button
                        compact={true}
                        basic={true}
                        icon={true}
                        size={'small'}
                        onClick={exportData(props.results.data, 'chart')}
                    >
                        <Icon name="download"/> CSV
                    </Button>
                </div>
                <h3>surface-water</h3>
                {renderChart('surface-water', dataSwObs, dataSwSim)}
            </React.Fragment>
        );
    };

    const renderData = (data: Array<{ type: string } & { [key: string]: number }>) => {
        const dataSw = data.filter((row) => row.type === 'surface-water');
        const dataGw = data.filter((row) => row.type === 'groundwater');

        if (dataSw.length < 1 || dataGw.length < 1) {
            return;
        }

        const keys: string[] = [];
        data.forEach((row) => {
            const rowKeys = Object.keys(row);
            rowKeys.forEach((k) => {
                if (k !== 'type' && !keys.includes(k)) {
                    keys.push(k);
                }
            });
        });

        return (
            <Table celled={true} selectable={true}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell rowSpan={2}/>
                        <Table.HeaderCell rowSpan={2}>Surface Water (IN)</Table.HeaderCell>
                        <Table.HeaderCell rowSpan={2}>Groundwater (OUT)</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {keys.map((name, key) => (
                        <Table.Row key={key}>
                            <Table.Cell>{name}</Table.Cell>
                            <Table.Cell>{dataSw[0].hasOwnProperty(name) ? dataSw[0][name] : 'NULL'}</Table.Cell>
                            <Table.Cell>{dataGw[0].hasOwnProperty(name) ? dataGw[0][name] : 'NULL'}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    };

    const renderSineFitResults = () => (
        <React.Fragment>
            <div className="downloadButtons">
                <Button
                    compact={true}
                    basic={true}
                    icon={true}
                    size={'small'}
                    onClick={exportData(traveltimes, 'traveltimes')}
                >
                    <Icon name="download"/> CSV
                </Button>
            </div>
            <Table celled={true} selectable={true}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell rowSpan={2}/>
                        <Table.HeaderCell rowSpan={2}>Surface Water (IN)</Table.HeaderCell>
                        <Table.HeaderCell rowSpan={2}>Groundwater (OUT)</Table.HeaderCell>
                        <Table.HeaderCell colSpan={2}>Residence Time [d]</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>Thermal</Table.HeaderCell>
                        <Table.HeaderCell>Hydraulic</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {traveltimes.map((traveltime, key) => {
                        const keys = Object.keys(traveltime);
                        const keySw = keys.filter((k) => k.includes('surface-water'));
                        const keyGw = keys.filter((k) => k.includes('groundwater'));

                        return (
                            <Table.Row key={key}>
                                <Table.Cell>{traveltime.point_type}</Table.Cell>
                                <Table.Cell>{keySw.length > 0 ? traveltime[keySw[0]] : 'NULL'}</Table.Cell>
                                <Table.Cell>{keyGw.length > 0 ? traveltime[keyGw[0]] : 'NULL'}</Table.Cell>
                                <Table.Cell>{traveltime.traveltime_thermal_days}</Table.Cell>
                                <Table.Cell>{traveltime.traveltime_hydraulic_days}</Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </React.Fragment>
    );

    const renderContent = () => {
        switch (activeIndex) {
            case 0:
                return renderGraph();
            case 1:
                return (
                    <React.Fragment>
                        <div className="downloadButtons">
                            <Button
                                compact={true}
                                basic={true}
                                icon={true}
                                size={'small'}
                                onClick={exportData(props.results.paras, 'parameters')}
                            >
                                <Icon name="download"/> CSV
                            </Button>
                        </div>
                        {renderData(props.results.paras)}
                    </React.Fragment>
                );
            case 2:
                return (
                    <React.Fragment>
                        <div className="downloadButtons">
                            <Button
                                compact={true}
                                basic={true}
                                icon={true}
                                size={'small'}
                                onClick={exportData(props.results.gof, 'goodnessOfFit')}
                            >
                                <Icon name="download"/> CSV
                            </Button>
                        </div>
                        {renderData(props.results.gof)}
                    </React.Fragment>
                );
            case 3:
                return renderSineFitResults();
            default:
                return null;
        }
    };

    return (
        <React.Fragment>
            <Menu attached="top" tabular={true}>
                <Menu.Item
                    active={activeIndex === 0}
                    index={0}
                    name="Graph"
                    onClick={handleClickMenuItem}
                />
                <Menu.Item
                    active={activeIndex === 1}
                    index={1}
                    name="Optimization Parameters"
                    onClick={handleClickMenuItem}
                />
                <Menu.Item
                    active={activeIndex === 2}
                    index={2}
                    name="Goodness of Fit"
                    onClick={handleClickMenuItem}
                />
                <Menu.Item
                    active={activeIndex === 3}
                    index={3}
                    name="Sine Fit Results"
                    onClick={handleClickMenuItem}
                />
            </Menu>
            <Segment attached="bottom">
                {renderContent()}
            </Segment>
        </React.Fragment>
    );
};

export default HeatTransportResults;
