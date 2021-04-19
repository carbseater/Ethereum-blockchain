import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3';
import { Router} from '../../routes';
export default class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading:false
    };
    onsubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true,errorMessage:'' });
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.minimumContribution).send({ from: accounts[0] });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({errorMessage:err.message})
        }
        this.setState({ loading: false });

    }
	render() {
		return (
			<Layout>
				<h3>Create new Campaign</h3>
				<Form onSubmit={this.onsubmit} error={!!this.state.errorMessage}>
					<Form.Field>
						<label>Minimum Contribution</label>
						<Input
							label="wei"
							labelPosition="right"
							value={this.state.minimumContribution}
							onChange={(event) => this.setState({ minimumContribution: event.target.value })}
						/>
					</Form.Field>
                    <Button fluid={true} loading={this.state.loading} secondary>Create</Button>
                    <Message error header='Oops!' content={this.state.errorMessage}/>
                </Form>
                
			</Layout>
		);
	}
}
