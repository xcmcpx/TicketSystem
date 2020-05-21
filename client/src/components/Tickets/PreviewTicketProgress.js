import React from 'react';
import './PreviewTicketProgress.css';
import { Draggable } from 'react-beautiful-dnd';

class previewTicketProgress extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Draggable key={this.props.ticketId} draggableId={this.props.ticketId} index={this.props.index}>
          {provided => (
            <div className="preview-progress_ctr"
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <ul key={this.props.ticketkey} className="preview-progress_ul" onClick={this.props.onDetail.bind(this, this.props.ticketId)}>
                <li className="preview-progress_col preview-progress_title">{this.props.title}</li>
                <li className="preview-progress_col preview-progress_project">{this.props.project}</li>
                <li className="preview-progress_col preview-progress_company">{this.props.company}</li>
              </ul>
            </div>
          )}
        </Draggable>
      </React.Fragment>);
  };
}

export default previewTicketProgress;