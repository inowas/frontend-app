import PropTypes from 'prop-types';
import React from 'react';
import {Button, Form, Grid, Input, Radio, Header, List, Segment} from 'semantic-ui-react';
import RasterDataImage from './rasterDataImage';
import {getGridSize} from './helpers';

const styles = {
    input: {
        backgroundColor: 'transparent',
        padding: 0
    }
};

class RasterfileUpload extends React.Component {
    state = {
        'selectedBand': 0,
    };

    handleRadioChange = (e, {value}) => {
        this.setState(prevState => {
            return {
                ...prevState, selectedBand: value
            };
        });
    };

    handleSave = () => {
        const {uploadedFile} = this.props;

        if (!uploadedFile) {
            return null;
        }

        this.props.onSave(uploadedFile.data[this.state.selectedBand]);
        return null;
    };


    renderMetaData = (file) => {
        if (!file) {
            return null;
        }

        const {hash, metadata} = file;

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

    renderBands = (file) => {
        if (!file) {
            return null;
        }

        const {data} = file;

        const bands = data.map((e, key) => (
            <Form.Field key={key}>
                <Radio
                    label={'Band ' + key}
                    name="radioGroup"
                    value={key}
                    checked={this.state.selectedBand === key}
                    onChange={this.handleRadioChange}
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

    renderImage = (file) => {
        if (!file) {
            return null;
        }

        const {data} = file;

        return (
            <Segment color={'green'}>
                <RasterDataImage data={data[this.state.selectedBand]} unit={this.props.unit}
                                 gridSize={getGridSize(data[this.state.selectedBand])}/>
            </Segment>
        );
    };

    render() {
        const {uploadedFile} = this.props;

        return (
            <Grid divided={'vertically'}>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Segment color={'green'}>
                            <Header as="h3" style={{'textAlign': 'left'}}>Important</Header>
                            <List bulleted>
                                <List.Item>The rasterfile should have the same bounds as the model area.</List.Item>
                                <List.Item>The gridsize will interpolated automatically.</List.Item>
                            </List>
                            <Input style={styles.input} type="file" onChange={this.props.handleFileUpload}/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        {this.renderMetaData(uploadedFile)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        {this.renderBands(uploadedFile)}
                    </Grid.Column>
                    <Grid.Column>
                        {this.renderImage(uploadedFile)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <Button.Group>
                            <Button onClick={this.handleSave} positive>Save</Button>
                            <Button.Or/>
                            <Button onClick={this.props.onCancel}>Cancel</Button>
                        </Button.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

RasterfileUpload.propTypes = {
    handleFileUpload: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    unit: PropTypes.string.isRequired,
    uploadedFile: PropTypes.object,
};

export default RasterfileUpload;
