import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import TaskCard from "@/components/molecules/TaskCard";
import { taskService } from "@/services";
const SortableTaskCard = ({ task, categories, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.Id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <TaskCard
        task={task}
        categories={categories}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
};

const TaskList = ({ 
  tasks = [], 
  categories = [], 
  onTaskUpdate, 
  onTaskDelete,
  enableDragAndDrop = true,
  className = '' 
}) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localTasks.findIndex(task => task.Id === active.id);
      const newIndex = localTasks.findIndex(task => task.Id === over.id);

      const newTasks = arrayMove(localTasks, oldIndex, newIndex);
      setLocalTasks(newTasks);

      try {
        const taskIds = newTasks.map(task => task.Id);
        await taskService.reorder(taskIds);
      } catch (error) {
        // Revert on error
        setLocalTasks(localTasks);
        toast.error('Failed to reorder tasks');
      }
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setLocalTasks(prev => 
      prev.map(task => task.Id === updatedTask.Id ? updatedTask : task)
    );
    if (onTaskUpdate) onTaskUpdate(updatedTask);
  };

  const handleTaskDelete = (taskId) => {
    setLocalTasks(prev => prev.filter(task => task.Id !== taskId));
    if (onTaskDelete) onTaskDelete(taskId);
  };

// Update local tasks when tasks prop changes
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const taskList = enableDragAndDrop ? localTasks : tasks;

  if (!enableDragAndDrop) {
    return (
      <div className={`space-y-4 ${className}`}>
        <AnimatePresence mode="popLayout">
          {taskList.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <TaskCard
                task={task}
                categories={categories}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={taskList.map(task => task.Id)} strategy={verticalListSortingStrategy}>
        <div className={`space-y-4 ${className}`}>
          <AnimatePresence mode="popLayout">
            {taskList.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <SortableTaskCard
                  task={task}
                  categories={categories}
                  onUpdate={handleTaskUpdate}
                  onDelete={handleTaskDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;