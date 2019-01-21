import PropTypes from 'prop-types';
import React from 'react';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {Map, Rectangle} from 'react-leaflet';
import {Tile, TilesCollection} from 'core/mcda/gis';

const styles = {
    map: {
        width: '100%',
        height: '200px'
    }
};

class TilesMap extends React.Component {
    boundingBox = this.props.tilesCollection.boundingBox;

    render() {
        const {activeTile, tilesCollection} = this.props;

        return (
            <Map
                style={styles.map}
                bounds={this.boundingBox.getBoundsLatLng()}
            >
                <BasicTileLayer/>
                {tilesCollection.all.map(tile =>
                    <Rectangle
                        key={tile.id}
                        bounds={tile.boundingBox.getBoundsLatLng()}
                        onClick={() => this.props.handleClick(tile)}
                        color={activeTile && activeTile.id === tile.id ? 'blue' : 'grey'}
                    />
                )}
            </Map>
        );
    }
}

TilesMap.propTypes = {
    activeTile: PropTypes.instanceOf(Tile),
    handleClick: PropTypes.func.isRequired,
    tilesCollection: PropTypes.instanceOf(TilesCollection).isRequired
};

export default TilesMap;
