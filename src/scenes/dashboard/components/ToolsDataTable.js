import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Loader, Popup, Table} from 'semantic-ui-react';
import * as Formatter from '../../../services/formatter';
import {withRouter} from 'react-router-dom';
import NoContent from '../../shared/complexTools/noContent';

class ToolsDataTable extends React.Component {

    state = {hoveredInstance: null};

    render() {
        const {activeTool, cloneToolInstance, deleteToolInstance, history, loading, showPublicInstances, toolInstances} = this.props;
        const {push} = history;
        const {path, subPath, slug} = activeTool;

        if (toolInstances.length === 0) {
            return <NoContent message={'Create a new entry'}/>
        }

        const rows = toolInstances.map((i, index) => {
            return (
                <Table.Row
                    key={index}
                    onMouseEnter={() => this.setState({hoveredInstance: index})}
                    onMouseLeave={() => this.setState({hoveredInstance: null})}
                >
                    <Table.Cell textAlign='right'>
                        {index + 1}
                    </Table.Cell>
                    <Table.Cell>
                        <Button
                            basic
                            onClick={() => push(path + i.tool + '/' + i.id + subPath)}
                            size='small'
                        >
                            {i.name}
                        </Button>
                    </Table.Cell>
                    <Table.Cell>
                        {i.tool}
                    </Table.Cell>
                    <Table.Cell>
                        {Formatter.dateToDatetime(new Date(i.created_at))}
                    </Table.Cell>
                    <Table.Cell>
                        {i.user_name}
                    </Table.Cell>
                    <Table.Cell>
                        <div className="tableDeleteButton">
                        <Button.Group size='small' >
                                        <Popup
                                            trigger={
                                                <Button
                                                    onClick={() => cloneToolInstance(slug, i.id)}
                                                    icon
                                                >
                                                    <Icon name='clone'/>
                                                </Button>
                                            }
                                            content='Clone'
                                        />
                                        {!showPublicInstances &&
                                        <Popup
                                            trigger={
                                                <Button
                                                    onClick={() => deleteToolInstance(slug, i.id)}
                                                    icon
                                                >
                                                    <Icon name='trash'/>
                                                </Button>
                                            }
                                            content='Delete'
                                        />
                                        }
                                    </Button.Group>
                        </div>

                    </Table.Cell>
                </Table.Row>
            );
        });

        return (
            <div>
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>No.</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Tool</Table.HeaderCell>
                            <Table.HeaderCell>Date created</Table.HeaderCell>
                            <Table.HeaderCell>Created by</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
                {loading && <Loader active inline='centered'/>}
            </div>
        )
    }
}

ToolsDataTable.propTypes = {
    activeTool: PropTypes.object.isRequired,
    cloneToolInstance: PropTypes.func.isRequired,
    deleteToolInstance: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    showPublicInstances: PropTypes.bool.isRequired,
    toolInstances: PropTypes.array.isRequired

};

export default withRouter(ToolsDataTable);