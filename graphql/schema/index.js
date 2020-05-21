const { buildSchema } = require('graphql');

module.exports = buildSchema (
    `
        type Company {
            _id: ID!
            name: String!
            creator: User!
            projects: [Project!]
            tickets: [Ticket!]
            users: [User!]
        }
        type Project {
            _id: ID!
            title: String!
            description: String!
            company: Company!
            creator: User!
            associatedUsers: [User!]
            tickets: [Ticket!]
        }
        type Ticket {
            _id: ID!
            title: String!
            description: String!
            project: Project!
            company: Company!
            creator: User!
            assignedUser: User!
            closed: Boolean!
            status: Int!
            hours: [BillingTime!]
            notes: [Note!]
            createdAt: String!
            updatedAt: String!
        }
        type User {
            _id: ID!
            email: String!
            password: String
            company: Company!
            projects: [Project!]
            tickets: [Ticket!]
        }
        type BillingTime {
            _id: ID!
            user: User!
            ticket: Ticket!
            note: Note!
            time: Int!
        }
        type Note {
            _id: ID!
            user: User!
            ticket: Ticket!
            data: String!
        }
        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }
        input CompanyInput {
            name: String!
            users: [String]
        }
        input ProjectInput {
            title: String!
            description: String!
            company: String!
            associatedUsers: [String]
        }
        input TicketInput {
            title: String!
            description: String!
            project: ID!
            company: ID!
            assignedUser: ID!
        }
        input UserInput {
            email: String!
            password: String!
            company: String!
        }
        input UserQuery {
            userId: String!
        }
        input CloseInput{
            ticketId: ID!
        }
        input OpenInput{
            ticketId: ID!
        }
        input StatusInput{
            ticketId: ID!
            newStatus: Int!
        }
        input BillingTimeInput{
            ticketId: ID!
            time: Int!
            noteId: ID!
        }
        input NoteInput{
            ticketId: ID!
            data: String!
        }
        type RootQuery {
            companies: [Company!]!
            users: [User!]!
            user: User!
            projects: [Project!]!
            tickets: [Ticket!]!
            openTickets: [Ticket!]!
            login(email: String!, password: String!): AuthData!
        }
        type RootMutation {
            createCompany(companyInput: CompanyInput): Company
            createUser(userInput: UserInput): User
            createProject(projectInput: ProjectInput): Project
            createTicket(ticketInput: TicketInput): Ticket
            closeTicket(closeInput: CloseInput): Ticket
            openTicket(openInput: OpenInput): Ticket
            changeStatus(statusInput: StatusInput): Ticket
            logTime(billingTimeInput: BillingTimeInput): BillingTime
            createNote(noteInput: NoteInput): Note
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `
);