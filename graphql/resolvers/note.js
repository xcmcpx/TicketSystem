const Ticket = require('../../models/ticket');
const Note = require('../../models/note');

const { transformNote } = require('./merge');

module.exports = {
    createNote: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!');
        //   }
        const note = new Note({
            user: req.userId,
            ticket: args.noteInput.ticketId,
            data: args.noteInput.data
        });
        let createdNote;
        try {
            const result = await note.save();

            createdNote = transformNote(result);
            
            const ticket = await Ticket.findById(args.noteInput.ticketId);
            if(!ticket){
                throw new Error('Ticket not found.');
            }
            ticket.notes.push(note);
            await ticket.save();
            
            return createdNote;
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    },

}