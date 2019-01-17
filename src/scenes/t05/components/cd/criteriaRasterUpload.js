import React from 'react';
import PropTypes from 'prop-types';
import {Criterion} from 'core/mcda/criteria';
import {Grid, Button, Icon, Message} from 'semantic-ui-react';
import RasterfileUploadModal from '../../../shared/rasterData/rasterfileUploadModal';
import CriteriaRasterMap from './criteriaRasterMap';
import {Raster} from 'core/mcda/gis';

class CriteriaRasterUpload extends React.Component {
    state = {
        hash: null,
        metadata: null,
        selectedBand: 0,
        showInfo: true,
        showUploadModal: false,
        errorFetching: false,
        errorUploading: false,
    };

    handleDismiss = () => this.setState({showInfo: false});

    handleUploadClick = () => this.setState({showUploadModal: true});

    handleCancelModal = () => this.setState({showUploadModal: false});

    handleChangeRaster = raster => {
        if(!(raster instanceof Raster)) {
            throw new Error('Raster expected to be instance of Raster.');
        }
        const criterion = this.props.criterion;
        criterion.raster = raster;
        return this.props.onChange(criterion);
    };

    handleUploadFile = data => {
        const criterion = this.props.criterion;
        criterion.raster.data = Array.from(data);
        this.handleCancelModal();
        return this.props.onChange(criterion);
    };

    render() {
        const {showInfo, showUploadModal} = this.state;
        const {raster} = this.props.criterion;

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {showInfo &&
                        <Message onDismiss={this.handleDismiss}>
                            <Message.Header>Upload raster</Message.Header>
                            <p>...</p>
                        </Message>
                        }
                        <Button primary icon labelPosition='left' onClick={this.handleUploadClick}>
                            <Icon name='upload'/>Upload Raster
                        </Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {raster.data.length > 0 &&
                        <CriteriaRasterMap
                            onChange={this.handleChangeRaster}
                            raster={raster}
                        />
                        }
                    </Grid.Column>
                </Grid.Row>
                {showUploadModal &&
                <RasterfileUploadModal
                    gridSize={raster.gridSize}
                    onCancel={this.handleCancelModal}
                    onChange={this.handleUploadFile}
                    parameter={{unit: 'm'}}
                />
                }
            </Grid>
        )
    }
}

CriteriaRasterUpload.proptypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired
};

export default CriteriaRasterUpload;