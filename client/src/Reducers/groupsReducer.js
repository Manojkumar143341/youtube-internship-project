const initialState = {
  groups: [],
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ALL_GROUPS':
      return {
        ...state,
        groups: action.payload,
      };

    case 'CREATE_GROUP':
      return {
        ...state,
        groups: [...state.groups, action.payload],
      };

    default:
      return state;
  }
};

export default groupsReducer;
