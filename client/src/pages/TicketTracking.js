import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import { DragDropContext } from 'react-beautiful-dnd';
import AuthContext from '../context/auth-context';
import TicketDetail from '../components/Tickets/TicketDetail';
import StatusBar from '../components/Dnd/StatusBar';

import './TicketTracking.css'

class TicketTrackingPage extends Component {

    state = {
        tickets: [],
        ticketsToDisplay: [],
        beginTickets: [],
        inProgTickets: [],
        needCollabTickets: [],
        readyTestTickets: [],
        readyPubTickets: [],
        isLoading: false,
        selectedTicket: null,
        company: '',
        projects: [],
        users: [],
        dropCols: {
            'BeginDev': {
                id: 'BeginDev',
                title: 'Begin Development',
                ticketIds: []
            },
            'InProg': {
                id: 'InProg',
                title: 'In Progress',
                ticketIds: []
            },
            'NeedsCollab': {
                id: 'NeedsCollab',
                title: 'Needs Collaboration',
                ticketIds: []
            },
            'ReadyTest': {
                id: 'ReadyTest',
                title: 'Ready to Test',
                ticketIds: []
            },
            'ReadyPub': {
                id: 'ReadyPub',
                title: 'Ready to Publish',
                ticketIds: []
            },
        },
        dropColOrder: ['BeginDev', 'InProg', 'NeedsCollab', 'ReadyTest', 'ReadyPub']
    };

    componentDidMount() {
        this.fetchTickets();
    };

    showDetailsHandler = ticketId => {
        this.setState(prevState => {
            const selectedTicket = prevState.tickets.find(t => t._id === ticketId);
            return { selectedTicket: selectedTicket };
        });
    }

    isActive = true;
    static contextType = AuthContext;

