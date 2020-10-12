import moment from 'moment';
import React, {MouseEvent, useState} from 'react';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Accordion, AccordionTitleProps, Icon, Table} from 'semantic-ui-react';
import {IHeatTransportResults} from './types';

interface IProps {
    results: IHeatTransportResults;
}

const heatTransportResults = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const traveltimes = props.results.traveltimes;

    const handleClickAccordion = (e: MouseEvent, {index}: AccordionTitleProps) =>
        setActiveIndex(typeof index === 'number' ? index : 0);

    const renderChart = (dataObs: Array<{ x: number, y: number }>, dataSim: Array<{ x: number, y: number }>) => {
        const RENDER_NO_SHAPE = () => null;

        const formatDateTimeTicks = (dt: number) => {
            return moment.unix(dt).format('YYYY-MM-DD');
        };

        return (
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'x'}
                        domain={['auto', 'auto']}
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
                <h3>groundwater</h3>
                {renderChart(dataGwObs, dataGwSim)}
                <h3>surface-water</h3>
                {renderChart(dataSwObs, dataSwSim)}
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
    );

    return (
        <Accordion fluid={true} styled={true}>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClickAccordion}>
                <Icon name="dropdown"/>
                Graph
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>{renderGraph()}</Accordion.Content>
            <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClickAccordion}>
                <Icon name="dropdown"/>
                Optimization Parameters
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>{renderData(props.results.paras)}</Accordion.Content>
            <Accordion.Title active={activeIndex === 2} index={2} onClick={handleClickAccordion}>
                <Icon name="dropdown"/>
                Goodness of Fit
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 2}>{renderData(props.results.gof)}</Accordion.Content>
            <Accordion.Title active={activeIndex === 3} index={3} onClick={handleClickAccordion}>
                <Icon name="dropdown"/>
                Sine Fit Results
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 3}>{renderSineFitResults()}</Accordion.Content>
        </Accordion>
    );
};

export default heatTransportResults;
