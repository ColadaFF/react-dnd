import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

const getItems = (count, parentKey) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `sub-item-${k}-${parentKey}`,
    content: `sub-item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 10px 10px 0`,

  display: "inline-flex",
  width: "120px",
  padding: "10px",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",
  display: "inline-flex",
  padding: "10px",
  margin: "0 10px 10px 0",
  border: "1px solid grey",
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  margin: "10px 0",
});

class GroupManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: getItems(4, props.parentKey),
    };
  }

  render() {
    const { type } = this.props;
    return (
      <Droppable droppableId={type} type={type}>
        {(provided, snapshot) => {
          console.log("is", { placeholder: provided.placeholder });
          return (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      {item.content}
                      <span
                        {...provided.dragHandleProps}
                        style={{ display: "inline-block", margin: "0 10px", border: "1px solid #000" }}
                      >
                        Drag
                      </span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    );
  }
}

export default GroupManager;
