const authreducer = (state = { data: null }, actions) => {
  switch (actions.type) {
    case "AUTH":
      localStorage.setItem("Profile", JSON.stringify({ ...actions?.data }));
      return { ...state, data: actions?.data };

    case "ADD_POINTS":
      const updatedUser = {
        ...state.data,
        result: {
          ...state.data.result,
          points: (state.data.result.points || 0) + actions.payload, // Add points
        },
      };
      localStorage.setItem("Profile", JSON.stringify(updatedUser));
      return { ...state, data: updatedUser };

    default:
      return state;
  }
};

export default authreducer;
