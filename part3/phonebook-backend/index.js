// const { response } = require("express");
const express = require("express");

const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Contact = require("./models/contact");

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

// let contacts = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

app.get("/", (req, res) => {
  res.send("<h1>Hi There😅</h1>");
});

app.get("/api/persons", (req, res) => {
  // res.json(contacts)
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  // const id = Number(req.params.id)
  // const contact = contacts.find(contact => contact.id === id)
  // contact ? res.json(contact) : res.status(404).send("We don't have that contact info")
  Contact.findById(req.params.id)
    .then((contact) => {
      contact ? res.json(contact) : res.status(404).end();
    })
    .catch((error) => {
      next(error);
    });
  // .catch(err => {
  //     console.log(err);
  //     res.status(400).send({ error: 'malformatted id' })
  // })
});

app.get("/info", async (req, res) => {
  const currentTime = new Date();
  const allContacts = await Contact.find({});
  res.send(`<p>Phonebook has info for ${allContacts.length} people</p>
    <p>${currentTime}</p>`);
});

app.delete("/api/persons/:id", (req, res, next) => {
  // const id = Number(req.params.id)
  // contacts = contacts.find(contact => contact.id !== id)
  // res.status(204).end()
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", async (req, res, next) => {
  const { body } = req;
  // console.log(body)
  const theSameNameResult = await Contact.find({ name: body.name });

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }
  if (theSameNameResult.length > 0) {
    return res.status(400).json({
      error: "we already have that one on server",
    });
  }

  const contact = new Contact({
    // id: generateRandomId(),
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((savedContact) => {
      res.json(savedContact);
    })
    .catch((error) => {
      console.log(error.message);
      next(error);
    });

  // contacts = contacts.concat(contact)
  // res.json(contact)
});

// const generateRandomId = () => parseInt(Math.random() * 100000000000)

app.put("/api/persons/:id", (req, res, next) => {
  const { body } = req;

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(req.params.id, contact, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedContact) => {
      res.json(updatedContact);
    })
    .catch((error) => next(error));
});

// const PORT = 3001
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT} `)
// })

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//     console.log('Please provide the password as an argument: node mongo.js <password>')
//     process.exit(1)
// }

// const password = process.argv[2]
// const password = process.env.PASSWORD_KEY

// const url = process.env.MONGODB_URI

// console.log('connecting to ', url);

// mongoose.connect(url)
// .then(result => {
//     console.log("conntected to  MongoDB");
// })
// .catch((error)=>{
//     console.log("error connecting to MongoDB", error.message);
// })

// const contactSchema = new mongoose.Schema({
//     name: String,
//     number: String,
// })

// contactSchema.set('toJSON', {
//     transform: (document, returnObject) => {
//         returnObject.id = returnObject._id.toString();
//         delete returnObject._id;
//         delete returnObject.__v
//     }
// })

// const Contact = mongoose.model('Contact', contactSchema)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).send({ error: [error.name, error.message] });
  }

  next(error);
};
// this has to be the last loaded middleware.
app.use(errorHandler);
