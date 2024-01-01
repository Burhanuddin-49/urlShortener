const express = require("express");
const { connectToMongoose } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const path = require("path");
const staticRouter = require("./routes/staticRouter");

const app = express();
const PORT = 8001;

connectToMongoose(
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1/short-url"
).then(() => console.log("Mongodb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", staticRouter);

app.use("/url", urlRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
