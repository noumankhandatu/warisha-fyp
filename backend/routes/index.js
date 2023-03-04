const { Router } = require("express");
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { jwtToken, openAI_KEY } = require("../envkey");
// schema imported here
const AuthModel = require("../model/index");
const imageCollection = require("../model/imageCollection");

const router = Router();

router.get("/", (req, res) => {
  res.send("hello world here");
});

router.post("/signup", (req, res) => {
  const { fullName, email, password } = req.body;
  if (!password || !fullName | !email) {
    return res.status(206).send("Please add all feilds");
  }

  const authModel = new AuthModel({
    fullName,
    email,
    password,
  });
  AuthModel.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res.status(206).send("email already present try new email");
    }
    if (!savedUser) {
      authModel
        .save()
        .then(() => {
          return res.send("Auth Model Saved in mongodb");
        })
        .catch((err) => {
          return res.send("Auth Model isnt saved in mongodb");
        });
    }
  });
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(206).send({
      message: "A feild is missing try again",
    });
  }

  const response = await AuthModel.findOne({ email: email });
  if (response) {
    const getPassword = await AuthModel.findOne({ password: password });
    if (getPassword) {
      const token = jwt.sign({ id: response.id }, jwtToken);
      const { _id, email, fullName } = response;
      if (token) {
        return res.status(200).send({
          message: "User SignIn SuccessFully",
          token: token,
        });
      }
      return res.status(206).send({
        message: `Sign In succesfull , ${token}`,
      });
    }
    return res.send({
      message: "Email or password is wrong",
    });
  }
  if (!response) {
    return res.status(206).send({
      message: "Email not found please signup first",
    });
  }
});

router.post("/image/generator", async (req, res) => {
  const configuration = new Configuration({
    apiKey: openAI_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createImage({
    prompt: req.body.input,
    n: 4,
    size: "256x256",
  });
  res.status(200).json({ result: response.data.data });
});

router.post("/imageCollection", async (req, res) => {
  try {
    const data = req.body;
    const imageDetails = await imageCollection(data).save();
    if (imageDetails) {
      res.status(200).send("Collection saved successfully");
    } else {
      res.status(206).send("Error while saving your collection ");
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/getCollection", async (req, res) => {
  try {
    const imageData = await imageCollection.find();
    if (imageData) {
      res.status(200).send(imageData);
    } else {
      res.status(206).send("Couldn't Fetch Collection Data Please Try Again");
    }
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
