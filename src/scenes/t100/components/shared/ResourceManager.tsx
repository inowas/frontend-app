import { Button, Card, Checkbox, Form, Grid, Header, Icon, Image, Input, Item, Label, Modal, Segment, Select, Table } from 'semantic-ui-react';
import happyPoints from '../../assets/happy-points.png';
import infiltrationPond from '../../assets/infiltration-pond.png';
import marCoin from '../../assets/mar-coin.png';

interface IProps {
    onClose: () => any;
  }

const variabilityOptions = [
    { key: 'v', text: 'variable', value: 'variable' },
    { key: 'f', text: 'fixed', value: 'fixed' },
  ]
const options = [
    { key: 'drawdown', text: 'Local drawdown max.', value: 'drawdown' },
    { key: 'o', text: 'Other', value: 'other' },
]

const ResourceManager = (props: IProps) => {
    

    return (
    <Modal
        closeIcon
        open={true}
        onClose={props.onClose}
        size='fullscreen'
    >
        <Header>
            <Icon name='table' />
            <Header.Content>Resource Manager</Header.Content>
        </Header>
        <Modal.Content>
            <Grid>
                <Grid.Row stretched>
                    <Grid.Column width={4}>
                        <Header>Category</Header>
                        <Form>
                            <Form.Field
                                control={Checkbox}
                                label={<label>Hydrotechnical structures</label>}
                            />
                            <Form.Field
                                control={Checkbox}
                                label={<label>Natural water bodies</label>}
                            />
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={12}>
                    <Segment>
                    <Item.Group divided>
                        <Item>
                            <Item.Content>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={4}>
                                            <Label as='a' image>
                                                <img src={infiltrationPond} alt='' />
                                                Infiltration Pond 01
                                            </Label>
                                            <div>
                                                <Label size='small' image className='object-reward'><Image size='mini' src={marCoin} />-20</Label>
                                                <Label size='small' image className='object-reward'><Image size='mini' src={happyPoints} />+14</Label>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={3}>
                                            <Form>
                                            <Form.Field inline
                                                control={Input}
                                                label='Lat'
                                                placeholder='34,7356'
                                                width={16}
                                            />
                                            <Select placeholder='fixed' options={variabilityOptions} style={{minWidth: '8em'}} />
                                            </Form>
                                        </Grid.Column>
                                        <Grid.Column width={3}>
                                            <Form>
                                            <Form.Field inline
                                                control={Input}
                                                label='Long'
                                                placeholder='34,7356'
                                                width={16}
                                            />
                                            <Select placeholder='fixed' options={variabilityOptions} style={{minWidth: '8em'}} />
                                            </Form>
                                        </Grid.Column>
                                        <Grid.Column width={6}>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Select
                                                        fluid
                                                        label='Constraints'
                                                        options={options}
                                                        placeholder='Please select'
                                                        width={12}
                                                    />
                                                    <Form.Field
                                                        control={Input}
                                                        label='&nbsp;'
                                                        placeholder='Limit'
                                                        width={4}
                                                    />
                                                </Form.Group>
                                            </Form>
                                            
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Item.Content>
                        </Item>
                        <Item>
                            <Item.Content>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={4}>
                                            <Label as='a' image style={{backgroundColor: 'transparent'}}>
                                                <img src={infiltrationPond} alt='' />
                                                Infiltration Pond 02
                                            </Label>
                                            <Card>
                                                <Card.Content>
                                                    <Image
                                                    floated='left'
                                                    size='mini'
                                                    src={infiltrationPond}
                                                    />
                                                    <Card.Header>Steve Sanders</Card.Header>
                                                    <Card.Meta>Friends of Elliot</Card.Meta>
                                                    <Card.Description>
                                                    Steve wants to add you to the group <strong>best friends</strong>
                                                    </Card.Description>
                                                </Card.Content>
                                                <Card.Content extra>
                                                    <div className='ui two buttons'>
                                                    <Button basic color='green'>
                                                        Approve
                                                    </Button>
                                                    <Button basic color='red'>
                                                        Decline
                                                    </Button>
                                                    </div>
                                                </Card.Content>
                                            </Card>
                                        </Grid.Column>
                                        <Grid.Column width={5}>
                                            <Form>
                                            <Header size='tiny' style={{fontWeight: 'bold'}}>Location</Header>
                                            <Form.Field inline>
                                                <label>Lat</label>
                                                <Input placeholder='34,7356' />
                                            </Form.Field>
                                            <Form.Field inline
                                                control={Input}
                                                label='Long'
                                                placeholder='34,7356'
                                            />
                                            </Form>
                                        </Grid.Column>
                                        <Grid.Column width={6}>
                                            <Form>
                                                <Header size='tiny' style={{fontWeight: 'bold'}}>Constraints</Header>
                                                <Form.Group>
                                                    <Form.Select
                                                        fluid
                                                        options={options}
                                                        placeholder='Please select'
                                                        width={12}
                                                    />
                                                    <Form.Field
                                                        control={Input}
                                                        placeholder='Limit'
                                                        width={4}
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={4}>
                                            <div>
                                                <Label size='small' image className='object-reward'><Image size='mini' src={marCoin} />20</Label>
                                                <Label size='small' image className='object-reward'><Image size='mini' src={happyPoints} />14</Label>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={5}>
                                            <Form.Select label='Variability' placeholder='fixed' options={variabilityOptions} style={{minWidth: '8em'}} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                    </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
            <Table>
                <Table.Header>
                    <Table.Row verticalAlign='top'>
                        <Table.HeaderCell rowSpan='2'>Category</Table.HeaderCell>
                        <Table.HeaderCell rowSpan='2'>Objects</Table.HeaderCell>
                        <Table.HeaderCell colSpan='3'>Location</Table.HeaderCell>
                        <Table.HeaderCell colSpan='2'>Properties</Table.HeaderCell>
                        <Table.HeaderCell>Values</Table.HeaderCell>
                        <Table.HeaderCell>Constraints</Table.HeaderCell>
                        <Table.HeaderCell>MAR coins</Table.HeaderCell>
                        <Table.HeaderCell>Happiness Points</Table.HeaderCell>
                        <Table.HeaderCell>Comments</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell style={{fontWeight: 'normal'}}>Lat</Table.HeaderCell>
                        <Table.HeaderCell>Long</Table.HeaderCell>
                        <Table.HeaderCell>Variability</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Variability</Table.HeaderCell>
                        <Table.HeaderCell>m3/day</Table.HeaderCell>
                        <Table.HeaderCell>Min, max, slider steps</Table.HeaderCell>
                        <Table.HeaderCell>Cost/ m3</Table.HeaderCell>
                        <Table.HeaderCell>Profit/ m3</Table.HeaderCell>
                        <Table.HeaderCell>Additional Info</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell rowSpan='4'>Hydrotechnical structures</Table.Cell>
                        <Table.Cell>Public Well 01</Table.Cell>
                        <Table.Cell>34,73</Table.Cell>
                        <Table.Cell>32,46</Table.Cell>
                        <Table.Cell><Select placeholder='' options={variabilityOptions} style={{minWidth: '8em'}} /></Table.Cell>
                        <Table.Cell>Abstraction rate</Table.Cell>
                        <Table.Cell><Select placeholder='' options={variabilityOptions} style={{minWidth: '8em'}} /></Table.Cell>
                        <Table.Cell>1.500</Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Modal.Content>
        <Modal.Actions>
        <Button color='red'>
          <Icon name='remove' /> Cancel
        </Button>
        <Button color='green'>
          <Icon name='checkmark' /> Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
export default ResourceManager;
