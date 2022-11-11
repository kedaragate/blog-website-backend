const path = require("path");

const blogModel = require("../models/blogModel");

const userModel = require("../models/userModel");

exports.create = (req, res) => {
  const { title, author, body } = req.body;

  const comments = [];

  const newBlog = new blogModel({ title, author, body, comments });

  newBlog

    .save()
    .then((data) => {
      if (!data) {
        res.status(400).send({ message: "Something went wrong" });
      } else {
        res.json(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.findAll = (req, res) => {
  blogModel
    .find({})
    .populate("author", "firstName lastName _id")
    .then((data) => {
      if (!data) {
        res.status(400).send({ message: "Something went wrong" });
      } else {
        res.json(data);
      }
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.findOne = (req, res) => {
  let id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    blogModel
      .findById(id)
      .populate("author", "firstName lastName _id")
      .then((data) => {
        if (!data) {
          res.status(400).send({ message: "Something went wrong" });
        } else {
          res.json(data);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(400).send({ message: "Please enter correct id" });
  }
};

// exports.deleteAll = (req, res) => {
//   blogModel
//     .deleteMany({})
//     .then((data) => {
//       if (!data) {
//         res.status(400).send({ message: "Something went wrong." });
//       }
//       res.json({
//         message: "Deleted all the blogs",
//       });
//     })
//     .catch((err) => res.status(500).send({ message: err }));
// };

exports.deleteOne = (req, res) => {
  id = req.params.id;
  console.log(req.params);

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    blogModel.findByIdAndDelete(id).then((data) => {
      if (!data) {
        res.status(400).send({ message: "Something went wrong." });
      } else {
        res.send({ message: `Successfully deleted blog ${req.params.id}` });
      }
    });
  } else {
    res.status(400).send({ message: "Please enter correct id" });
  }
};

exports.updateOne = (req, res) => {
  let id = req.params.id;
  const { title, body } = req.body;
  console.log(req.body);

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    blogModel
      .findOneAndUpdate({ _id: id }, { title, body }, { new: true })
      .then((data) => {
        if (!data) {
          res.status(400).send({ message: "Something went wrong" });
        } else {
          let keysToUpdate = Object.keys(req.body);

          keysToUpdate.forEach((key) => (data[key] = req.body[key]));
          res.json(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(400).send({ message: "Please enter correct id" });
  }
};
