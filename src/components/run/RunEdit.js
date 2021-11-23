import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap/es/index';
import AppNavBar from '../app/AppNavBar';
import {DateTime} from "luxon";


class RunEdit extends Component {
    emptyRunEditItem = {
        dateTime: DateTime.now().toString(),
        localDate: DateTime.now().toFormat('yyyy-MM-dd'),
        localTime: DateTime.now().toFormat('HH:mm'),
        duration: 0,
        durationFormatted: '00:00:00'
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

        if(name === 'localDate' || name === 'localTime'){
            let {runEditItem} = this.state;
            runEditItem[name] = value;

            let isoDateString = this.state.runEditItem.localDate + 'T' + this.state.runEditItem.localTime;
            let selectedDateTime = DateTime.fromISO(isoDateString);
            runEditItem['dateTime'] = selectedDateTime.toISO();

            this.setState({runEditItem: runEditItem});
        } else if(name === 'durationFormatted'){
            let {runEditItem} = this.state;
            runEditItem[name] = value;

            let durationArray = this.state.runEditItem.durationFormatted.split(':');
            runEditItem['duration'] = ((+durationArray[0]) * 60 * 60 + (+durationArray[1])
                * 60 + (+durationArray[2])) * 1000;

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
                            name="localDate"
                            id="localDate"
                            placeholder=""
                            value={runEditItem.localDate || ''}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="time">Time:</Label>
                        <Input
                            type="time"
                            name="localTime"
                            id="localTime"
                            placeholder=""
                            value={runEditItem.localTime || ''}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="time">Duration:</Label>
                        <Input type="string"
                               name="durationFormatted"
                               id="durationFormatted"
                               placeholder=""
                               value={runEditItem.durationFormatted || ''}
                               onChange={this.handleChange} />
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