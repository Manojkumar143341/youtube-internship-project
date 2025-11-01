import * as api from '../Api';

// Fetch all groups
export const getAllGroups = () => async (dispatch) => {
  try {
    const { data } = await api.fetchGroups();
    dispatch({ type: 'FETCH_ALL_GROUPS', payload: data });
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
};

// Create a group and dispatch the created group directly
export const createGroup = (groupData) => async (dispatch) => {
  try {
    const { data } = await api.createGroup(groupData);
    dispatch({ type: 'CREATE_GROUP', payload: data });
  } catch (error) {
    console.error('Error creating group:', error);
  }
};
