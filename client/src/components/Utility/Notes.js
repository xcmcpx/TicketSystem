import React, { Component } from "react";
import './Notes.css';

class Notes extends Component {

    onChange = e =>{
        this.props.grabNotes(e.target.value);
    }

    render() {
        return (
            <div className='notepad-ctr'>
                <div className='notepad'>
                    <div className='notepad-hdr'>Notes</div>
                    <div className='notepad-txt'>
                        <textarea className='notepad-txtarea' defaultValue='' onChange={this.onChange}>
                        </textarea>
                    </div>
                </div>
            </div>
        )
    }
}
export default Notes;