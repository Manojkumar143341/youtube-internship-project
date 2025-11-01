import express from "express";
import { likevideocontroller } from "../Controllers/like.js";
import { viewscontroller } from "../Controllers/views.js";
import { uploadvideo, getallvideos } from "../Controllers/video.js";
import { historycontroller, deletehistory, getallhistorycontroller } from "../Controllers/History.js";
import { watchlatercontroller, getallwatchlatercontroller, deletewatchlater } from "../Controllers/watchlater.js";
import { likedvideocontroller, getalllikedvideo, deletelikedvideo } from "../Controllers/likedvideo.js";
import { addUserPoints } from "../Controllers/Points.js"; // ✅ NEW
import upload from "../Helper/filehelper.js";
import auth from "../middleware/AuthMiddleware.js";

const routes = express.Router();

// ✅ Upload video (with authentication and file upload middleware)
routes.post("/uploadvideo", auth, upload.single("file"), uploadvideo);

// ✅ Get all videos
routes.get("/getvideos", getallvideos);

// ✅ Like and view updates
routes.patch('/like/:id', auth, likevideocontroller);
routes.patch('/view/:id', viewscontroller);

// ✅ History routes
routes.post('/history', auth, historycontroller);
routes.get('/getallhistory', getallhistorycontroller);
routes.delete('/deletehistory/:userid', auth, deletehistory);

// ✅ Watch Later
routes.post('/watchlater', auth, watchlatercontroller);
routes.get('/getallwatchlater', getallwatchlatercontroller);
routes.delete('/deletewatchlater/:videoid/:viewer', auth, deletewatchlater); // 🔧 fixed case error

// ✅ Liked videos
routes.post('/likevideo', auth, likedvideocontroller);
routes.get('/getalllikevide', getalllikedvideo);
routes.delete('/deletelikevideo/:videoid/:viewer', auth, deletelikedvideo);

// ✅ Add 5 points to user
routes.post('/addpoints', auth, addUserPoints);
export default routes;
