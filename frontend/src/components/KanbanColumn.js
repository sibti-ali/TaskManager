import React from 'react';
import { Droppable } from '@hello-pangea/dnd';

import TaskCard from './TaskCard';

export default function KanbanColumn({ status, tasks }) {
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div style={{ flex: 1, minWidth: '300px' }}>
      <h4 className="text-center">{capitalize(status)}</h4>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="bg-light p-3 rounded shadow-sm"
            style={{
              minHeight: '400px',
              backgroundColor: snapshot.isDraggingOver ? '#e9ecef' : '#f8f9fa',
              transition: 'background-color 0.2s',
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
