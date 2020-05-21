import React from 'react';
import './PreviewTicket.css';

const previewTicket = props => {
  return( 
    <React.Fragment>
      <div className = "preview_ticket_ctr">
        <ul key={props.ticketkey} className="preview_ticket_ul" onClick={props.onDetail.bind(this, props.ticketId)}>
          <li className = "preview_ticket_col preview_ticket_title">{props.title}</li>
          <li className = "preview_ticket_col preview_ticket_project">{props.project}</li>
          <li className = "preview_ticket_col preview_ticket_company">{props.company}</li>
        </ul>
      </div>
    </React.Fragment>);
};

export default previewTicket;