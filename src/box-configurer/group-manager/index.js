import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Row, Col } from "react-flexbox-grid";
import _ from "lodash";
import { moveElement } from "../ducks";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  display: "inline-flex",
  width: "100%",
  boxSizing: "border-box",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",
  border: "1px solid grey",
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  margin: "10px 0",
});

const HorizontalGroup = ({ parentKey, list }) => {
  const isEmptyList = _.size(list) === 0;
  if (isEmptyList) {
    return null;
  }

  return (
    <Droppable droppableId={parentKey} type={parentKey} direction="horizontal">
      {(provided, snapshot) => {
        console.log("is", { placeholder: provided.placeholder });
        return (
          <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            <Row>
              {list.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <Col xs={6}>
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
                    </Col>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Row>
          </div>
        );
      }}
    </Droppable>
  );
};

const mapStateToProps = ({ boxConfiguration }, ownProps) => {
  const { parentKey } = ownProps;
  const { groups, ids } = boxConfiguration;
  const list = _.get(groups, parentKey, []);
  const listWithValues = list.map((id) => {
    return ids[id];
  });
  return {
    list: listWithValues,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      moveElement,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HorizontalGroup);
