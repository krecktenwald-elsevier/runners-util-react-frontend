import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap/es/index';
import AppNavBar from '../app/AppNavBar';
import { Link } from 'react-router-dom';


class RunList extends Component {

    constructor(props) {
        super(props);
        this.state = {runs: []};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/runs')
            .then(response => response.json())
            .then(data => this.setState({runs: data}));
    }

    async remove(id) {
        await fetch(`/runs/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedRuns = [...this.state.runs].filter(i => i.id !== id);
            this.setState({runs: updatedRuns});
        });
    }

    render() {
        const {runs: runs, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const runList = runs.map(run => {
            return <tr key={run.id}>
                <td style={{whiteSpace: 'nowrap'}}>{run.date}</td>
                <td>{run.duration}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/runs/" + run.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(run.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavBar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/runs/new">Add Run</Button>
                    </div>
                    <h3>Runs</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="50%">Date</th>
                            <th width="50%">Duration</th>
                        </tr>
                        </thead>
                        <tbody>
                        {runList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default RunList;