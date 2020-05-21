import React from 'react';
import PreviewTicketProgress from './PreviewTicketProgress';
import './ProgressBoard.css';
const ProgressBoard = props => {

    const mapTickets = props.tickets.map(ticket => {
        return (
            <PreviewTicketProgress
                key={ticket._id}
                className="preview-ticket_pb"
                ticketkey={ticket._id}
                ticketId={ticket._id}
                title={ticket.title}
                project={ticket.project.title}
                company={props.companyName}
                onDetail={props.onViewDetail}
            />
        )
    });

    return (
        <React.Fragment>
            <div className="progress-board_ctr">
                <div className="status-column_ctr">
                    <div className="status-column_hdr">
                        Begin Development
                    </div>
                </div>
                <div className="status-column_ctr">
                    <div className="status-column_hdr">
                        In Progress
                    </div>
                </div>
                <div className="status-column_ctr">
                    <div className="status-column_hdr">
                        Needs Collaboration
                    </div>
                </div>
                <div className="status-column_ctr">
                    <div className="status-column_hdr">
                        Ready to Test
                    </div>
                </div>
                <div className="status-column_ctr">
                    <div className="status-column_hdr">
                        Ready to Publish
                    </div>
                </div>
            </div>
            {mapTickets}
        </React.Fragment>
    )
};

export default ProgressBoard;