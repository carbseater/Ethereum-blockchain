import React, { Component } from 'react'
import { Link } from '../../../routes'
import Layout from '../../../components/Layout'
import { Button,Table } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';


export default class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element,index)=>{
                return campaign.methods.requests(index).call();
            })
        )
        
        return { address,requests,requestCount,approversCount };
    }

    renderRow= ()=> {
        return this.props.requests.map((request, index) => 
            <RequestRow
                key={index}
                id={index}
                request={request}
                address={this.props.address}
                approversCount={this.props.approversCount}
            />
        )
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        
        return (
            <Layout>
                <h1>Requests</h1>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary float='right'>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRow()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} request</div>
            </Layout>
        )
    }
}
