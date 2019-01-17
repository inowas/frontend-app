const styles = {
    active_cells: {
        line: {
            color: 'grey',
            weight: 0.3
        }
    },
    area: {
        weight: 2,
        opacity: 0.7,
        color: '#1EB1ED',
        fill: false
    },
    bounding_box: {
        color: '#000',
        weight: 0.5,
        fill: false
    },
    grid: {
        weight: 1,
        opacity: 1,
        color: 'blue',
        fill: false
    },
    chd: {
        weight: 5,
        color: '#ED8D05',
        opacity: 1,
        fill: false
    },
    ghb: {
        weight: 5,
        color: '#ED8D05',
        opacity: 1,
        fill: false
    },
    hob: {
        radius: 3,
        color: 'green',
        weight: 1,
        fillColor: 'yellow',
        fillOpacity: 1
    },
    rch: {
        weight: 2,
        color: '#ED8D05',
        opacity: 0.7,
        fillOpacity: 0.3
    },
    riv: {
        weight: 5,
        color: '#ED8D05',
        opacity: 1
    },
    riv_op: {
        radius: 5,
        color: '#404040',
        weight: 2,
        fillColor: '#404040',
        fillOpacity: 0.7
    },
    wel: {
        cw: {
            radius: 3,
            color: 'black',
            weight: 1,
            fillColor: 'darkgreen',
            fillOpacity: 0.7
        },
        puw: {
            radius: 3,
            color: 'black',
            weight: 1,
            fillColor: 'darkblue',
            fillOpacity: 0.7
        },
        iw: {
            radius: 3,
            color: 'black',
            weight: 1,
            fillColor: 'blue',
            fillOpacity: 0.7
        },
        inw: {
            radius: 4,
            color: 'black',
            weight: 1,
            fillColor: 'yellow',
            fillOpacity: 0.7
        },
        irw: {
            radius: 3,
            color: 'black',
            weight: 1,
            fillColor: 'darkgreen',
            fillOpacity: 0.7
        },
        opw: {
            radius: 3,
            color: 'red',
            weight: 1,
            fillColor: 'red',
            fillOpacity: 0.7
        },
        sniw: {
            radius: 5,
            color: 'red',
            weight: 2,
            fillColor: 'darkgreen',
            fillOpacity: 0.7
        },
        snpw: {
            radius: 5,
            color: 'red',
            weight: 2,
            fillColor: 'darkblue',
            fillOpacity: 0.7
        },
        prw: {
            radius: 3,
            color: 'black',
            weight: 1,
            fillColor: 'darkblue',
            fillOpacity: 0.7
        },
        rbf: {
            radius: 5,
            color: 'black',
            weight: 1,
            fillColor: 'yellow',
            fillOpacity: 1
        },
        smw: {
            radius: 5,
            color: 'black',
            weight: 1,
            fillColor: 'red',
            fillOpacity: 1
        },
        snw: {
            radius: 5,
            color: 'black',
            weight: 1,
            fillColor: 'yellow',
            fillOpacity: 1
        },
        snifw: {
            radius: 5,
            color: '#63b3ea',
            weight: 2,
            fillColor: '#bbdff6',
            fillOpacity: 0.7
        },
        activeWell: {
            fillColor: 'yellow'
        }
    },
    op: {
        radius: 5,
        color: '#404040',
        weight: 2,
        fillColor: '#404040',
        fillOpacity: 1
    },
    op_temp: {
        radius: 5,
        color: '#404040',
        weight: 1,
        fillColor: '#404040',
        fillOpacity: 0.5
    },
    op_selected: {
        radius: 7,
        color: '#D50E00',
        weight: 1,
        fillColor: '#D50E00',
        fillOpacity: 1
    },
    default: {
        radius: 5,
        weight: 2,
        opacity: 1,
        color: 'blue',
        dashArray: '1',
        fillColor: 'blue',
        fillOpacity: 0.7
    }
};

export default styles;