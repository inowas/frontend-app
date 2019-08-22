import {cloneDeep} from 'lodash';
import React from 'react';
import {Button, Progress} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {Boundary, BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IBoundaryComparisonItem} from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import {sendCommands} from '../../../../../services/api/commandHelper';
import ModflowModelCommand from '../../../commands/modflowModelCommand';

interface IProps {
    currentBoundaries: BoundaryCollection;
    newBoundaries: BoundaryCollection;
    model: ModflowModel;
    onChange: (boundaries: BoundaryCollection) => void;
}

interface IState {
    commands: ModflowModelCommand[];
    boundaryList: IBoundaryComparisonItem[];
    showProgress: boolean;
    synchronizing: boolean;
    commandsSuccessfullySent: number;
    commandsErrorSent: number;
}

class BoundarySynchronizer extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        const boundaryList: IBoundaryComparisonItem[] = props.currentBoundaries.compareWith(props.newBoundaries);
        this.state = {
            boundaryList,
            commands: this.calculateCommands(boundaryList),
            commandsSuccessfullySent: 0,
            commandsErrorSent: 0,
            showProgress: false,
            synchronizing: false
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        const boundaryList = nextProps.currentBoundaries.compareWith(nextProps.newBoundaries);
        this.setState({
            boundaryList,
            commands: this.calculateCommands(boundaryList),
        });
    }

    public render() {
        const {commands, commandsErrorSent, commandsSuccessfullySent, showProgress, synchronizing} = this.state;

        if (showProgress) {
            const percent = commandsSuccessfullySent / commands.length * 100;
            return (
                <Progress percent={percent} autoSuccess={true}>
                    {percent > 99 ? 'The progress was successful' : 'Synchronizing'}
                </Progress>
            );
        }

        return (
            <Button
                fluid={true}
                icon={'sync'}
                labelPosition={'left'}
                size={'large'}
                positive={true}
                content={'Synchronize'}
                onClick={this.synchronize}
                loading={synchronizing}
                disabled={commands.length === commandsErrorSent + commandsSuccessfullySent}
            />
        );
    }

    private calculateCommands = (boundaryList: IBoundaryComparisonItem[]) => {
        const commands: ModflowModelCommand[] = [];
        boundaryList.forEach((item) => {
            if (item.state === 'noUpdate') {
                return;
            }

            if (item.state === 'update') {
                const newBoundary = this.props.newBoundaries.findById(item.id);
                if (!(newBoundary instanceof Boundary)) {
                    return;
                }

                commands.push(ModflowModelCommand.updateBoundary(this.props.model.id, newBoundary));
            }

            if (item.state === 'add') {
                const newBoundary = this.props.newBoundaries.findById(item.id);
                if (!(newBoundary instanceof Boundary)) {
                    return;
                }

                commands.push(ModflowModelCommand.addBoundary(this.props.model.id, newBoundary));
            }

            if (item.state === 'delete') {
                commands.push(ModflowModelCommand.removeBoundary(this.props.model.id, item.id));
            }
        });

        return commands;
    };

    private onSendCommandSuccess = () => {
        this.setState((state) => {
            const {commands, commandsSuccessfullySent, commandsErrorSent} = state;

            return {
                commandsSuccessfullySent: commandsSuccessfullySent + 1,
                synchronizing: (commandsSuccessfullySent + 1 + commandsErrorSent) < commands.length,
            };
        });
    };

    private onSendCommandError = () => {
        this.setState((state) => {
            const {commands, commandsSuccessfullySent, commandsErrorSent} = state;
            return {
                commandsErrorSent: commandsErrorSent + 1,
                synchronizing: (commandsSuccessfullySent + 1 + commandsErrorSent) < commands.length
            };
        });
    };

    private synchronize = () => {
        const {commands} = this.state;
        this.setState({
                synchronizing: true,
                showProgress: true,
                commandsSuccessfullySent: 0,
                commandsErrorSent: 0,
            },
            () => sendCommands(cloneDeep(commands), this.onSendCommandSuccess, this.onSendCommandError)
        );
    };
}

export default BoundarySynchronizer;
