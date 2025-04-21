import React from 'react';
import { Draggable } from '@hello-pangea/dnd';


export default function TaskCard({ task, index }) {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          className="card mb-3"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: snapshot.isDragging ? '#fff3cd' : 'white',
            borderColor: '#dee2e6',
            ...{
              transition: 'box-shadow 0.2s ease',
              boxShadow: snapshot.isDragging ? '0 4px 10px rgba(0,0,0,0.15)' : 'none',
            }
          }}
        >
          <div className="card-body">
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text text-muted">{task.description}</p>
            <small className="text-muted">Due: {new Date(task.dueDate).toLocaleDateString('en-GB')}</small>
          </div>
        </div>
      )}
    </Draggable>
  );
}
