const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to ", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("conntected to  MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB", error.message);
  });

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (str) {
        const splitString = str.split("-");
        return (
          splitString.length === 2 &&
          splitString[0].length <= 3 &&
          splitString[0].length >= 2 &&
          str.length >= 9 &&
          Number.isInteger(+splitString[0]) &&
          Number.isInteger(+splitString[1])
        );
      },
      message: "You must provide phone number within one ' - '.",
    },
    required: true,
  },
});

contactSchema.set("toJSON", {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  },
});

// const Contact = mongoose.model('Contact', contactSchema)

module.exports = mongoose.model("Contact", contactSchema);
