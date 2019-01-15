import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/mcda';
import {Criterion} from 'core/mcda/criteria';
import {Form, Grid, List, Header, Input, Radio, Segment} from 'semantic-ui-react';
import {fetchRasterfile, uploadRasterfile} from 'services/api';
import CriteriaRasterMap from './criteriaRasterMap';

const styles = {
    input: {
        backgroundColor: 'transparent',
        padding: 0
    }
};

class CriteriaRasterUpload extends React.Component {
    state = {
        hash: null,
        metadata: null,
        data: this.props.criterion.data || null,
        selectedBand: 0,
        errorFetching: false,
        errorUploading: false,
    };

    renderMetaData = () => {
        const {hash, metadata} = this.state;
        if (!hash || !metadata) {
            return null;
        }

        console.log(metadata);

        return (
            <Segment color="blue">
                <Header as="h3" style={{'textAlign': 'left'}}>Metadata</Header>
                <List>
                    <List.Item>
                        <List.Icon name="hashtag"/>
                        <List.Content>{hash}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="attach"/>
                        <List.Content>{metadata.driver}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="marker"/>
                        <List.Content>X: {metadata.origin[0]}, Y: {metadata.origin[1]}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="resize horizontal"/>
                        <List.Content>{metadata.pixelSize[0]}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="resize vertical"/>
                        <List.Content>{metadata.pixelSize[1]}</List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name="map outline"/>
                        <List.Content>{metadata.projection}</List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name="grid layout"/>
                        <List.Content>
                            X: {metadata.rasterXSize}, Y: {metadata.rasterYSize}, Z: {metadata.rasterCount}
                        </List.Content>
                    </List.Item>
                </List>
            </Segment>
        );
    };

    renderBands = () => {
        const {data, selectedBand} = this.state;
        const bands = data.map((e, key) => (
            <Form.Field key={key}>
                <Radio
                    label={'Band ' + key}
                    name="radioGroup"
                    value={key}
                    checked={selectedBand === key}
                    onChange={(e, {value}) => this.setState({selectedBand: value})}
                />
            </Form.Field>
        ));

        return (
            <Segment color="blue">
                <Header as="h3" style={{'textAlign': 'left'}}>Data</Header>
                {bands}
            </Segment>
        );
    };

    handleUploadFile = e => {
        const files = e.target.files;
        const file = files[0];

        uploadRasterfile(file,
            ({hash}) => {
                this.setState({fetching: true, hash});
                fetchRasterfile(
                    {
                        hash,
                        width: this.props.mcda.constraints.gridSize.nX,
                        height: this.props.mcda.constraints.gridSize.nY
                    },
                    ({data, metadata}) => this.setState({data, metadata}, this.props.onChange(data)),
                    (errorFetching) => this.setState({errorFetching}))
            },
            (errorUploading) => this.setState({errorUploading})
        );
    };

    renderUpload() {
        return (
            <Segment color={'green'}>
                <Header as="h3" style={{'textAlign': 'left'}}>Important</Header>
                <List bulleted>
                    <List.Item>The rasterfile should have the same bounds as the model
                        area.</List.Item>
                    <List.Item>The gridsize will interpolated automatically.</List.Item>
                </List>
                <Input style={styles.input} type="file" onChange={this.handleUploadFile}/>
            </Segment>
        );
    }

    render() {
        const {data, selectedBand} = this.state;
        const {mcda} = this.props;

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {this.renderUpload()}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={6}>
                        {data && this.renderBands()}
                        {this.renderMetaData()}
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Segment color={'green'}>
                            <CriteriaRasterMap
                                data={data ? data[selectedBand] : []}
                                map={mcda.constraints}
                            />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

CriteriaRasterUpload.proptypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    onChange: PropTypes.func.isRequired
};

export default withRouter(CriteriaRasterUpload);