import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap/es/index';
import AppNavBar from '../app/AppNavBar';
var DatePicker = require("reactstrap-date-picker");

class RunEdit extends Component {

    emptyItem = {
        selectedDate: new Date().toISOString(),
        formattedDateValue: '',
        duration: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const run = await (await fetch(`/runs/${this.props.match.params.id}`)).json();
            this.setState({item: run});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let item = { ...this.state.item };
        item[name] = value;

        this.setState({ item });
    }

    handleDateChange(dateValue, formattedDateValue) {
        let item = { ...this.state.item };

        item.selectedDate = dateValue;
        item.formattedDateValue = formattedDateValue;

        this.setState({ item });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;

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
        const {item} = this.state;
        const title = <h2>{item.id ? 'Edit Run' : 'Add Run'}</h2>;

        return <div>
            <AppNavBar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="date">Date</Label>
                        <DatePicker id = "date-picker"
                                    value = {this.state.item.selectedDate}
                                    onChange= {(v,f) => this.handleDateChange(v, f)}
                                    dateFormat={"MM/DD/YYYY"}/>

                    </FormGroup>
                    <FormGroup>
                        <Label for="duration">Duration</Label>
                        <Input type="text" name="duration" id="duration" value={item.duration || ''}
                               onChange={this.handleChange} autoComplete="duration"/>
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