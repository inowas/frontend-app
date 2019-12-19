import React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router-dom';
import {BoundaryFactory} from '../../../../core/model/modflow/boundaries';
import {BoundaryType} from '../../../../core/model/modflow/boundaries/Boundary.type';
import * as Content from './index';

interface IOwnProps {
    readOnly: boolean;
}

type IProps = IOwnProps & RouteComponentProps<{
    id: string;
    property?: string;
    type?: string;
}>;

const contentWrapper = (props: IProps) => {

    const {id, property, type} = props.match.params;

    if (property === 'discretization') {
        return (<Content.Discretization/>);
    }

    if (property === 'soilmodel') {
        return (<Content.SoilmodelEditor/>);
    }

    if (property === 'boundaries') {
        if (type && BoundaryFactory.availableTypes.indexOf(type) > -1) {
            return (<Content.CreateBoundary type={type as BoundaryType}/>);
        }
        return (<Content.Boundaries types={['chd', 'drn', 'evt', 'fhb', 'ghb', 'rch', 'riv', 'wel']}/>);
    }

    if (property === 'head_observations') {
        if (type === 'hob') {
            return (<Content.CreateBoundary type="hob"/>);
        }

        return (<Content.Boundaries types={['hob']}/>);
    }

    if (property === 'transport') {
        return (<Content.Transport/>);
    }

    if (property === 'variable_density') {
        return (<Content.VariableDensityProperties/>);
    }

    if (property === 'observations') {
        return (<Content.Observations/>);
    }

    if (property === 'modflow') {
        return (<Content.Modflow/>);
    }

    if (property === 'mt3d') {
        return (<Content.Mt3d/>);
    }

    if (property === 'seawat') {
        return (<Content.Seawat/>);
    }

    if (property === 'calculation') {
        return (<Content.Calculation/>);
    }

    if (property === 'flow') {
        return (<Content.FlowResults/>);
    }
    if (property === 'budget') {
        return (<Content.BudgetResults/>);
    }
    if (property === 'modpath') {
        return (<Content.Modpath/>);
    }
    if (property === 'concentration') {
        return (<Content.TransportResults/>);
    }
    if (property === 'optimization') {
        return (<Content.Optimization/>);
    }

    const path = props.match.path;
    const basePath = path.split(':')[0];
    return (
        <Redirect to={basePath + id + '/discretization' + props.location.search}/>
    );
};

export default withRouter(contentWrapper);
