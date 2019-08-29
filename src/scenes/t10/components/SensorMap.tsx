import {Point} from 'geojson';
import {uniqueId} from 'lodash';
import React from 'react';
import {CircleMarker, FeatureGroup, GeoJSON, Map} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {Geometry} from '../../../core/model/modflow';
import {Rtm} from '../../../core/model/rtm';
import {SensorCollection} from '../../../core/model/rtm/SensorCollection';
import {getStyle} from '../../../services/geoTools/mapHelpers';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import CenterControl from '../../shared/leaflet/CenterControl';

interface IProps {
    rtm: Rtm;
    onChangeGeometry: (point: Point) => any;
    onToggleEditMode?: () => any;
    geometry?: Point;
}

interface IState {
    geometry: any;
}

const style = {
    map: {
        height: '400px',
        marginTop: '20px'
    }
};

class SensorMap extends React.Component<IProps, IState> {
    private map: any;
    private mapInstance: any;

    constructor(props: IProps) {
        super(props);
        this.state = {
            geometry: props.geometry ? Geometry.fromGeoJson(props.geometry).toObject() : null
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.geometry) {
            this.setState({
                geometry: nextProps.geometry ? Geometry.fromGeoJson(nextProps.geometry).toObject() : null
            });
        }
    }

    public componentDidMount() {
        this.map = this.mapInstance.leafletElement;
    }

    public onCreated = (e: any) => {
        const geometry = Geometry.fromGeoJson(e.layer.toGeoJSON()).toObject() as Point;
        this.props.onChangeGeometry(geometry);
        this.setState({
            geometry
        });
    };

    public onEdited = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            const geometry = Geometry.fromGeoJson(layer.toGeoJSON()).toObject() as Point;
            this.setState({
                geometry
            });
            this.props.onChangeGeometry(geometry);
        });
    };

    public editControl = () => {
        return (
            <FeatureGroup>
                <EditControl
                    position="topright"
                    draw={{
                        circle: false,
                        circlemarker: !this.state.geometry,
                        marker: false,
                        polyline: false,
                        rectangle: false,
                        polygon: false
                    }}
                    edit={{
                        edit: !!this.state.geometry,
                        remove: false
                    }}
                    onCreated={this.onCreated}
                    onEdited={this.onEdited}
                    onEditStart={this.props.onToggleEditMode}
                    onEditStop={this.props.onToggleEditMode}
                >
                    {this.state.geometry && this.renderGeometry(Geometry.fromGeoJson(this.state.geometry))}
                </EditControl>
            </FeatureGroup>
        );
    };

    public renderGeometry(geometry: Geometry) {
        return (
            <GeoJSON
                key={uniqueId(geometry.hash())}
                data={geometry.toGeoJSON()}
                style={getStyle('sensor_active')}
            />
        );
    }

    public renderSensors(sensors: SensorCollection) {
        return sensors.all.map((s) => {
            const geometry = Geometry.fromGeoJson(s.geolocation);
            return (
                <CircleMarker
                    key={uniqueId(geometry.hash())}
                    center={[
                        geometry.coordinates[1],
                        geometry.coordinates[0]
                    ]}
                    {...getStyle('sensor')}
                />
            );
        });
    }

    public render() {
        let {geometry} = this.props.rtm;
        if (!geometry) {
            geometry = Geometry.fromGeoJson({
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[[13.74, 51.03], [13.75, 51.03], [13.75, 51.04], [13.74, 51.04], [13.74, 51.03]]]
                }
            });
        }

        return (
            <Map
                style={style.map}
                bounds={geometry.getBoundsLatLng()}
                ref={(e) => {
                    this.mapInstance = e;
                }}
            >
                <CenterControl
                    map={this.map}
                    bounds={geometry.getBoundsLatLng()}
                />
                <BasicTileLayer/>
                {this.editControl()}
                {this.renderSensors(this.props.rtm.sensors)}
            </Map>
        );
    }
}

export default SensorMap;
