import * as api from "../Api";

// Edit a comment
export const editcomment = (commentdata) => async (dispatch) => {
  try {
    const { id, commentbody } = commentdata;
    const { data } = await api.editcomment(id, commentbody);
    dispatch({ type: "EDIT_COMMENT", payload: data });
    dispatch(getallcomment());
  } catch (error) {
    console.error(error);
  }
};

// Post a new comment
export const postcomment = (commentdata) => async (dispatch) => {
  try {
    const { data } = await api.postcomment(commentdata);
    dispatch({ type: "POST_COMMENT", payload: data });
    dispatch(getallcomment());
  } catch (error) {
    console.error(error);
  }
};

// Fetch all comments
export const getallcomment = () => async (dispatch) => {
  try {
    const { data } = await api.getallcomment();
    dispatch({ type: "FETCH_ALL_COMMENTS", payload: data });
  } catch (error) {
    console.error(error);
  }
};

// Delete a comment
export const deletecomment = (id) => async (dispatch) => {
  try {
    await api.deletecomment(id);
    dispatch(getallcomment());
  } catch (error) {
    console.error(error);
  }
};
export const dislikeComment = (id) => async (dispatch) => {
  try {
    const { data } = await api.dislikecomment(id);
    if (data.dislikes >= 2) {
      await api.deletecomment(id);
      dispatch({ type: "DELETE_COMMENT", payload: id });
    } else {
      dispatch({ type: "DISLIKE_COMMENT", payload: data });
    }
    dispatch(getallcomment());
  } catch (error) {
    console.error(error);
  }
};
// Like a comment
export const likecomment = (id) => async (dispatch) => {
  try {
    const { data } = await api.likecomment(id);  // make sure api.likecomment exists
    dispatch({ type: "LIKE_COMMENT", payload: data });
    dispatch(getallcomment());
  } catch (error) {
    console.error(error);
  }
};
