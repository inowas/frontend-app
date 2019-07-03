import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Menu, Popup} from 'semantic-ui-react';
import {pure} from 'recompose';
import SubstanceCollection from '../../../../../core/model/modflow/transport/SubstanceCollection';


const SubstanceList = ({addSubstance, substances, onClick, onRemove, selected}) => {

    const onRemoveClick = (e, substanceId) => {
        e.stopPropagation();
        onRemove(substanceId);
    };

    return (
        <div>
            <Menu.Item>
                <Button positive icon='plus' labelPosition='left'
                        onClick={addSubstance}
                        content={'Add Substance'}
                        style={{marginLeft: '-20px', width: '200px'}}
                >
                </Button>
            </Menu.Item>
            {substances.all.map((substance, idx) => (
                <Menu.Item
                    name={substance.name}
                    key={substance.id}
                    active={substance.id === selected}
                    onClick={() => onClick(substance.id)}
                >
                    <Popup
                        trigger={<Icon name='ellipsis horizontal'/>}
                        content={
                            <div>
                                <Button.Group size='small'>
                                    <Popup
                                        trigger={<Button icon={'trash'}
                                                         onClick={(e) => onRemoveClick(e, substance.id)}/>}
                                        content='Delete'
                                        position='top center'
                                        size='mini'
                                    />
                                </Button.Group>
                            </div>
                        }
                        on={'click'}
                        position={'right center'}
                    />
                    {idx}: {substance.name}
                </Menu.Item>
            ))}
        </div>
    );
};

SubstanceList.propTypes = {
    addSubstance: PropTypes.func.isRequired,
    substances: PropTypes.instanceOf(SubstanceCollection).isRequired,
    onClick: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    selected: PropTypes.string
};

export default pure(SubstanceList);
