import models from "../../models";
const { Project } = models;

const getAllProjects = async (req, res) => {
  const projects = await Project.find();
  return res.send(projects);
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  return res.send(project);
};

const createProject = async (req, res) => {
  let project;
  try {
    project = await Project.create({
      projectName: req.body.projectName,
      projectId: req.body.projectId,
    });
  } catch (error) {
    return res.status(400).json({ error: error.toString() });
  }
  return res.send(project);
};

export { getAllProjects, getProjectById, createProject };
