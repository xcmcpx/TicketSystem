require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const path = require('path');

const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const PORT = process.env.PORT || 4000;
const USER = process.env.MONGO_USER;
const PW = process.env.MONGO_PASSWORD;

const app = express();

app.use(bodyParser.json());

//allow cross origin in a controlled manner
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
  }
  next();
});

//testing commit comment!!

app.use(isAuth);

//set up graphql api
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
    })
);


if(process.env.NODE_ENV === 'production') {
    app.use(express.static('./client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

//connect to the database and log when connection received.
mongoose.connect(
    `mongodb+srv://${USER}:${PW}@ticketdbcluster-aocr7.azure.mongodb.net/tickets_testdb?retryWrites=true&w=majority`, { useNewUrlParser: true }
)
.then(() => {
    app.listen(PORT);
    console.log(PORT);
    console.log(' Your app is up and running on http://localhost:4000\ ' +
    'You can use GraphiQL in development mode on http://localhost:4000/graphql');
})
.catch(err => {
    console.log(err);
});