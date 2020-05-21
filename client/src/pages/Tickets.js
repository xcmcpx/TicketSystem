import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import TicketList from '../components/Tickets/TicketList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import TicketDetail from '../components/Tickets/TicketDetail';

import './Ticket.css'

class TicketsPage extends Component {

    state = {
        creating: false,
        tickets: [],
        isLoading: false,
        selectedTicket: null,
        openTickets: [],
        closedTickets: [],
        closed: false,
        open: true,
        company: '',
        projects: [],
        users: []
    };

    isActive = true;
    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.ticketIdEl = React.createRef();
        this.titleEl = React.createRef();
        this.descriptionEl = React.createRef();
        this.assignedUserEl = React.createRef();
        this.projectEl = React.createRef();
        this.companyEl = React.createRef();
        this.createdAtEl = React.createRef();
    }

    getCurrentDate(separator=''){
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
        }

    componentDidMount() {
        this.fetchTickets();
    };

    startCreateTicketHandler = () => {
        this.setState({ creating: true });
    };

    showAllTicketsHandler = () =>{
        this.setState({ closed: false, open: false})
    };

    showClosedTicketsHandler = () => {
        this.setState({ closed: true, open: true });
    };

    showOpenTicketsHandler = () => {
        this.setState({ open: true, closed: false });
    };

    modalConfirmHandler = () => {
        this.setState({ creating: false });
        const title = this.titleEl.current.value;
        const description = this.descriptionEl.current.value;
        const assignedUser = this.assignedUserEl.current.value;
        const project = this.projectEl.current.value;
        const company = this.companyEl.current.value;
        if( title.trim().length === 0 ||
        description.trim().length === 0
        ){
            return;
        }

        const ticket = { title, description, assignedUser, project, company };
        console.log(ticket);

        const requestBody = {
            query: `
                mutation CreateTicket($title: String!, $description: String!, $assignedUser: ID!, $project: ID!, $company: ID!) {
                    createTicket(ticketInput:{title: $title, description: $description, assignedUser: $assignedUser, project: $project, company: $company}){
                        _id
                        title
                        description
                        assignedUser{
                            email
                        }
                        project{
                            title
                        }
                        creator{
                            email
                        }
                        company{
                            name
                        }
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: {
                title: title,
                description: description,
                assignedUser: assignedUser,
                project: project,
                company: company
            }
        };

        const token = this.context.token;

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).then(res => {
            debugger;
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            debugger;
            this.setState(prevState => {
                const updatedTickets = [...prevState.tickets];
                updatedTickets.push({
                    _id: resData.data.createTicket._id,
                    title: resData.data.createTicket.title,
                    description: resData.data.createTicket.description,
                    assignedUser: resData.data.createTicket.assignedUser,
                    project: resData.data.createTicket.project,
                    creator: resData.data.createTicket.creator,
                    company: resData.data.createTicket.company,
                    createdAt: resData.data.createTicket.createdAt,
                    updatedAt: resData.data.createTicket.updatedAt
                });
                const updatedOpenTickets = [...prevState.openTickets];
                updatedOpenTickets.push({
                    _id: resData.data.createTicket._id,
                    title: resData.data.createTicket.title,
                    description: resData.data.createTicket.description,
                    assignedUser: resData.data.createTicket.assignedUser,
                    project: resData.data.createTicket.project,
                    creator: resData.data.createTicket.creator,
                    company: resData.data.createTicket.company,
                    createdAt: resData.data.createTicket.createdAt,
                    updatedAt: resData.data.createTicket.updatedAt
                });
                return { tickets: updatedTickets, openTickets: updatedOpenTickets };
            });
        }).catch(err => {
            console.log(err);
        });
    };

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedTicket: null });
    };
    modalOpenHandler = () => {
        this.setState({ creating: false, selectedTicket: null });

        const ticketId = this.state.selectedTicket._id;

        const requestBody = {
            query:  `
            mutation OpenTicket($ticketId: ID!) {
                openTicket(openInput:{ticketId: $ticketId}){
                    _id
                    title
                    description
                    closed
                    assignedUser{
                        email
                    }
                    project{
                        title
                    }
                    creator{
                        email
                    }
                    company{
                        name
                    }
                    createdAt
                    updatedAt
                }
            }
        `,
        variables: {
            ticketId: ticketId
                }
            };
        const token = this.context.token;

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            this.setState(prevState => {
                const updatedOpenTickets = [...prevState.openTickets];
                updatedOpenTickets.push({
                    _id: resData.data.openTicket._id,
                    title: resData.data.openTicket.title,
                    description: resData.data.openTicket.description,
                    assignedUser: resData.data.openTicket.assignedUser,
                    project: resData.data.openTicket.project,
                    closed: resData.data.openTicket.closed,
                    creator: resData.data.openTicket.creator,
                    company: resData.data.openTicket.company,
                    createdAt: resData.data.openTicket.createdAt,
                    updatedAt: resData.data.openTicket.updatedAt
                });
                const updatedClosedTickets = prevState.closedTickets.filter(t => t._id !== resData.data.openTicket._id);
                return { closedTickets: updatedClosedTickets, openTickets: updatedOpenTickets };
            });
        }).catch(err => {
            console.log(err);
        });
    }
    modalCloseHandler = () => {
        this.setState({ creating: false, selectedTicket: null });
        
        const ticketId = this.state.selectedTicket._id;

        const requestBody = {
            query:  `
                mutation CloseTicket($ticketId: ID!) {
                    closeTicket(closeInput:{ticketId: $ticketId}){
                        _id
                        title
                        description
                        closed
                        assignedUser{
                            email
                        }
                        project{
                            title
                        }
                        creator{
                            email
                        }
                        company{
                            name
                        }
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: {
                ticketId: ticketId
            }
        };
        const token = this.context.token;

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            this.setState(prevState => {
                const updatedClosedTickets = [...prevState.closedTickets];
                updatedClosedTickets.push({
                    _id: resData.data.closeTicket._id,
                    title: resData.data.closeTicket.title,
                    description: resData.data.closeTicket.description,
                    assignedUser: resData.data.closeTicket.assignedUser,
                    project: resData.data.closeTicket.project,
                    closed: resData.data.closeTicket.closed,
                    creator: resData.data.closeTicket.creator,
                    company: resData.data.closeTicket.company,
                    createdAt: resData.data.closeTicket.createdAt,
                    updatedAt: resData.data.closeTicket.updatedAt
                });
                const updatedOpenTickets = prevState.openTickets.filter(t => t._id !== resData.data.closeTicket._id);
                return { closedTickets: updatedClosedTickets, openTickets: updatedOpenTickets };
            });
        }).catch(err => {
            console.log(err);
        });
    };

    fetchTickets() {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query {
                    user{
                        _id
                        company{
                            _id
                            name
                            projects{
                                _id
                                title
                                description
                            }
                            tickets{
                                _id
                                title
                                description
                                project{
                                    _id
                                    title
                                }
                                creator{
                                    _id
                                    email
                                }
                                assignedUser{
                                    _id
                                    email
                                }
                                closed
                                status
                                createdAt
                                updatedAt
                            }
                            users{
                                _id
                                email
                            }
                        }
                    }
                }
            `
        };
        const token = this.context.token;
        
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer '+ token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed');
            }
            return res.json();
        }).then(resData => {
            const tickets = resData.data.user.company.tickets;
            const projects = resData.data.user.company.projects;
            const company = resData.data.user.company;
            const users = resData.data.user.company.users;
            if(this.isActive) {
                this.setState({ 
                    tickets: tickets, 
                    isLoading: false,
                    openTickets: resData.data.user.company.tickets.filter(t => t.closed === false),
                    closedTickets: resData.data.user.company.tickets.filter(t => t.closed === true),
                    company: company,
                    projects: projects,
                    users: users,
                });
            }
        }).catch(err => {
            console.log(err);
            if(this.isActive) {
                this.setState({ isLoading: false });
            }
        });
    };

    showDetailsHandler = ticketId => {
        this.setState(prevState => {
            const selectedTicket = prevState.tickets.find(t => t._id === ticketId);
            return { selectedTicket: selectedTicket };
        });
    };
    componentWillUnmount(){
        this.isActive = false;
    }
    render() {
        return (
            <React.Fragment>
                <div className="landing-div">
                    <button type="button" onClick={this.startCreateTicketHandler}>Create Ticket</button>
                    <button type="button" onClick={this.showAllTicketsHandler}>All Tickets</button>
                    <button type="button" onClick={this.showOpenTicketsHandler} >Open Tickets</button>
                    <button type="button" onClick={this.showClosedTicketsHandler}>Closed Tickets</button>
                </div>
                {(this.state.creating || this.state.selectedTicket) && <Backdrop />}
                {this.state.creating && (
                    <Modal
                    title = "Create New Ticket" 
                    canCancel
                    canConfirm
                    onCancel = {this.modalCancelHandler}
                    onConfirm = {this.modalConfirmHandler}
                    confirmText = "Submit"
                    >
                        <div className="create_ticket_ctr">
                            <form>
                                <div className="row">
                                    <div className="col-25">
                                        <label htmlFor="title">Title: </label>
                                    </div>
                                    <div className="col-75">
                                        <input type="text" ref={this.titleEl} id="title" name="title" placeholder="Title: "></input>
                                    </div>
                                </div>
                                <div className="row">
                                <div className="col-25">
                                    <label htmlFor="subject">Description: </label>
                                </div>
                                <div className="col-75">
                                    <textarea id="description" ref={this.descriptionEl} name="description" placeholder="Write something.." style={{height:200}}></textarea>
                                </div>
                                </div>
                                <div className="row">
                                    <div className="col-25">
                                        <label htmlFor="assignedUser">Techs to Notify: </label>
                                    </div>
                                    <div className="col-75">
                                        <select id="assignedUser" ref={this.assignedUserEl} name="assignedUser">
                                            {this.state.users.map(u => 
                                                <option key={u} id={u._id} value={u._id}>{u.email}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-25">
                                        <label htmlFor="project">Project: </label>
                                    </div>
                                    <div className="col-75">
                                        <select id="project" ref={this.projectEl} name="project">
                                            {this.state.projects.map(p => 
                                                <option key={p} id={p._id} value={p._id}>{p.title}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-25">
                                        <label htmlFor="company">Company: </label>
                                    </div>
                                    <div className="col-75">
                                        <select id="company" ref={this.companyEl} name="company">
                                            <option key={this.state.company.name} id={this.state.company._id} value={this.state.company._id}>{this.state.company.name}</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal>
                )}
                {(this.state.selectedTicket && !this.state.open && !this.state.closed) && (
                    <Modal 
                    title={this.state.selectedTicket.title}
                    canCancel
                    canConfirm
                    onCancel={this.modalCancelHandler}
                    onConfirm={this.state.selectedTicket.closed ? this.modalCloseHandler : this.modalOpenHandler}
                    confirmText={this.state.selectedTicket.closed ? "Reopen" : "Close"}
                >
                    <TicketDetail
                        project={this.state.selectedTicket.project.title}
                        description={this.state.selectedTicket.description}
                        company={this.state.company.name}
                        creator={this.state.selectedTicket.creator.email}
                        assignedUser={this.state.selectedTicket.assignedUser.email}
                        createdAt={this.state.selectedTicket.createdAt}
                        updatedAt={this.state.selectedTicket.updatedAt}
                    />
                </Modal>
                )}
                {(this.state.selectedTicket && this.state.open) && (
                    <Modal 
                        title={this.state.selectedTicket.title}
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalCloseHandler}
                        confirmText="Close"
                    >
                        <TicketDetail
                            project={this.state.selectedTicket.project.title}
                            description={this.state.selectedTicket.description}
                            company={this.state.company.name}
                            creator={this.state.selectedTicket.creator.email}
                            assignedUser={this.state.selectedTicket.assignedUser.email}
                            createdAt={this.state.selectedTicket.createdAt}
                            updatedAt={this.state.selectedTicket.updatedAt}
                        />
                    </Modal>
                )}
                {(this.state.selectedTicket && this.state.closed) && (
                    <Modal 
                        title={this.state.selectedTicket.title}
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalOpenHandler}
                        confirmText="Reopen"
                    >
                        <TicketDetail
                            project={this.state.selectedTicket.project.title}
                            description={this.state.selectedTicket.description}
                            company={this.state.company.name}
                            creator={this.state.selectedTicket.creator.email}
                            assignedUser={this.state.selectedTicket.assignedUser.email}
                            createdAt={this.state.selectedTicket.createdAt}
                            updatedAt={this.state.selectedTicket.updatedAt}
                        />
                    </Modal>
                )}
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                        (!this.state.closed && !this.state.open) ?
                            (<TicketList 
                            tickets={this.state.tickets}
                            companyName = {this.state.company.name}
                            authUserId={this.context.userId}
                            onViewDetail={this.showDetailsHandler}
                            />)
                        : (this.state.closed) ? 
                        (
                            <TicketList
                            tickets={this.state.closedTickets}
                            companyName = {this.state.company.name}
                            authUserId={this.context.userId}
                            onViewDetail={this.showDetailsHandler}
                            />
                        ) : <TicketList
                            tickets={this.state.openTickets}
                            companyName = {this.state.company.name}
                            authUserId={this.context.userId}
                            onViewDetail={this.showDetailsHandler}
                            />
                )}
            </React.Fragment>
        );
      }
    }
    
    export default TicketsPage;