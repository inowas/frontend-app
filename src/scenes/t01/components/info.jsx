import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {Header} from 'semantic-ui-react';

const Info = ({data}) => {
    const barChartData1 = [];
    data.forEach(row => {
        if (row.selected) {
            barChartData1.push({
                name: row.name,
                micr: row.micr,
                reduction: row.reduction
            });
        }
    });

    const barChartData2 = [];
    data.forEach(row => {
        if (row.selected) {
            barChartData2.push({
                name: row.name,
                lpsv: row.lpsv,
                dpsv: row.dpsv
            });
        }
    });

    return (
        <div>
            <div>
                <Header as="h3" textAlign='center'>Infiltration capacity reduction</Header>
                <ResponsiveContainer width={'100%'} aspect={1.5}>
                    <BarChart data={barChartData1} margin={{top: 5, right: 30, left: 0, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Legend/>
                        <XAxis dataKey="name" tick={{fill: '#B5B5B5', fontSize: 'small', transform: 'translate(0, 5)'}}/>
                        <YAxis tick={{fill: '#B5B5B5', fontSize: 'small', transform: 'translate(-3, 0)'}}/>
                        <Tooltip/>
                        <Bar dataKey="micr" fill="#1EB1ED" name="Maximum infiltration capacity reduction"
                             unit={'% or %/m'}
                        />
                        <Bar dataKey="reduction" fill="#ED8D05"
                             name="Infiltration capacity reduction/specific volume" unit={'%*m²/m³'}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <Header as="h3" textAlign='center'>Proportion of infiltration capacity phases</Header>
            <ResponsiveContainer width={'100%'} aspect={1.5}>
                <BarChart data={barChartData2} margin={{top: 5, right: 30, left: 0, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name" tick={{fill: '#B5B5B5', fontSize: 'small', transform: 'translate(0, 5)'}}/>
                    <Legend/>
                    <YAxis tick={{fill: '#B5B5B5', fontSize: 'small', transform: 'translate(-3, 0)'}}/>
                    <Tooltip/>
                    <Bar dataKey="lpsv" fill="#1EB1ED" name="Lag phase" unit={'m³/m²'}/>
                    <Bar dataKey="dpsv" fill="#ED8D05" name="Deep phase" unit={'m³/m²'}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

Info.propTypes = {
    data: PropTypes.array.isRequired
};

export default pure(Info);
