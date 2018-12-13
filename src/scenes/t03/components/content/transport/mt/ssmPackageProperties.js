import PropTypes from 'prop-types';
import React from 'react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {Button, Divider, Dropdown, Form, Grid, Icon} from 'semantic-ui-react';
import SsmSubstanceEditor from './SsmSubstanceEditor';
import {Stressperiods} from 'core/model/modflow';
import {SsmPackage, SsmSubstance} from 'core/model/modflow/mt3d';
import Boundary from 'core/model/modflow/boundaries/Boundary';

class SsmPackageProperties extends AbstractPackageProperties {

    constructor(props) {
        super(props);
        this.state.selectedBoundary = null;
        this.state.selectedSubstance = null;
    }

    handleSelectBoundary = boundaryId => {
        this.props.onSelectBoundary(boundaryId);
        return this.setState({
            selectedBoundary: boundaryId
        });
    };

    handleSelectSubstance = (e, {value}) => {
        this.setState({selectedSubstance: value});
    };

    static substanceOptions(substances) {
        return substances.map((s, key) => ({
            key: key,
            value: s.id,
            text: s.name
        }));
    }

    addSubstance = (name) => {
        const ssmPackage = SsmPackage.fromObject(this.state.mtPackage);
        const substance = SsmSubstance.create(name);
        ssmPackage.addSubstance(substance);
        this.props.onChange(ssmPackage);
        this.setState({
            mtPackage: ssmPackage.toObject,
            selectedSubstance: substance.id
        });
    };

    handleChangeSubstance = substance => {
        const ssmPackage = SsmPackage.fromObject(this.state.mtPackage);
        ssmPackage.updateSubstance(substance);
        this.props.onChange(ssmPackage);
        return this.setState({mtPackage: ssmPackage.toObject});
    };

    removeSubstance = () => {
        const ssmPackage = SsmPackage.fromObject(this.state.mtPackage);
        ssmPackage.removeSubstance(this.state.selectedSubstance);
        //TODO: Remove substances from optimization?!
        this.props.onChange(ssmPackage);
        return this.setState({
            mtPackage: ssmPackage.toObject,
            selectedSubstance: 0
        });
    };

    render() {
        const {boundaries, readonly, stressPeriods} = this.props;

        if (boundaries.length === 0) {
            return <div>Please add some boundaries first.</div>;
        }

        const ssmPackage = SsmPackage.fromObject(this.state.mtPackage);
        const substances = ssmPackage.substances;
        const selectedSubstance = substances.filter(s => s.id === this.state.selectedSubstance)[0];

        let selectedBoundary;
        if (this.state.selectedBoundary) {
            //TODO: selectedBoundary = BoundaryFactory.fromObjectData(boundaries.filter(b => b.id === this.state.selectedBoundary)[0]);
        }

        // TODO: <BoundarySelector
        //                             boundaries={boundaries}
        //                             onChange={this.handleSelectBoundary}
        //                             selected={this.state.selectedBoundary}
        //                         />

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        INSERT BoundarySelector HERE
                    </Grid.Column>
                    <Grid.Column>
                        <Form>
                            <Form.Group>
                                <Dropdown
                                    placeholder="Select Substance"
                                    fluid
                                    search
                                    selection
                                    options={SsmPackageProperties.substanceOptions(substances)}
                                    onChange={this.handleSelectSubstance}
                                    value={this.state.selectedSubstance}
                                />
                                <Button.Group>
                                    <Button
                                        icon
                                        onClick={() => this.addSubstance('new substance')}
                                        disabled={readonly}
                                    >
                                        <Icon name="add circle"/>
                                    </Button>

                                    <Button
                                        icon
                                        onClick={() => this.removeSubstance(this.state.selectedSubstance)}
                                        disabled={readonly}
                                    >
                                        <Icon name="trash"/>
                                    </Button>
                                </Button.Group>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                {(selectedSubstance instanceof SsmSubstance) && (selectedBoundary instanceof Boundary) &&
                <div>
                    <Divider horizontal>{selectedSubstance.name} at {selectedBoundary.name}</Divider>
                    <SsmSubstanceEditor
                        boundary={selectedBoundary}
                        onChange={this.handleChangeSubstance}
                        readOnly={readonly}
                        stressPeriods={stressPeriods}
                        substance={selectedSubstance}
                    />
                </div>
                }
            </Grid>
        );
    }
}

SsmPackageProperties.propTypes = {
    boundaries: PropTypes.array.isRequired,
    stressPeriods: PropTypes.instanceOf(Stressperiods),
    mtPackage: PropTypes.instanceOf(SsmPackage),
    onChange: PropTypes.func.isRequired,
    onSelectBoundary: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};


export default SsmPackageProperties;
