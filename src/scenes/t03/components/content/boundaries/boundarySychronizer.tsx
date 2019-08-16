import React from 'react';
import {Button} from 'semantic-ui-react';
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
    boundaryList: IBoundaryComparisonItem[];
    synchronizing: boolean;
    commandsSuccessfullySent: number;
    commandsErrorSent: number;
    commandsTotal: number;
}

class BoundarySynchronizer extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        this.state = {
            boundaryList: props.currentBoundaries.compareWith(props.newBoundaries),
            synchronizing: false,
            commandsSuccessfullySent: 0,
            commandsErrorSent: 0,
            commandsTotal: 0
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            boundaryList: nextProps.currentBoundaries.compareWith(nextProps.newBoundaries)
        });
    }

    public render() {
        return (
            <Button
                fluid={true}
                positive={true}
                onClick={this.synchronize}
                loading={this.state.synchronizing}
            >
                Synchronize
            </Button>
        );
    }

    private synchronize = () => {
        const commands: ModflowModelCommand[] = [];
        this.state.boundaryList.forEach((item) => {
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

        this.setState({
                synchronizing: commands.length > 0,
                commandsSuccessfullySent: 0,
                commandsErrorSent: 0,
                commandsTotal: commands.length
            },
            () => sendCommands(commands,
                () => {
                    this.setState({
                            commandsSuccessfullySent: this.state.commandsSuccessfullySent + 1,
                            synchronizing: (this.state.commandsSuccessfullySent + 1 + this.state.commandsErrorSent)
                                < this.state.commandsTotal
                        }
                    );
                },
                () => {
                    this.setState({
                        commandsErrorSent: this.state.commandsErrorSent + 1,
                        synchronizing: (this.state.commandsSuccessfullySent + 1 + this.state.commandsErrorSent)
                            < this.state.commandsTotal
                    });
                }
            ));
    };
}

export default BoundarySynchronizer;
