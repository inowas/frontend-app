import {Button, Icon, Menu, Popup} from 'semantic-ui-react';

interface IProps {
    items: Array<{id: number | string; name: string}>;
    onClick: (key: number | string) => any;
    onClone: (key: number | string) => any;
    onRemove: (key: number | string) => any;
    readOnly: boolean;
    selected?: number | string;
}

const ElementsList = ({items, onClick, onClone, onRemove, readOnly, selected}: IProps) => {

    const handleClick = (key: number | string) => {
        return () => onClick(key);
    };

    const handleClone = (key: number | string) => {
        return () => onClone(key);
    };

    const handleRemove = (key: number | string) => {
        return () => onRemove(key);
    };

    return (
        <div>
            <Menu fluid={true} vertical={true} secondary={true}>
                {items.map((i, key) => (
                    <Menu.Item
                        name={i.name}
                        key={key}
                        active={i.id === selected}
                        onClick={handleClick(i.id)}
                    >
                        {!readOnly &&
                        <Popup
                            trigger={<Icon name="ellipsis horizontal"/>}
                            content={
                                <div>
                                    <Button.Group size="small">
                                        <Popup
                                            trigger={
                                                <Button
                                                    icon={'clone'}
                                                    onClick={handleClone(i.id)}
                                                />
                                            }
                                            content="Clone"
                                            position="top center"
                                            size="mini"
                                        />
                                        <Popup
                                            trigger={
                                                <Button
                                                    icon={'trash'}
                                                    onClick={handleRemove(i.id)}
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
                        }
                        {i.name}
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};

export default ElementsList;
