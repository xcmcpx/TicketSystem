import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import AuthContext from '../context/auth-context';
import Stopwatch from '../components/Timers/Stopwatch';
import Notes from '../components/Utility/Notes';
import TicketDDL from '../components/Utility/TicketDDL';

import './TimeTracker.css'

class TimeTrackerPage extends Component {


  state = {
    tickets: [],
    isLoading: false,
    selectedTicket: '',
    note: {},
    notes: '',
    time: 0,
    toTracking: false,
  };
  constructor(props) {
    super(props);
  }

  isActive = true;
  static contextType = AuthContext;

  componentDidMount() {
    this.fetchTickets();
  }

  fetchTickets() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
              query {
                  openTickets{
                      _id
                      title
                      description
                      closed
                      company{
                        name
                      }
                      project{
                          _id
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
                  }
          `
    };
    const token = this.context.token;
    this.isActive = true;

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
      if (this.isActive) {
        this.setState({
          tickets: tickets,
          isLoading: false,
          selectedTicket: tickets[0]._id,
        });
      }
    }).catch(err => {
      console.log(err);
      if (this.isActive) {
        this.setState({ isLoading: false });
      }
    });
  };

  grabTime = (time) => {
    this.setState({
      time: time
    })
  }

  grabNotes = (notes) => {
    this.setState({
      notes: notes,
    })
  }

  grabTicketID = (id) => {
    this.setState({
      selectedTicket: id,
    })
  }

  createNote = async () => {
    const ticketId = this.state.selectedTicket;
    const data = this.state.notes;

    const requestBody = {
      query: `
          mutation CreateNote($ticketId: ID!, $data: String!) {
            createNote(noteInput:{ticketId: $ticketId, data: $data}){
              _id
              user{
                _id
              }
              ticket{
                _id
              }
              data
            }
          }
      `,
      variables: {
        ticketId: ticketId,
        data: data,
      }
    };

    const token = this.context.token;

    return fetch('https://cpcticketing.herokuapp.com/graphql', {
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
        note: {
          _id: resData.data.createNote._id,
          user: resData.data.createNote.user,
          ticket: resData.data.createNote.ticket,
          data: resData.data.createNote.data,
        }
      });
    }).catch(err => {
      console.log(err);
    });
  }

  save = async () => {

    try {
      await this.createNote();
      const ticketId = this.state.selectedTicket;
      const time = this.state.time;
      const noteId = this.state.note._id;
      const requestBody = {
        query: `
          mutation LogTime($ticketId: ID!, $time: Int!, $noteId: ID!) {
            logTime(billingTimeInput:{ticketId: $ticketId, time: $time, noteId: $noteId}){
              _id
            }
          }
      `,
        variables: {
          ticketId: ticketId,
          time: time,
          noteId: noteId,
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
      }).then(() =>{
        this.setState({
          toTracking: true,
        })
      }).catch(err => {
        console.log(err);
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  render() {
    if(this.state.toTracking === true){
      return <Redirect to='./tickettracking' />
    }
    return (
      <div className="timekeeping-ctr">
        <form id='timekeeper-form'>
          <TicketDDL state={this.state} grabTicketID={this.grabTicketID} />
          <div className="Timers">
            <Stopwatch grabTime={this.grabTime} />
          </div>
          <Notes grabNotes={this.grabNotes} />
        </form>
        <div className='btn-ctr'>
          <button className='btnSave' onClick={this.save}>Save</button>
        </div>
      </div>
    )
  }
}

export default TimeTrackerPage;