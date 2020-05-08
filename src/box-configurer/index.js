import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { moveElement } from "./ducks";
import DraggableGroup from "./group-manager";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  boxSizing: "border-box",
  padding: 10,
  width: "100%",
  minHeight: "100%",
  position: "relative",
});

const placeholderStyle = {
  position: "absolute",
  backgroundColor: "white",
  borderRadius: 3,
  border: "dashed 1px blue",
  backgroundColor: "white",
};

const Configurer = ({ list, listId, moveElement }) => {
  const onDragEnd = ({ destination, source, type }) => {
    console.log({ destination, source, type });
    if (!destination) {
      return;
    }

    const isSameDroppable = destination.droppableId === source.droppableId;
    const isSameIndex = destination.index === source.index;
    if (isSameDroppable && isSameIndex) {
      return;
    }

    const fixDestinationIndex = destination.index === -1 ? 0 : destination.index;
    const payload = {
      list: type,
      fromIndex: source.index,
      toIndex: fixDestinationIndex,
    };
    moveElement(payload);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={listId} type={listId}>
        {(provided, snapshot) => {
          console.log(JSON.stringify({ placeholder: provided.placeholder }, null, 2));
          return (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {list.map((item, index) => {
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          data-draggable-id={item.id}
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
                          <DraggableGroup type={item.content} parentKey={item.id} />
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      moveElement,
    },
    dispatch
  );
};

const mapStateToProps = ({ boxConfiguration }) => {
  const { groups, ids } = boxConfiguration;
  const listId = "ROOT";
  const list = _.get(groups, listId, []);
  const listWithItems = list.map((id) => ids[id]);
  return {
    list: listWithItems,
    listId,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Configurer);
