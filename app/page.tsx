'use client';

import React, { useState, useEffect } from 'react';
import TranscriptParser from './components/TranscriptParser';
import TaskList from './components/TaskList';
import TaskEditModal from './components/TaskEditModal';
import ConfirmationDialog from './components/ConfirmationDialog';
import { Task } from './types';
import { loadTasks, saveTasks } from './utils/localStorage';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    taskId: string | null;
    taskDescription: string;
  }>({
    isOpen: false,
    taskId: null,
    taskDescription: '',
  });

  useEffect(() => {
    const savedTasks = loadTasks();
    setTasks(savedTasks);
  }, []);

  const handleTasksExtracted = (newTasks: Task[]) => {
    const updatedTasks = [...tasks, ...newTasks];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleToggleComplete = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (editedTask: Task) => {
    const updatedTasks = tasks.map(task =>
      task.id === editedTask.id ? editedTask : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete) {
      setDeleteConfirmation({
        isOpen: true,
        taskId,
        taskDescription: taskToDelete.description,
      });
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmation.taskId) {
      const updatedTasks = tasks.filter(task => task.id !== deleteConfirmation.taskId);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    }
    setDeleteConfirmation({
      isOpen: false,
      taskId: null,
      taskDescription: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Natural Language Task Manager
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="space-y-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                  <div className="p-6">
                    <TranscriptParser onTasksExtracted={handleTasksExtracted} />
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Tasks</h2>
                    <TaskList
                      tasks={tasks}
                      onToggleComplete={handleToggleComplete}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <TaskEditModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, taskId: null, taskDescription: '' })}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete this task? "${deleteConfirmation.taskDescription}"`}
      />
    </div>
  );
}
