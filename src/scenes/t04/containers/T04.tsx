import React, {useEffect, useState} from 'react';

import '../styles/pivottable.css';

import PapaParse from 'papaparse';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PivotTableUI from 'react-pivottable/PivotTableUI';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import csvFile from '../data/database-2018-01-05.csv';

import {Breadcrumb, Container, Grid, Icon} from 'semantic-ui-react';
import {useHistory} from 'react-router-dom';
import AppContainer from '../../../scenes/shared/AppContainer';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t04a-database-for-gis-based-suitability-mapping/',
    icon: <Icon name="file"/>
}];

const T04 = () => {

    const [data, setData] = useState<any>(null);
    const [s, setS] = useState<any>(null);
    const history = useHistory();

    useEffect(() => {
        PapaParse.parse(csvFile, {
            download: true,
            delimiter: ',',
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
            complete: (parsedObject) => {
                setData(parsedObject.data);
            }
        });
    }, []);

    const renderBreadcrumbs = () => (
        <Breadcrumb>
            <Breadcrumb.Section link onClick={() => history.push('/tools')}>Tools</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right chevron'/>
            <Breadcrumb.Section active>T04. Database for GIS Based Site Suitability Mapping</Breadcrumb.Section>
        </Breadcrumb>
    );

    const onChange = (s: any) => {
        setS(s);
    };

    return (
        <AppContainer navbarItems={navigation}>
            <div style={{width: '1250px', margin: '0 auto'}}>
                <Grid padded>
                    <Grid.Column style={{paddingTop: '0.3em', paddingLeft: 0}}>
                        {renderBreadcrumbs()}
                    </Grid.Column>
                </Grid>
                <Grid padded>
                    <Grid.Row>
                        <Container fluid className='tablewrap'>
                            {data && <PivotTableUI data={data} onChange={onChange} {...s}/>}
                        </Container>
                    </Grid.Row>
                </Grid>
            </div>
        </AppContainer>
    );
};

export default T04;
