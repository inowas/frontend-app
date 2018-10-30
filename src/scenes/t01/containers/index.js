import React from 'react';
import image from '../images/T01.png';
import {Background, Chart, Parameters, Info} from '../components/index';

import PapaParse from 'papaparse';
import {Container, Grid, Icon} from "semantic-ui-react";
import csvFile from '../data/2018-10-25-mar-in-scales.csv';
import AppContainer from "../../shared/AppContainer";

const styles = {
    container: {
        padding: '25px 40px 0 40px',
        width: '1280px'
    },
    columnContainer: {
        background: '#fff',
        boxShadow: '0 0 2px 0 rgba(76, 76, 76, 0.3)',
        height: '100%',
        padding: '12px'
    }
};

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
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Container style={styles.columnContainer}>
                                <Background title={'T01. SAT basin infiltration capacity reduction database'} image={image}/>
                            </Container>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Container style={styles.columnContainer}>
                                <Chart data={data}/>
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Container style={styles.columnContainer}>
                                <Info data={data}/>
                            </Container>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Container style={styles.columnContainer}>
                                <Parameters
                                    data={data}
                                    toggleSelect={this.toggleSelect}
                                    handleReset={this.handleReset}
                                />
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </AppContainer>
        );
    }
}

export default T01;
