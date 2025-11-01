import express from "express";
import { login } from "../Controllers/Auth.js";
import {
  updatechaneldata,
  getallchanels,
  getUserChannels,
} from "../Controllers/channel.js";
import auth from "../middleware/auth.js";

const routes = express.Router();

routes.post("/login", login);
routes.patch("/update/:id", auth, updatechaneldata);
routes.get("/getallchannel", getallchanels);
routes.get("/mychannels", auth, getUserChannels); // for logged-in user's channels

export default routes;
