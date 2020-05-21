import React from 'react';
import "./CreateTicket.css";

const createTicket = props => {
  return( 
    <React.Fragment>
        <div className="create_ticket_ctr">
            <form>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="title">Title: </label>
                    </div>
                    <div className="col-75">
                        <input type="text" id="title" name="title" placeholder="Title: "></input>
                    </div>
                </div>
                <div className="row">
                <div className="col-25">
                    <label htmlFor="subject">Description: </label>
                </div>
                <div className="col-75">
                    <textarea id="description" name="description" placeholder="Write something.." style={{height:200}}></textarea>
                </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="associatedUsers">Techs to Notify: </label>
                    </div>
                    <div className="col-75">
                        <select id="associatedUsers" name="associatedUsers">
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="associatedUsers">Project: </label>
                    </div>
                    <div className="col-75">
                        <select id="project" name="project">
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="company">Company: </label>
                    </div>
                    <div className="col-75">
                        <select id="company" name="company">
                        </select>
                    </div>
                </div>
            </form>
        </div>
    </React.Fragment>);
};

export default createTicket;