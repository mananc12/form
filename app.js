require('dotenv').config();
const express = require('express');
const ejs = require('ejs')
const bodyParser = require("body-parser");
const mongoose = require('mongoose');



const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(express.json());

//connecting mongodb databse
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB database');
}

const contactSchema = {
  name: String,
  email: String,
  message: String
};

const Contact = new mongoose.model("Contact", contactSchema);

app.get('/', async(req,res)=>{
    res.render('home')
})
app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    console.log('Trying to save contact information...');
    await new Contact({ name, email, message }).save();
    console.log('Contact information saved successfully.');
    res.render('submit')
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

main().catch(err => console.error(err));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
