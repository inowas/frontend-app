import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {Background, Chart, Info, Parameters} from '../components/index';
import image from '../images/T01.png';

import PapaParse from 'papaparse';
import {ParseResult} from 'papaparse';
import {Breadcrumb, Grid, Icon} from 'semantic-ui-react';
import AppContainer from '../../shared/AppContainer';
import ToolGrid from '../../shared/simpleTools/ToolGrid';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import csvFile from '../data/2018-10-25-mar-in-scales.csv';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t01-sat-basin-infiltration-capacity-reduction-database/',
    icon: <Icon name="file"/>
}];

// tslint:disable-next-line:no-empty-interface
type IProps = RouteComponentProps

const T01 = (props: IProps) => {

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        loadCsvFile();
    }, []);

    const loadCsvFile = () => {
        PapaParse.parse(csvFile, {
            download: true,
            delimiter: ';',
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
            complete: (parsedObject: ParseResult<{ x: any, y: any, selected: null | any }>) => {
                const d = parsedObject.data.map((row, key) => {
                    row.x = row.x.split(';').map((v: any) => parseInt(v, 10));
                    row.y = row.y.split(';').map((v: any) => parseFloat(v));
                    key < 3 ? row.selected = true : row.selected = false;
                    return row;
                });
                setData(d);
            }
        });
    };

    const toggleSelect = (name: string) => {
        if (!data) {
            return;
        }

        const d = data.map((row: any) => {
            if (row.name === name) {
                row.selected = !row.selected;
            }

            return row;
        });

        setData(d);
    };

    const handleReset = () => {
        loadCsvFile();
    };

    if (!data) {
        return null;
    }

    return (
        <AppContainer navbarItems={navigation}>
            <Grid padded={true}>
                <Grid.Column style={{paddingTop: '0.3em'}}>
                    <Breadcrumb>
                        <Breadcrumb.Section link={true} onClick={() => props.history.push('/tools')}>
                            Tools
                        </Breadcrumb.Section>
                        <Breadcrumb.Divider icon="right chevron"/>
                        <Breadcrumb.Section active={true}>
                            T01. SAT basin infiltration capacity reduction database
                        </Breadcrumb.Section>
                    </Breadcrumb>
                </Grid.Column>
            </Grid>
            <ToolGrid rows={2}>
                <Background title={'T01. SAT basin infiltration capacity reduction database'} image={image}/>
                <Chart data={data}/>
                <Info data={data}/>
                <Parameters data={data} toggleSelect={toggleSelect} handleReset={handleReset}/>
            </ToolGrid>
        </AppContainer>
    );

};

export default withRouter(T01);
