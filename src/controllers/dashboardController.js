import Task from '../models/taskModel.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userTaskFilter = {
      assignedTo: req.user._id
    };

    const [totalTasks, completedTasks, pendingTasks, overdueTasks] =
      await Promise.all([
        Task.countDocuments(userTaskFilter),
        Task.countDocuments({
          ...userTaskFilter,
          status: 'DONE'
        }),
        Task.countDocuments({
          ...userTaskFilter,
          status: { $in: ['TODO', 'IN_PROGRESS'] }
        }),
        Task.countDocuments({
          ...userTaskFilter,
          status: { $ne: 'DONE' },
          dueDate: { $lt: new Date() }
        })
      ]);

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks
    });
  } catch (error) {
    next(error);
  }
};
