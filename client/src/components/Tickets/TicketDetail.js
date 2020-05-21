import React from 'react';
import "./TicketDetail.css";

const ticketDetail = props => {
  return( 
    <React.Fragment>
        <div className="ticket_detail_ctr">
            <h4>Project: {props.project}</h4>
            <h4>Company: {props.company}</h4>
            <h5>Creator: {props.creator}</h5>
            <h5>Assigned User: {props.assignedUser}</h5>
            <p>Description: {props.description}</p>
            <p>Created At: {new Date(props.createdAt).toLocaleDateString()}</p>
            <p>Updated At: {new Date(props.updatedAt).toLocaleDateString()}</p>
        </div>
    </React.Fragment>);
};

export default ticketDetail;