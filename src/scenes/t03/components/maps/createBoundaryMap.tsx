import React from 'react';
import {CircleMarker, FeatureGroup, GeoJSON, Map} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {BoundaryFactory, Geometry} from '../../../../core/model/modflow';
import {BoundaryType} from '../../../../core/model/modflow/boundaries/types';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import CenterControl from '../../../shared/leaflet/CenterControl';
import {getStyle} from './index';

interface IProps {
    geometry: Geometry;
    onChangeGeometry: (geometry: Geometry) => any;
    onToggleEditMode?: () => any;
    type: BoundaryType;
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

class CreateBoundaryMap extends React.Component<IProps, IState> {
    private map: any;
    private mapInstance: any;

    constructor(props: IProps) {
        super(props);
        this.state = {
            geometry: null
        };
    }

    public componentDidMount() {
        this.map = this.mapInstance.leafletElement;
    }

    public onCreated = (e: any) => {
        const geometry = Geometry.fromGeoJson(e.layer.toGeoJSON());
        this.props.onChangeGeometry(geometry);
        this.setState({
            geometry
        });
    };

    public onEdited = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            const geometry = Geometry.fromGeoJson(layer.toGeoJSON());
            this.setState({
                geometry
            });
            this.props.onChangeGeometry(geometry);
        });
    };

    public editControl = () => {
        const geometryType = BoundaryFactory.fromType(this.props.type).geometryType.toLowerCase();
        return (
            <FeatureGroup>
                <EditControl
                    position="topright"
                    draw={{
                        circle: false,
                        circlemarker: geometryType.toLowerCase() === 'point' && !this.state.geometry,
                        marker: false,
                        polyline: geometryType.toLowerCase() === 'linestring' && !this.state.geometry,
                        rectangle: false,
                        polygon: geometryType.toLowerCase() === 'polygon' && !this.state.geometry
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
                    {this.state.geometry && this.renderGeometry(this.state.geometry)}
                </EditControl>
            </FeatureGroup>
        );
    };

    public renderGeometry(geometry: any) {
        const boundary = BoundaryFactory.fromType(this.props.type);
        if (!boundary) {
            return;
        }
        const gType = boundary.geometryType.toLowerCase();

        if (gType === 'point') {
            return (
                <CircleMarker
                    key={Math.random()}
                    center={geometry.coordinatesLatLng}
                    {...getStyle(this.props.type)}
                />
            );
        }

        return (
            <GeoJSON
                key={geometry.hash()}
                data={geometry}
                style={getStyle(this.props.type)}
            />
        );
    }

    public render() {
        const {geometry} = this.props;

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
                <GeoJSON
                    key={geometry.hash()}
                    data={geometry.toGeoJSON()}
                    style={getStyle('area')}
                />
            </Map>
        );
    }
}

export default CreateBoundaryMap;