    fetchTickets() {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query{
                    openTickets{
                        _id
                        title
                        description
                        closed
                        project{
                            _id
                            title
                        }
                        company{
                            name
                        }
                        status
                        creator{
                            email
                        }
                        assignedUser{
                            email
                        }
                        createdAt
                        updatedAt
                    }
                    user{
                        projects{
                            _id
                            title
                        }
                    }
                }
        `
        };
        const token = this.context.token;
        fetch('https://cpcticketing.herokuapp.com/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed');
            }
            return res.json();
        }).then(resData => {
            const tickets = resData.data.openTickets;
            const projects = resData.data.user.projects;
            if (this.isActive) {
                this.setState({
                    tickets: tickets,
                    ticketsToDisplay: tickets,
                    isLoading: false,
                    company: resData.data.openTickets[0].company.name,
                    dropCols: {
                        'BeginDev': {
                            id: 'BeginDev',
                            title: 'Begin Development',
                            ticketIds: tickets.filter(t => t.status === 1).map(t => t._id)
                        },
                        'InProg': {
                            id: 'InProg',
                            title: 'In Progress',
                            ticketIds: tickets.filter(t => t.status === 2).map(t => t._id)
                        },
                        'NeedsCollab': {
                            id: 'NeedsCollab',
                            title: 'Needs Collaboration',
                            ticketIds: tickets.filter(t => t.status === 3).map(t => t._id)
                        },
                        'ReadyTest': {
                            id: 'ReadyTest',
                            title: 'Ready to Test',
                            ticketIds: tickets.filter(t => t.status === 4).map(t => t._id)
                        },
                        'ReadyPub': {
                            id: 'ReadyPub',
                            title: 'Ready to Publish',
                            ticketIds: tickets.filter(t => t.status === 5).map(t => t._id)
                        },
                    },
                    projects: projects,
                });
            }
        }).catch(err => {
            console.log(err);
            if (this.isActive) {
                this.setState({ isLoading: false });
            }
        });
    };

    onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const start = this.state.dropCols[source.droppableId];
        const end = this.state.dropCols[destination.droppableId];

        if (start === end) {
            const newTicketIds = Array.from(start.ticketIds);
            newTicketIds.splice(source.index, 1);
            newTicketIds.splice(destination.index, 0, draggableId);

            const newCol = {
                ...start,
                ticketIds: newTicketIds
            };

            const newState = {
                ...this.state,
                dropCols: {
                    ...this.state.dropCols,
                    [newCol.id]: newCol,
                },
            };
            this.setState(newState);



            return;
        }

        const startTicketIds = Array.from(start.ticketIds);
        startTicketIds.splice(source.index, 1);
        const newStart = {
            ...start,
            ticketIds: startTicketIds,
        };

        const finishTicketIds = Array.from(end.ticketIds);
        finishTicketIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...end,
            ticketIds: finishTicketIds,
        };

        const newState = {
            ...this.state,
            dropCols: {
                ...this.state.dropCols,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };
        this.setState(newState);
        let newStatus;
        let ticketId = draggableId;
        switch (destination.droppableId) {
            case "BeginDev":
                newStatus = 1;
                break;
            case "InProg":
                newStatus = 2;
                break;
            case "NeedsCollab":
                newStatus = 3;
                break;
            case "ReadyTest":
                newStatus = 4;
                break;
            case "ReadyPub":
                newStatus = 5;
                break;
        }
        const requestBody = {
            query: `
                mutation ChangeStatus($ticketId: ID!, $newStatus: Int!) {
                    changeStatus(statusInput:{ticketId: $ticketId, newStatus: $newStatus}){
                        _id
                        status
                    }
                }
            `,
            variables: {
                ticketId: ticketId,
                newStatus: newStatus
            }
        };
        const token = this.context.token;

        fetch('https://cpcticketing.herokuapp.com/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed!");
            }
            return res.json();
        }).then(resData => {
            return resData;
        }).catch(err => {
            console.log(err);
        });
    };

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedTicket: null });
    };

    modalCloseHandler = () => {

        this.setState({ isLoading: false, selectedTicket: null });

        const ticketId = this.state.selectedTicket._id;
        const requestBody = {
            query: `
                mutation CloseTicket($ticketId: ID!) {
                    closeTicket(closeInput:{ticketId: $ticketId}){
                        _id
                }
            }
            `,
            variables: {
                ticketId: ticketId
            }
        };
        const token = this.context.token;

        fetch('https://cpcticketing.herokuapp.com/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            this.setState({
                isLoading: false,
            })
        }).catch(err => {
            console.log(err);
        });
    };

    changeProject = (projectId) => {
        this.setState(prevState => {
            const newTickets = prevState.tickets.filter(t =>  t.project._id === projectId);
            return { ticketsToDisplay: newTickets };
        });
    }

    render() {
        const mapProjects = this.state.projects.map(project => {
            return (
                <div
                    key={project._id}
                    onClick={this.changeProject.bind(this, project._id)}
                    className="project-btn">
                    <button>{project.title}</button>
                </div>
            )
        });

        return (
            <React.Fragment>
                <div className='project-nav'>
                    {mapProjects}
                </div>
                {this.state.selectedTicket && (
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
                            company={this.state.selectedTicket.company.name}
                            creator={this.state.selectedTicket.creator.email}
                            assignedUser={this.state.selectedTicket.assignedUser.email}
                            createdAt={this.state.selectedTicket.createdAt}
                            updatedAt={this.state.selectedTicket.updatedAt}
                        />
                    </Modal>
                )}
                <DragDropContext onDragEnd={this.onDragEnd} >
                    <div className="progress-board_ctr drag-container">
                        {this.state.dropColOrder.map(colId => {
                            const col = this.state.dropCols[colId];
                            const tickets = col.ticketIds.map(ticketId => this.state.ticketsToDisplay.find(t => t._id == ticketId));
                            return (
                                <StatusBar
                                    key={col.id}
                                    column={col}
                                    tickets={tickets}
                                    company={this.state.company}
                                    onViewDetail={this.showDetailsHandler}
                                />
                            )
                        })}
                    </div>
                </DragDropContext>
            </React.Fragment>
        );
    }
}

export default TicketTrackingPage;