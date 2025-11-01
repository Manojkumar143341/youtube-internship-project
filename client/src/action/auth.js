import * as api from "../Api";
import { setcurrentuser } from "./currentuser";

// LOGIN
export const login = (authdata) => async (dispatch) => {
  try {
    // Call backend login API
    const { data } = await api.login(authdata);
    // Dispatch AUTH action with received data
    dispatch({ type: "AUTH", data });
    // Update current user in redux from localStorage Profile
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
  } catch (error) {
    alert(error.message || error);
  }
};

// LOGOUT
export const logout = () => async (dispatch) => {
  try {
    // Remove user profile from localStorage
    localStorage.removeItem("Profile");
    // Dispatch LOGOUT action
    dispatch({ type: "LOGOUT" });
    // Reset current user slice
    dispatch(setcurrentuser(null));
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// ADD POINTS to user (e.g. after watching video)
export const addPoints = (points) => async (dispatch) => {
  dispatch({ type: "ADD_POINTS", payload: points });
};

// UPDATE USER PLAN (free, bronze, silver, gold)
export const updateUserPlan = (plan) => async (dispatch) => {
  try {
    // You may add API call here if you want to update server DB as well
    // const { data } = await api.updateUserPlan(plan);

    // Update redux state
    dispatch({ type: "UPDATE_USER_PLAN", payload: plan });

    // Update localStorage and redux current user slice
    const profile = JSON.parse(localStorage.getItem("Profile")) || {};
    profile.plan = plan;
    localStorage.setItem("Profile", JSON.stringify(profile));
    dispatch(setcurrentuser(profile));
  } catch (error) {
    console.error("Plan update error:", error);
  }
};
export const register = (formData) => async (dispatch) => {
  try {
    const { data } = await api.registerUser(formData); // call your backend /signup endpoint
    dispatch({ type: "AUTH", data }); // store user info in Redux
    localStorage.setItem("Profile", JSON.stringify(data)); // persist login
  } catch (error) {
    console.log("Registration error:", error.response?.data?.message || error.message);
    alert(error.response?.data?.message || "Registration failed");
  }
};
