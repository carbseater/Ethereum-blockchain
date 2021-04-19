import React, { Component } from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout'
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';

export default class RequestNew extends Component {
    state = {
        value: '',
        description: '',
        recipient:'',
        errorMessage: '',
        loading:false
    }
    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }
    onSubmit = async (event)=> {
        
        event.preventDefault();
        this.setState({ loading: true,errorMessage:'' });
        
        const campaign = Campaign(this.props.address);
        const { description, value, recipient } = this.state;
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description,web3.utils.toWei(value,'ether'),recipient).send({
                from:accounts[0]
            })
            Router.pushRoute(`/campaigns/${this.props.address}/requests`)
        } catch (err) {
            this.setState({errorMessage:err.message})
        }
        this.setState({ loading: false });
    }
    
    render() {
        return (
            <Layout>
                <h3>Create a new Request</h3>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
							placeholder="Description"
							value={this.state.description}
							onChange={(event) => this.setState({ description: event.target.value })}
						/>
                    </Form.Field>
                    <Form.Field>
                        <label>Amount (ether)</label>
                        <Input
							label="ether"
							labelPosition="right"
							value={this.state.value}
							onChange={(event) => this.setState({ value: event.target.value })}
						/>
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
							placeholder="Recipient address"
							value={this.state.recipient}
							onChange={(event) => this.setState({ recipient: event.target.value })}
						/>
                    </Form.Field>
                    <Button fluid={true} loading={this.state.loading} secondary>Create</Button>
                    <Message error header='Oops!' content={this.state.errorMessage}/>
                </Form>
            </Layout>
        )
    }
}
