import {Boundary, BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {Button, Progress} from 'semantic-ui-react';
import {IBoundary} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {IBoundaryComparisonItem} from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import {ModflowModel} from '../../../../../core/model/modflow';
import {asyncSendCommand, fetchUrl} from '../../../../../services/api';
import {connect} from 'react-redux';
import {updateBoundaries} from '../../../actions/actions';
import AbstractCommand from '../../../../../core/model/command/AbstractCommand';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import React from 'react';

interface IStateProps {
    currentBoundaries: BoundaryCollection;
    newBoundaries: BoundaryCollection;
    model: ModflowModel;
    onChange: (boundaries: BoundaryCollection) => void;
}

interface IDispatchProps {
    updateBoundaries: (boundaries: BoundaryCollection) => any;
}

interface IState {
    commands: ModflowModelCommand[];
    boundaryList: IBoundaryComparisonItem[];
    showProgress: boolean;
    synchronizing: boolean;
    commandsSuccessfullySent: number;
    commandsErrorSent: number;
}

type IProps = IStateProps & IDispatchProps;

class BoundarySynchronizer extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        const boundaryList: IBoundaryComparisonItem[] = props.currentBoundaries.compareWith(
            props.model.stressperiods, props.newBoundaries
        );
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
        const boundaryList = nextProps.currentBoundaries.compareWith(
            nextProps.model.stressperiods, nextProps.newBoundaries
        );
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
                positive={true}
                onClick={this.synchronize}
                loading={synchronizing}
                disabled={commands.length === commandsErrorSent + commandsSuccessfullySent}
            >
                Synchronize
            </Button>
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

    private synchronize = () => {
        this.setState({
            showProgress: true,
            synchronizing: true
        });

        const {commands} = this.state;
        const sendCommands = async (commands: AbstractCommand[]) => {
            for (const command of commands) {
                try {
                    await asyncSendCommand(command);
                    this.setState((prevState) => ({
                        commandsSuccessfullySent: prevState.commandsSuccessfullySent + 1,
                        synchronizing: (prevState.commandsSuccessfullySent + 1 + prevState.commandsErrorSent) < commands.length,
                    }));
                } catch (e) {
                    this.setState((prevState) => ({
                        commandsErrorSent: prevState.commandsErrorSent + 1,
                        synchronizing: (prevState.commandsSuccessfullySent + 1 + prevState.commandsErrorSent) < commands.length,
                    }));
                }
            }
        };

        sendCommands(commands).finally(
            () => {
                fetchUrl(`modflowmodels/${this.props.model.id}/boundaries`,
                    (data: IBoundary[]) => this.props.updateBoundaries(BoundaryCollection.fromQuery(data)));
            }
        );
    };
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updateBoundaries: (b) => {
        dispatch(updateBoundaries(b));
    },
});

export default connect<unknown, IDispatchProps>(null, mapDispatchToProps)(BoundarySynchronizer);

