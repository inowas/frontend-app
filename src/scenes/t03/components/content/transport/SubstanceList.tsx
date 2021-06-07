import {Button, Icon, Menu, Popup} from 'semantic-ui-react';
import React, {MouseEvent} from 'react';
import SubstanceCollection from '../../../../../core/model/modflow/transport/SubstanceCollection';

interface IProps {
    addSubstance: () => any;
    substances: SubstanceCollection;
    onClick: (id: string) => any;
    onRemove: (id: string) => any;
    selected?: string;
    readOnly: boolean;
}

const SubstanceList = ({addSubstance, substances, onClick, onRemove, selected, readOnly}: IProps) => {

    const onClickItem = (substanceId: string) => () => {
        return onClick(substanceId);
    };

    const onRemoveClick = (substanceId: string) => (e: MouseEvent) => {
        e.stopPropagation();
        return onRemove(substanceId);
    };

    return (
        <div>
            <Menu.Item>
                <Button
                    positive={true}
                    icon="plus"
                    labelPosition="left"
                    onClick={addSubstance}
                    content={'Add Substance'}
                    style={{marginLeft: '-20px', width: '200px'}}
                    disabled={readOnly}
                />
            </Menu.Item>
            {substances.all.map((substance, idx) => (
                <Menu.Item
                    name={substance.name}
                    key={substance.id}
                    active={substance.id === selected}
                    onClick={onClickItem(substance.id)}
                >
                    <Popup
                        trigger={<Icon name="ellipsis horizontal"/>}
                        content={
                            <div>
                                <Button.Group size="small">
                                    <Popup
                                        trigger={
                                            <Button
                                                icon={'trash'}
                                                onClick={onRemoveClick(substance.id)}
                                            />
                                        }
                                        content="Delete"
                                        position="top center"
                                        size="mini"
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

export default SubstanceList;
