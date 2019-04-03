import React from 'react';
import image from '../images/T01.png';
import {Background, Chart, Parameters, Info} from '../components/index';

import PapaParse from 'papaparse';
import {Icon, Breadcrumb, Grid} from 'semantic-ui-react';
import csvFile from '../data/2018-10-25-mar-in-scales.csv';
import AppContainer from '../../shared/AppContainer';
import ToolGrid from '../../shared/simpleTools/ToolGrid';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/',
    icon: <Icon name="file"/>
}];

class T01 extends React.Component {

    constructor() {
        super();
        this.loadCsvFile();
        this.state = {data: null};
    }

    loadCsvFile = () => {
        PapaParse.parse(csvFile, {
            download: true,
            delimiter: ';',
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
            complete: (parsedObject) => {
                return this.setState({
                    data: parsedObject.data.map((row, key) => {
                        row.x = row.x.split(';').map(v => parseInt(v, 10));
                        row.y = row.y.split(';').map(v => parseFloat(v));
                        key < 3 ? row.selected = true : row.selected = false;
                        return row;
                    })
                })
            }
        });
    };

    renderBreadcrumbs = () => (
        <Breadcrumb size='large'>
            <Breadcrumb.Section link>Tools</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right angle'/>
            <Breadcrumb.Section active>T01. SAT basin infiltration capacity reduction database</Breadcrumb.Section>
        </Breadcrumb>
    );

    toggleSelect = (name) => {
        const data = this.state.data.map(row => {
            if (row.name === name) {
                row.selected = !row.selected;
            }

            return row;
        });

        return this.setState({data: data});
    };

    handleReset = () => {
        this.setState({data: this.loadCsvFile()});
    };

    render() {
        const {data} = this.state;
        if (!data) {
            return null;
        }
        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded>
                    <Grid.Column style={{paddingTop: '0.3em'}}>
                        {this.renderBreadcrumbs()}
                    </Grid.Column>
                </Grid>
                <ToolGrid rows={2}>
                    <Background title={'T01. SAT basin infiltration capacity reduction database'} image={image}/>
                    <Chart data={data}/>
                    <Info data={data}/>
                    <Parameters data={data} toggleSelect={this.toggleSelect} handleReset={this.handleReset} />
                </ToolGrid>
            </AppContainer>
        );
    }
}

export default T01;
