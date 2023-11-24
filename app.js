const express = require("express");
const { create } = require("lodash");
const mongoose = require("mongoose");

const Blog = require("./models/blogs");

//express
const app = express();

//connect to mongoDb
const dbURI =
  "mongodb+srv://alecDev:AlecMongoDb@node-tuts.ufdheqr.mongodb.net/node-tuts?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

//register view engine
app.set("view engine", "ejs");

//listen for request
//app.listen(3000);

app.use(express.static("public"));

/*
"extended true" is not that important you can remove it
the purpose of "extended true" is when its true the querystring 
allowing for more complex objects and arrays to be encoded in the URL-encoded data. 
This means that the data can contain nested objects and arrays, and they will be properly parsed.

When extended is set to false (or not provided), the querystring library is used,
which only supports simple key-value pairs and does not handle nested objects or arrays in the data.
*/
app.use(express.urlencoded({ extended: true }));

/*
//mongoose and mongo sandbox rountes
app.get("/add-blog", (req, res) => {
  const blog = new Blog({
    title: "tuesday ",
    snippet: "What i did on Tuesday",
    body: "I still dont know what I did on tuesday",
  });

  blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/all-blogs", (req, res) => {
  Blog.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/single-blog", (req, res) => {
  Blog.findById("655aa56b3e7ceb6ac9b83cb8")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
*/

//route
app.get("/", (req, res) => {
  /*
  const blogs = [
    {
      title: "Yoshi find eggs",
      snippet: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum
        laborum deleniti doloremque provident rem doloribus sequi facilis quas
        quia, impedit quo, minima explicabo at quae, dolorum fuga odit
        necessitatibus natus.`,
    },
    {
      title: "Mario finds stars",
      snippet: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum
        laborum deleniti doloremque provident rem doloribus sequi facilis quas
        quia, impedit quo, minima explicabo at quae, dolorum fuga odit
        necessitatibus natus.`,
    },
    {
      title: "How to defeat browser",
      snippet: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum
        laborum deleniti doloremque provident rem doloribus sequi facilis quas
        quia, impedit quo, minima explicabo at quae, dolorum fuga odit
        necessitatibus natus.`,
    },
  ];
  */
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

//blogs route
app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "Home", blogs: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "create a new Blog" });
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "blog details" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
