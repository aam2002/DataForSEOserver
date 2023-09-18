import express from "express";
import axios from "axios";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";

//config env
dotenv.config();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());

//variable
let pending = true;

// routes
app.post("/data", (req, res) => {
  const { url } = req.body;
  const post_array = [];
  post_array.push({
    target: `${url}`,
    max_crawl_pages: 1,
    load_resources: true,
    enable_javascript: true,
    enable_browser_rendering: true,
    tag: "some-str",
  });
  axios({
    method: "post",
    url: "https://api.dataforseo.com/v3/on_page/task_post",
    auth: {
      username: `${process.env.LOGIN}`,
      password: `${process.env.PASSWORD}`,
    },
    data: post_array,
    headers: {
      "content-type": "application/json",
    },
  })
    .then(function(response) {
      var result = response["data"]["tasks"];

      // Result data
      takeid = result[0].id;
      res.status(200).send({
        result: result[0].id,
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

app.post("/check", (req, res) => {
  const { id } = req.body;
  axios({
    method: "get",
    url: "https://api.dataforseo.com/v3/on_page/tasks_ready",
    auth: {
      username: `${process.env.LOGIN}`,
      password: `${process.env.PASSWORD}`,
    },
    headers: {
      "content-type": "application/json",
    },
  })
    .then(function(response) {
      var result = response["data"]["tasks"][0]["result"];
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        if (id === result[i].id) {
          pending = false;
          return res.send(pending);
        }
      }
      res.send(pending);
    })
    .catch(function(error) {
      console.log(error);
    });
});

app.post("/FinalData", (req, res) => {
  const { id } = req.body;
  const post_array2 = [];
  post_array2.push({
    id: `${id}`,
    limit: 1,
  });
  axios({
    method: "post",
    url: "https://api.dataforseo.com/v3/on_page/pages",
    auth: {
      username: `${process.env.LOGIN}`,
      password: `${process.env.PASSWORD}`,
    },
    data: post_array2,
    headers: {
      "content-type": "application/json",
    },
  })
    .then(function(response) {
      var result = response["data"]["tasks"];
      console.log(result);
      res.status(201).send(result);
    })
    .catch(function(error) {
      console.log(error);
    });
});

//host
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`.blue);
});

