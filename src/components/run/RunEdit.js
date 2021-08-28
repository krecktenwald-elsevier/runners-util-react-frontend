import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Col, Row } from 'reactstrap/es/index';
import AppNavBar from '../app/AppNavBar';
import { DateTime } from "luxon";


class RunEdit extends Component {

    emptyRunEditItem = {
        dateTime: DateTime.now().toString(),
        duration: '0',
        durationHours: 0,
        durationMinutes: 0,
        durationSeconds: 0,
        localDateSelection: DateTime.now().toFormat('yyyy-MM-dd'),
        localTimeSelection: DateTime.now().toFormat('HH:mm')
    };

    constructor(props) {
        super(props);

        this.state = {
            runEditItem: this.emptyRunEditItem
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const runEditItem = await (await fetch(`/runs/${this.props.match.params.id}`)).json();
            this.setState({runEditItem});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if(name === 'localDateSelection' || name === 'localTimeSelection'){
            let {runEditItem} = this.state;
            runEditItem[name] = value;

            let selectedDateTime = DateTime.fromISO(this.state.runEditItem.localDateSelection + 'T' + this.state.runEditItem.localTimeSelection);
            runEditItem['dateTime'] = selectedDateTime.toISO();

            this.setState({runEditItem: runEditItem});
        } else {
            let {runEditItem} = this.state;
            runEditItem[name] = value;
            this.setState({runEditItem: runEditItem});
        }
    }

    async handleSubmit(event) {
        console.log('inside handleSubmit...');
        event.preventDefault();
        const item = this.state.runEditItem;

        await fetch('/runs' + (item.id ? '/' + item.id : ''), {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/runs');
    }

    render() {
        const runEditItem = this.state.runEditItem;
        const title = <h2>{runEditItem.id ? 'Edit Run' : 'Add Run'}</h2>;

        return <div>
            <AppNavBar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="date">Date:</Label>
                        <Input
                            type="date"
                            name="localDateSelection"
                            id="localDateSelection"
                            placeholder=""
                            value={runEditItem.localDateSelection || ''}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="time">Time:</Label>
                        <Input
                            type="time"
                            name="localTimeSelection"
                            id="localTimeSelection"
                            placeholder=""
                            value={runEditItem.localTimeSelection || ''}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="time">Duration:</Label>
                        <Row form>
                            <Col md={1}>
                                <FormGroup>
                                    <Input type="number"
                                           name="durationHours"
                                           id="durationHours"
                                           placeholder="HH"
                                           value={runEditItem.durationHours || ''}
                                           onChange={this.handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md={1}>
                                <FormGroup>
                                    <Input type="number"
                                           name="durationMinutes"
                                           id="durationMinutes"
                                           placeholder="MM"
                                           value={runEditItem.durationMinutes || ''}
                                           onChange={this.handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md={1}>
                                <FormGroup>
                                    <Input type="number"
                                           name="durationSeconds"
                                           id="durationSeconds"
                                           placeholder="SS"
                                           value={runEditItem.durationSeconds || ''}
                                           onChange={this.handleChange} />
                                </FormGroup>
                            </Col>
                        </Row>

                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/runs">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}
export default withRouter(RunEdit);