import {Feature} from 'geojson';
import {LatLng, LatLngBoundsExpression} from 'leaflet';
import md5 from 'md5';
import React from 'react';
import {FeatureGroup, GeoJSON, Map} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {pure} from 'recompose';
import {Icon, Message} from 'semantic-ui-react';
import {BoundingBox, Cells, Geometry, GridSize} from '../../../../core/model/geometry';
import {GeoJson} from '../../../../core/model/geometry/Geometry.type';
import {calculateActiveCells} from '../../../../services/geoTools';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {getStyle} from './index';

const style = {
    map: {
        height: '500px',
        width: '100%'
    }
};

interface ICreateModelMapProps {
    gridSize: GridSize;
    onChange: (args: { cells: Cells, boundingBox: BoundingBox, geometry: Geometry }) => void;
}

interface ICreateModelMapState {
    boundingBox: Array<[number, number]> | null;
    calculating: boolean;
    cells: number[][] | null;
    geometry: GeoJson | null;
    gridSize: { n_x: number, n_y: number };
}

class CreateModelMap extends React.Component<ICreateModelMapProps, ICreateModelMapState> {
    constructor(props: ICreateModelMapProps) {
        super(props);
        this.state = {
            cells: [],
            boundingBox: null,
            geometry: null,
            gridSize: props.gridSize.toObject(),
            calculating: false
        };
    }

    public componentWillReceiveProps(nextProps: ICreateModelMapProps) {
        const {gridSize} = nextProps;
        if (!nextProps.gridSize.sameAs(GridSize.fromObject(this.state.gridSize))) {
            this.setState(() => ({gridSize: gridSize.toObject()}), () => this.recalculate());
        }
    }

    public calculate = (geometry: Geometry, boundingBox: BoundingBox, gridSize: GridSize) => {
        return new Promise<Cells>((resolve) => {
            const activeCells = calculateActiveCells(geometry, boundingBox, gridSize, 0.5);
            resolve(activeCells);
            this.forceUpdate();
        });
    };

    public recalculate = () => {
        if (!this.state.geometry || !this.state.boundingBox) {
            return null;
        }

        const boundingBox = BoundingBox.fromObject(this.state.boundingBox);
        const geometry = Geometry.fromObject(this.state.geometry);
        const gridSize = GridSize.fromObject(this.state.gridSize);

        this.setState({calculating: true});
        this.calculate(geometry, boundingBox, gridSize)
            .then((cells) => this.setState({
                    cells: cells.toArray(),
                    gridSize: gridSize.toObject(),
                    calculating: false
                }, () => this.handleChange({cells, boundingBox, geometry})
            ));
    };

    public handleChange = (args: { cells: Cells, boundingBox: BoundingBox, geometry: Geometry }) => {
        return this.props.onChange(args);
    };

    public onCreated = (e: any) => {
        const polygon = e.layer;
        const geometry = Geometry.fromGeoJson(polygon.toGeoJSON());
        const boundingBox = BoundingBox.fromGeoJson(polygon.toGeoJSON());
        const gridSize = GridSize.fromObject(this.state.gridSize);

        this.setState({calculating: true});
        this.calculate(geometry, boundingBox, gridSize).then(
            (cells) => {
                return this.setState({
                        cells: cells.toArray(),
                        boundingBox: boundingBox.toObject() as Array<[number, number]>,
                        geometry: geometry.toObject(),
                        calculating: false
                    },
                    () => this.handleChange({cells, boundingBox, geometry})
                );
            }
        );
    };

    public editControl = () => (
        <FeatureGroup>
            <EditControl
                position={'topright'}
                draw={{
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false,
                    rectangle: false,
                    polygon: this.state.geometry == null
                }}
                edit={{
                    edit: this.state.geometry != null,
                    remove: this.state.geometry != null
                }}
                onCreated={this.onCreated}
            />
        </FeatureGroup>
    );

    public areaLayer = () => {
        return (
            <GeoJSON
                key={md5(JSON.stringify(this.state.geometry))}
                data={this.state.geometry!}
                style={getStyle('area')}
            />
        );
    };

    public boundingBoxLayer = () => {
        const boundingBox = BoundingBox.fromObject(this.state.boundingBox!);
        return (
            <GeoJSON
                key={md5(JSON.stringify(boundingBox.toObject()))}
                data={boundingBox.geoJson as Feature}
                style={getStyle('bounding_box')}
            />
        );
    };

    public renderCalculationMessage = () => {
        if (!this.state.calculating) {
            return null;
        }

        return (
            <Message
                key={Math.random()}
                icon={true}
                style={{
                    zIndex: 1000000,
                    width: '50%',
                    marginLeft: '25%',
                    marginTop: '150px',
                }}
            >
                <Icon name="circle notched" loading={true}/>
                <Message.Content>
                    <Message.Header>Just one second</Message.Header>
                    We are calculating the active cells for you.
                </Message.Content>
            </Message>
        );
    };

    public getBoundsLatLng = () => {
        if (this.state.boundingBox) {
            return BoundingBox.fromObject(this.state.boundingBox).getBoundsLatLng() as LatLngBoundsExpression;
        }

        return [[60, 10], [45, 30]] as LatLngBoundsExpression;
    };

    public handleClickOnMap = (arg: { latlng: LatLng }) => {
        if (!this.state.cells || !this.state.boundingBox) {
            return null;
        }

        const {latlng} = arg;

        const activeCells: Cells = Cells.fromObject(this.state.cells as Array<[number, number]>);
        const boundingBox: BoundingBox = BoundingBox.fromObject(this.state.boundingBox);
        const gridSize: GridSize = GridSize.fromObject(this.state.gridSize);
        const x = latlng.lng;
        const y = latlng.lat;

        this.setState({
            cells: activeCells.toggle([x, y], boundingBox, gridSize).toArray()
        });
    };

    public render() {
        return (
            <Map
                style={style.map}
                bounds={this.getBoundsLatLng()}
                onClick={this.handleClickOnMap}
            >
                <BasicTileLayer/>
                {!this.state.geometry && this.editControl()}
                {this.state.geometry && this.areaLayer()}
                {this.state.boundingBox && this.boundingBoxLayer()}
                {this.renderCalculationMessage()}
            </Map>
        );
    }
}

export default pure(CreateModelMap);
