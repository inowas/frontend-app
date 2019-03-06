import React from 'react';

import PivotTableUI from 'react-pivottable/PivotTableUI';
import '../styles/pivottable.css';

import PapaParse from 'papaparse';
import csvFile from '../data/database-2018-01-05.csv';

import AppContainer from 'scenes/shared/AppContainer';
import {Grid, Icon, Container, Breadcrumb} from 'semantic-ui-react';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t04a-database-for-gis-based-suitability-mapping/',
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

    renderBreadcrumbs = () => (
        <Breadcrumb>
            <Breadcrumb.Section link onClick={() => this.props.history.push('/tools')}>Tools</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right chevron'/>
            <Breadcrumb.Section active>T04. Database for GIS Based Site Suitability Mapping</Breadcrumb.Section>
        </Breadcrumb>
    );

    render() {
        const {data} = this.state;
        if (!data) {
            return null;
        }

        return (
            <AppContainer navbarItems={navigation}>
                <div style={{width: '1250px', margin: '0 auto'}}>
                    <Grid padded>
                        <Grid.Column style={{paddingTop: '0.3em', paddingLeft: 0}}>
                            {this.renderBreadcrumbs()}
                        </Grid.Column>
                    </Grid>
                <Grid padded>
                    <Grid.Row>
                        <Container fluid className='tablewrap'>
                            <PivotTableUI data={data} onChange={s => this.setState(s)} {...this.state} />
                        </Container>
                    </Grid.Row>
                </Grid>
                </div>
            </AppContainer>
        );
    }
}

export default T04;