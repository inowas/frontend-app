import React from 'react';

import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';

import PapaParse from 'papaparse';
import csvFile from '../data/database-2018-01-05.csv';

import AppContainer from "scenes/shared/AppContainer";
import {Icon} from "semantic-ui-react";

const styles = {
    heading: {
        fontWeight: 300,
        fontSize: 16,
        textAlign: 'left',
        paddingBottom: 10
    },
    table: {
        paddingTop: 20}
};

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t04a-database-for-gis-based-suitability-mapping/',
    icon: <Icon name="file"/>
}];


class T04 extends React.Component {

    constructor(props) {
        super(props);
        this.loadCsvFile();
        this.state = {
            data: null
        }
    }

    loadCsvFile = () => {
        PapaParse.parse(csvFile, {
            download: true,
            delimiter: ',',
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
            complete: (parsedObject) => {
                this.setState({data: parsedObject.data});
            }
        });
    };

    render() {
        const {data} = this.state;
        if (!data) {
            return null;
        }

        return (
            <AppContainer navbarItems={navigation}>
                <h3 style={styles.heading}>
                    T04. Database for GIS Based Site Suitability Mapping
                </h3>
                <div style={styles.table}>
                    <PivotTableUI data={data} onChange={s => this.setState(s)} {...this.state} />
                </div>
            </AppContainer>
        );
    }
}

export default T04;
