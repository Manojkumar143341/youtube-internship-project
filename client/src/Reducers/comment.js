const commentReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case "POST_COMMENT":
      return { ...state, data: [...state.data, action.payload] };
    case "EDIT_COMMENT":
      return {
        ...state,
        data: state.data.map(c => c._id === action.payload._id ? action.payload : c),
      };
    case "FETCH_ALL_COMMENTS":
      return { ...state, data: action.payload };
    case "DELETE_COMMENT":
      return { ...state, data: state.data.filter(c => c._id !== action.payload) };
    case "DISLIKE_COMMENT":
      return {
        ...state,
        data: state.data.map(c => c._id === action.payload._id ? action.payload : c),
      };
    default:
      return state;
  }
};
