const initialState = {
  list: [],       // All groups
  messages: {},   // Messages keyed by groupId
  activeGroup: null // Currently open group in chat
};

const groups = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ALL_GROUPS":
      return { ...state, list: action.payload };

    case "CREATE_GROUP":
      return { ...state, list: [...state.list, action.payload] };

    case "SET_ACTIVE_GROUP":
      return { ...state, activeGroup: action.payload };

    case "NEW_MESSAGE":
      const { groupId, text } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [groupId]: [...(state.messages[groupId] || []), { text }]
        }
      };

    case "SET_MESSAGES":
      // For loading old messages from DB
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.groupId]: action.payload.messages
        }
      };

    default:
      return state;
  }
};

export default groups;
