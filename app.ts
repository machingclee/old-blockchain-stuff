import * as express from "express";
import bodyParser = require("body-parser");
import * as cors from "cors";
import * as Knex from "knex";
import * as morgan from "morgan";
import passport = require("passport");
import { initializePassport } from "./passport";
import { UserService } from "./services/UserService";

import { AuthRouter } from "./routers/AuthRouter";
import { UserRouter } from "./routers/UserRouter";
import aws = require("aws-sdk");
import multer = require("multer");
import multerS3 = require("multer-s3");
import { SmartContractService } from "./services/SmartContractService";
import { ShopRouter } from "./routers/ShopRouter";
import { ShopService } from "./services/ShopService";
import { ElasticsearchService } from "./services/ElasticsearchService";
import { ElasticsearchRouter } from "./routers/ElasticsearchRouter";
import { AuthService } from "./services/AuthService";
import { ReportService } from "./services/ReportService";
import { ReportRouter } from "./routers/ReportRouter";

const Web3 = require("web3");
declare var require: any;
const web3 = new Web3(
  // [CODE REVIEW] Put it to .env
  "https://rinkeby.infura.io/v3/5e81c9fbde9a4c63be7bb1d85530ff95"
);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/", (req, res, next) => {
  res.json("Hello World");
});

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-southeast-1"
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "assets-standoverflow.com",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(
        null,
        `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`
      );
    }
  })
});

// Knex and Postgre SQL
const knexConfig = require("./knexfile");
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);

// User authentication
const userService = new UserService(knex);
const authService = new AuthService();
const authRouter = new AuthRouter(userService, authService);
app.use("/auth", authRouter.router());

initializePassport(userService);

// Route Guard
const isLoggedIn = passport.authenticate("jwt", { session: false });

const userRouter = new UserRouter(userService, upload);
app.use("/users", isLoggedIn, userRouter.router());

const shopService = new ShopService(knex);
const shopRouter = new ShopRouter(shopService);
app.use("/shops", isLoggedIn, shopRouter.router());

const smartContractService = new SmartContractService(knex, web3);

const reportService = new ReportService(knex, smartContractService);

const reportRouter = new ReportRouter(reportService, upload);
app.use("/reports", isLoggedIn, reportRouter.router());

//elasticsearchAPi
const elasticsearchService = new ElasticsearchService();
const elasticsearchRouter = new ElasticsearchRouter(elasticsearchService);
app.use("/search", isLoggedIn, elasticsearchRouter.router());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
