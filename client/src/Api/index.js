import axios from "axios";

const API = axios.create({ baseURL: `http://localhost:5000/` });


export const registerUser = (formData) => API.post("/user/register", formData);
export const login = (formData) => API.post("/user/login", formData);

export const likecomment = (id) => API.patch(`/comment/like/${id}`);
export const dislikecomment = (id) => API.patch(`/comment/dislike/${id}`);

// Send token with every request if user is logged in
API.interceptors.request.use((req) => {
  const profile = JSON.parse(localStorage.getItem("Profile"));
  if (profile?.token) {
    req.headers.Authorization = `Bearer ${profile.token}`;
  }
  return req;
});

export const createGroup = (groupData) => API.post("/groups", groupData);
export const fetchGroups = () => API.get("/groups");


// Channel
export const updatechaneldata = (id, updatedata) =>
  API.patch(`/user/update/${id}`, updatedata);
export const fetchallchannel = () => API.get("/user/getallchannel");

// Video
export const uploadvideo = (filedata, fileoption) =>
  API.post("/video/uploadvideo", filedata, fileoption);
export const getvideos = () => API.get("/video/getvideos");
export const likevideo = (id, Like) => API.patch(`/video/like/${id}`, { Like });
export const viewsvideo = (id) => API.patch(`/video/view/${id}`);

// Comment
export const postcomment = (commentdata) => API.post("/comment/post", commentdata);
export const deletecomment = (id) => API.delete(`/comment/delete/${id}`);
export const editcomment = (id, commentbody) =>
  API.patch(`/comment/edit/${id}`, { commentbody });
export const getallcomment = () => API.get("/comment/get");

// History
export const addtohistory = (historydata) => API.post("/video/history", historydata);
export const getallhistory = () => API.get("/video/getallhistory");
export const deletehistory = (userid) => API.delete(`/video/deletehistory/${userid}`);

// Liked Videos
export const addtolikevideo = (likedvideodata) => API.post("/video/likevideo", likedvideodata);
export const getalllikedvideo = () => API.get("/video/getalllikevide");
export const deletelikedvideo = (videoid, viewer) =>
  API.delete(`/video/deletelikevideo/${videoid}/${viewer}`);

// Watch Later
export const addtowatchlater = (watchlaterdata) => API.post("/video/watchlater", watchlaterdata);
export const getallwatchlater = () => API.get("/video/getallwatchlater");
export const deletewatchlater = (videoid, viewer) =>
  API.delete(`/video/deletewatchlater/${videoid}/${viewer}`);

