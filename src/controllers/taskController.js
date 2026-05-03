import mongoose from 'mongoose';

import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';
import User from '../models/userModel.js';

const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

const populateTaskUsers = (query) => {
  return query
    .populate('projectId', 'name description')
    .populate('assignedTo', 'name email role');
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateStatus = (status, res) => {
  if (!TASK_STATUSES.includes(status)) {
    res.status(400);
    throw new Error('Status must be TODO, IN_PROGRESS, or DONE');
  }
};

const parseDueDate = (dueDate, res) => {
  if (!dueDate) {
    return undefined;
  }

  const parsedDueDate = new Date(dueDate);

  if (Number.isNaN(parsedDueDate.getTime())) {
    res.status(400);
    throw new Error('Due date must be a valid date');
  }

  return parsedDueDate;
};

const getProjectById = async (projectId, res) => {
  if (!isValidObjectId(projectId)) {
    res.status(400);
    throw new Error('Invalid project id');
  }

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  return project;
};

const getTaskById = async (taskId, res) => {
  if (!isValidObjectId(taskId)) {
    res.status(400);
    throw new Error('Invalid task id');
  }

  const task = await Task.findById(taskId);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  return task;
};

const validateProjectMember = async (project, userId, res) => {
  if (!userId) {
    res.status(400);
    throw new Error('Assigned user is required');
  }

  if (!isValidObjectId(userId)) {
    res.status(400);
    throw new Error('Assigned user must be a valid user id');
  }

  const user = await User.findById(userId).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isProjectMember =
    project.createdBy.equals(user._id) ||
    project.members.some((memberId) => memberId.equals(user._id));

  if (!isProjectMember) {
    res.status(400);
    throw new Error('Assigned user must be a project member');
  }

  return user;
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, status, dueDate } =
      req.body;

    if (!title?.trim()) {
      res.status(400);
      throw new Error('Task title is required');
    }

    if (!projectId) {
      res.status(400);
      throw new Error('Project id is required');
    }

    if (!assignedTo) {
      res.status(400);
      throw new Error('Assigned user is required');
    }

    if (status) {
      validateStatus(status, res);
    }

    const project = await getProjectById(projectId, res);
    const assignedUser = await validateProjectMember(project, assignedTo, res);

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      projectId: project._id,
      assignedTo: assignedUser._id,
      status,
      dueDate: parseDueDate(dueDate, res)
    });

    const populatedTask = await populateTaskUsers(Task.findById(task._id));

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const assignTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.body.userId || req.body.assignedTo;

    if (!userId) {
      res.status(400);
      throw new Error('Assigned user is required');
    }

    const task = await getTaskById(taskId, res);
    const project = await getProjectById(task.projectId, res);
    const assignedUser = await validateProjectMember(project, userId, res);

    task.assignedTo = assignedUser._id;
    await task.save();

    const populatedTask = await populateTaskUsers(Task.findById(task._id));

    res.status(200).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const taskFilter =
      req.user.role === 'ADMIN' ? {} : { assignedTo: req.user._id };

    const tasks = await populateTaskUsers(
      Task.find(taskFilter).sort({ createdAt: -1 })
    );

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400);
      throw new Error('Status is required');
    }

    validateStatus(status, res);

    const task = await getTaskById(taskId, res);

    if (req.user.role !== 'ADMIN' && !task.assignedTo.equals(req.user._id)) {
      res.status(403);
      throw new Error('Members can only update their own tasks');
    }

    task.status = status;
    await task.save();

    const populatedTask = await populateTaskUsers(Task.findById(task._id));

    res.status(200).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await getTaskById(taskId, res);

    await task.deleteOne();

    res.status(200).json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
