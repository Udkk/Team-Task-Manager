import mongoose from 'mongoose';

import Project from '../models/projectModel.js';
import User from '../models/userModel.js';

const populateProjectUsers = (query) => {
  return query
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role');
};

const getProjectById = async (projectId, res) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
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

export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      res.status(400);
      throw new Error('Project name is required');
    }

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim(),
      createdBy: req.user._id,
      members: [req.user._id]
    });

    const populatedProject = await populateProjectUsers(
      Project.findById(project._id)
    );

    res.status(201).json(populatedProject);
  } catch (error) {
    next(error);
  }
};

export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await populateProjectUsers(
      Project.find({
        $or: [{ createdBy: req.user._id }, { members: req.user._id }]
      }).sort({ createdAt: -1 })
    );

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getAvailableProjectUsers = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await getProjectById(projectId, res);

    if (!project.createdBy.equals(req.user._id)) {
      res.status(403);
      throw new Error('Only the project creator can view available members');
    }

    const excludedUserIds = [project.createdBy, ...project.members];
    const users = await User.find({
      _id: { $nin: excludedUserIds }
    })
      .select('_id name email')
      .sort({ name: 1 });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const addProjectMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error('User id must be a valid ObjectId');
    }

    const project = await getProjectById(projectId, res);

    if (!project.createdBy.equals(req.user._id)) {
      res.status(403);
      throw new Error('Only the project creator can add members');
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const isAlreadyMember = project.members.some((memberId) =>
      memberId.equals(user._id)
    );

    if (isAlreadyMember) {
      res.status(400);
      throw new Error('User is already a project member');
    }

    project.members.push(user._id);
    await project.save();

    const populatedProject = await populateProjectUsers(
      Project.findById(project._id)
    );

    res.status(200).json(populatedProject);
  } catch (error) {
    next(error);
  }
};
