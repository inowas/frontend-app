import React, { Children, cloneElement, Component } from "react";
import ReactDOM from "react-dom";
import { Control, DomUtil, DomEvent } from "leaflet";
import { withLeaflet, MapControl, LeafletProvider } from "react-leaflet";

class CustomLayerControl extends MapControl {
  constructor (props: MapControlProps) {
    super(props);
    this.controlProps = {
      addGroupedLayer: this.addGroupedLayer.bind(this),
      removeLayer: this.removeLayer.bind(this),
      leaflet: props.leaflet
    };
    this._layers = {};
    this.state = {
      menuOpen: false,
      layers: {},
      menus: []
    };
  }

  openMenu = () => {
    this.setState({menuOpen: true});
  };

  closeMenu = () => {
    this.setState({menuOpen: false});
  }

  addGroupedLayer = (layer: Layer, name: string, checked: boolean, group: number) => {
    if (checked && this.props.leaflet && this.props.leaflet.map != null) {
      this.props.leaflet.map.addLayer(layer);
    }

    this.setState((prevState, props) => {
      const currentLayers = {...prevState.layers};
      let currentGroup = currentLayers[group];

      currentGroup = currentGroup ? [
        ...currentGroup.filter(x => x.name !== name),
        {layer, name, checked, group}
      ] : [{layer, name, checked, group}];
      currentLayers[group] = currentGroup;

      return {
        layers: currentLayers
      };
    });

    let currentGroup = this._layers[group];

    currentGroup = currentGroup ? [
      ...currentGroup.filter(x => x.name !== name),
      {layer, name, checked, group}
    ] : [{layer, name, checked, group}];

    const layers = {...this._layers};
    layers[group] = currentGroup;

    this._layers = layers;
  };

  removeLayer(layer: Layer) {
    if (this.props.leaflet && this.props.leaflet.map != null) {
      this.props.leaflet.map.removeLayer(layer);
    }
  }

  createLeafletElement(props: MapControlProps) {
    const MyControl = Control.extend({
      onAdd: map => {
        this.container = DomUtil.create("div");
        this.map = map;
        return this.container;
      },
      onRemove: map => {}
    });

    return new MyControl(props);
  }

  updateLeafletElement(fromProps: MapControlProps, toProps: MapControlProps) {
    super.updateLeafletElement(fromProps, toProps);
    console.log(fromProps, toProps);
  }

  componentDidMount(props) {
    super.componentDidMount();
    this.forceUpdate();
  }

  toggleLayer = (layerInput) => {
    const {layer, name, checked, group} = layerInput;
    console.log(layer, name, checked, group);
    const layers = {...this.state.layers};
    layers[group] = layers[group].map((l) => {
      if (l.name === name) {
        l.checked = !l.checked;
      }
      l.checked ? this.props.leaflet.map.addLayer(layer) && console.log(name, "adding this layer") : this.removeLayer(layer);
      return l;
    });

    this.setState({
      layers
    });
  };

  onCollapseClick = (name: string) => {
    const {menus} = this.state;

    menus.includes(name) ? this.setState({menus: [...this.state.menus.filter((x) => x !== name)]}) :
      this.setState({menus: [...menus, name]});
  };

  isMenuOpen = (name: string) => {
    return this.state.menus.includes(name);
  };

  render() {
    <React.Fragment>
      {ReactDOM.createPortal(
        <Paper
          onMouseEnter={this.openMenu}
          onMouseLeave={this.closeMenu}
          {...this.props}
        >
          {this.state.menuOpen && (
            <div style={{ padding: 10 }}>
              {Object.keys(this.state.layers).map(g => {
                return (
                  <React.Fragment key={g}>
                    <ListItem
                      button
                      onClick={() => this.onCollapseClick(`${g}`)}
                    >
                      <ListItemIcon>{icons[g]}</ListItemIcon>
                      <ListItemText primary={g} />
                      {this.isMenuOpen(g) ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Typography />
                    <Divider />
                    <Collapse
                      in={this.isMenuOpen(g)}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List>
                        {this.state.layers[g].map(l => {
                          return (
                            <ListItem key={l.name}>
                              <ListItemIcon>
                                <Checkbox
                                  onClick={() => this.toggleLayer(l)}
                                  edge="start"
                                  checked={l.checked}
                                />
                              </ListItemIcon>
                              <ListItemText primary={l.name} />
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              })}
            </div>
          )}
          {!this.state.menuOpen && (
            <IconButton>
              <LayerIcon />
            </IconButton>
          )}
        </Paper>,
        this.leafletElement.getContainer()
      )}
      {Children.map(this.props.children, child => {
        return child ? cloneElement(child, this.controlProps) : null;
      })}
    </React.Fragment>
  }
}

export default withLeaflet(CustomLayerControl);
