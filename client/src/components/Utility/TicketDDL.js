import React, { Component } from 'react';

import './TicketDDL.css';

class TicketDDL extends Component {

    state = {
        id: '',
    }

    constructor(){
        super();
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        const selectedIndex = e.target.options.selectedIndex;
        this.props.grabTicketID(e.target.options[selectedIndex].getAttribute('id'));
    }

    render() {
        let tickets = this.props.state.tickets;
        let openTickets = tickets.map(t => 
            <option key={t._id} id={t._id}>{t.title}</option>)
        return (
            <div className='ddl-ctr'>
                <div className='ddl-hdr'>
                    Choose Ticket
                </div>
                <select className='ddl' onChange={this.onChange}>
                    {openTickets}
                </select>
            </div>
        )
    }
}
export default TicketDDL;