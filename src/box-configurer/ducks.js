import _ from "lodash";
import data from "./data.json";

function createInitialState(data = []) {
  const ids = data.reduce((acc, current) => {
    return {
      ...acc,
      [current.id]: current,
    };
  }, {});

  const groups = _.groupBy(data, "group");
  const orderedGroups = _.mapValues(groups, (items) => {
    return _.sortBy(items, "configuration.order").map((item) => item.id);
  });

  return {
    ids,
    groups: orderedGroups,
  };
}

const MOVE_ELEMENT = "widget-config/manager/MOVE_ELEMENT";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const initialState = createInitialState(data);
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case MOVE_ELEMENT: {
      const { list, fromIndex, toIndex } = action.payload;
      const currentList = state.groups[list];
      const newList = reorder(currentList, fromIndex, toIndex);
      console.log(JSON.stringify({ currentList, newList }, null, 2));
      return {
        ...state,
        groups: {
          ...state.groups,
          [list]: newList,
        },
      };
    }
    default:
      return state;
  }
}

export function moveElement({ list, fromIndex, toIndex }) {
  return {
    type: MOVE_ELEMENT,
    payload: {
      list,
      fromIndex,
      toIndex,
    },
  };
}
