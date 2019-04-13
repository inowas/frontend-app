import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Menu, Popup} from 'semantic-ui-react';
import {pure} from 'recompose';
import Transport from 'core/model/modflow/transport/Transport';

const SubstanceList = ({addSubstance, transport, onClick, onRemove, selected}) => {
    return (
        <div>
            <Button positive icon='plus' labelPosition='left'
                    onClick={addSubstance}
                    content={'Add Substance'}
            >
            </Button>
            <Menu fluid vertical tabular>
                {transport.all.map((substance, idx) => (
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
                                                             onClick={() => onRemove(substance.id)}/>}
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
            </Menu>
        </div>
    );
};

SubstanceList.propTypes = {
    addSubstance: PropTypes.func.isRequired,
    transport: PropTypes.instanceOf(Transport).isRequired,
    onClick: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    selected: PropTypes.string
};

export default pure(SubstanceList);
