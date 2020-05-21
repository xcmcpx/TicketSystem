import React from 'react';
import PreviewTicket from './PreviewTicket';

const ticketList = props => {

  const mapTickets = props.tickets.map(ticket => {
    return( 
      <PreviewTicket 
      key = {ticket._id}
      className = "preview_ticket"
      ticketkey = {ticket._id}
      ticketId = {ticket._id}
      title = {ticket.title} 
      project = {ticket.project.title}
      company = {props.companyName} 
      onDetail = {props.onViewDetail}
      />
      )
    });

  return (
    <React.Fragment>
      <div className = "preview_ticket_headers">
        <h4 className = "preview_ticket_hdr">Title</h4>
        <h4 className = "preview_ticket_hdr">Project</h4>
        <h4 className = "preview_ticket_hdr">Company</h4>
      </div>
      {mapTickets}
    </React.Fragment>
  )
};

export default ticketList;