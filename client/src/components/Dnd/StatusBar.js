import React from 'react';
import PreviewTicketProgress from '../Tickets/PreviewTicketProgress';
import { Droppable } from 'react-beautiful-dnd';

import './StatusBar.css';

export default class StatusBar extends React.Component {
    static defaultProps = {
        tickets: []
    }
    render() {
        return (
            <div className='statusbar-ctr'>
                <h3>{this.props.column.title}</h3>
                <Droppable droppableId={this.props.column.id}>
                    {provided => (
                        <div className='progresslist'
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.props.tickets.map((ticket, index) =>
                                ticket !== undefined ?
                                <PreviewTicketProgress
                                    key={ticket._id}
                                    ticketkey = {ticket._id}
                                    ticketId = {ticket._id}
                                    title = {ticket.title} 
                                    project = {ticket.project.title}
                                    company = {this.props.company} 
                                    index={index}
                                    onDetail={this.props.onViewDetail}
                                />
                                : ''
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }
}