import PropTypes from 'prop-types';
import React from 'react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {Button, Header, Form, Grid, Message, Popup} from 'semantic-ui-react';
import SsmSubstanceEditor from './SsmSubstanceEditor';
import {Stressperiods} from 'core/model/modflow';
import {SsmPackage, SsmSubstance} from 'core/model/flopy/packages/mt';
import {Boundary, BoundaryCollection, BoundaryFactory} from 'core/model/modflow/boundaries';
import BoundarySelector from './BoundarySelector';

class SsmPackageProperties extends AbstractPackageProperties {

    constructor(props) {
        super(props);
        this.state.selectedBoundary = null;
        this.state.selectedSubstance = null;
    }

    handleSelectBoundary = boundaryId => {
        return this.setState({
            selectedBoundary: this.props.boundaries.findById(boundaryId).toObject()
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
            mtPackage: ssmPackage.toObject(),
            selectedSubstance: substance.id
        });
    };

    handleChangeSubstance = substance => {
        const ssmPackage = SsmPackage.fromObject(this.state.mtPackage);
        ssmPackage.updateSubstance(substance);
        this.props.onChange(ssmPackage);
        return this.setState({mtPackage: ssmPackage.toObject()});
    };

    removeSubstance = () => {
        const ssmPackage = SsmPackage.fromObject(this.state.mtPackage);
        ssmPackage.removeSubstance(this.state.selectedSubstance);
        //TODO: Remove substances from optimization?!
        this.props.onChange(ssmPackage);
        return this.setState({
            mtPackage: ssmPackage.toObject(),
            selectedSubstance: 0
        });
    };

    render() {
        const {boundaries, readonly, stressperiods} = this.props;

        if (boundaries.length === 0) {
            return <Message warning>
                <p>You need to add boundaries before adding substances.</p>
            </Message>;
        }

        const ssmPackage = SsmPackage.fromObject(this.state.mtPackage);
        const substances = ssmPackage.substances;
        const selectedSubstance = substances.filter(s => s.id === this.state.selectedSubstance)[0];

        let selectedBoundary;
        if (this.state.selectedBoundary) {
            selectedBoundary = BoundaryFactory.fromObject(boundaries.all.filter(b => b.id === this.state.selectedBoundary.id)[0]);
        }

        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Form>
                                <Form.Group>
                                    <BoundarySelector
                                        boundaries={boundaries}
                                        onChange={this.handleSelectBoundary}
                                        selected={selectedBoundary}
                                    />
                                    <Form.Dropdown
                                        placeholder="Select Substance"
                                        label='Select substance'
                                        search
                                        selection
                                        options={SsmPackageProperties.substanceOptions(substances)}
                                        onChange={this.handleSelectSubstance}
                                        value={this.state.selectedSubstance}
                                    />
                                    <Button.Group style={{marginTop:'23px'}}>
                                        <Popup
                                            trigger={<Button icon='add circle'
                                                             onClick={() => this.addSubstance('new substance')}
                                                             disabled={readonly}
                                            />}
                                            content='Add substance'
                                            position='top center'
                                            size='mini'
                                        />
                                        <Popup
                                            trigger={<Button icon='trash'
                                                             onClick={() => this.removeSubstance(this.state.selectedSubstance)}
                                                             disabled={readonly}
                                            />}
                                            content='Delete substance'
                                            position='top center'
                                            size='mini'
                                        />
                                </Button.Group>
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {(selectedSubstance instanceof SsmSubstance) && (selectedBoundary instanceof Boundary) &&
                <div>
                    <Header as='h4' dividing>{selectedSubstance.name} at {selectedBoundary.name}</Header>
                    <SsmSubstanceEditor
                        boundary={selectedBoundary}
                        onChange={this.handleChangeSubstance}
                        readOnly={readonly}
                        stressperiods={stressperiods}
                        substance={selectedSubstance}
                    />
                </div>
                }
            </div>
        );
    }
}

SsmPackageProperties.propTypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    stressperiods: PropTypes.instanceOf(Stressperiods).isRequired,
    mtPackage: PropTypes.instanceOf(SsmPackage),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};


export default SsmPackageProperties;
