const compression = require('compression');
const express = require('express');
require('./conn.js');
const app = express();
app.use(compression());
const port = process.env.PORT || 8000;
const cors = require("cors");
const Mydatabase = require('./model.js');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/addNewBlog", async (req, res) => {

    const { name, email, description } = req.body;

    if (!name || !email) {

        res.status(400).send("Error: Please enter all fields");

    } else {
        const omkar = new Mydatabase({
            name,
            email,
            slug: name.split(' ').join('-').replace(/[,*+~.()'"!:@]/g, '').toLowerCase(),
            description,
            date: Date(),
            datestring: new Date().toDateString() + " " + new Date().toLocaleTimeString()
        });

        try {
            const response = await Mydatabase.findOne({ email: email });

            if (response) {
                res.status(400).send("Error: Data already exists with this email id");

                return;
            } else {

                try {
                    await omkar.save();
                    res.status(201).send("New blog added successfully");
                } catch (errors) {
                    res.status(400).send(`${errors.name} : ${errors.message}`);
                }
                return;
            }
        } catch (error) {
            res.status(400).json({ error: error });
        }
    }
})

// get all blogs from mongodb
app.get('/fetchdata', async (req, res) => {

    try {
        const showdata = await Mydatabase.find();
        res.send(showdata)
    } catch (error) {
        res.send(error)
    }
})

// show recents last 3 posts
app.get('/recentposts', async (req, res) => {
    try {
        const showdata = await Mydatabase.find().limit(3).sort({ date: -1 });
        res.send(showdata)
    } catch (error) {
        res.send(error)
    }
})

app.get('/getinfo/:slug', async (req, res) => {

    try {
        const showdata = await Mydatabase.findOne({ slug: req.params.slug });
        res.send(showdata)
    } catch (error) {
        res.send(error)
    }
})

app.put('/updateblog/:slug', async (req, res) => {

    const slug = req.params.slug;

    const body = req.body;

    try {
        const update = await Mydatabase.updateMany({ slug }, body, {
            new: true,
            runValidators: true
        });
        res.json({
            result: update,
            message: "Blog data updated successfully"
        })

    } catch (error) {
        res.send(error)
    }
})

app.delete('/deleteblog/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const update = await Mydatabase.deleteOne({ _id }, {
            new: true,
            runValidators: true
        });
        res.json({
            result: update,
            message: "Blog deleted successfully"
        })

    } catch (error) {
        res.send(error)
    }
})

app.get('/', (req, res) => {
    res.send("Hello, this is a home page")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})