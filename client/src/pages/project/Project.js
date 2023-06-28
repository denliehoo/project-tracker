import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import AddTaskModal from './components/AddTaskModal'
import DeleteTaskModal from './components/DeleteTaskModal'
import NextActionHistoryModal from './components/NextActionHistoryModal'
import { useSelector } from 'react-redux'
import UpdateProjectModal from './components/UpdateProjectModal'
import DeleteProjectModal from './components/DeleteProjectModal'
import ShareProjectModal from './components/ShareProjectModal'

const apiUrl = process.env.REACT_APP_API_URL

const Project = (props) => {
  const { projectId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [projectDetails, setProjectDetails] = useState({})
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedRowDetails, setSelectedRowDetails] = useState({})

  const [isAddTask, setIsAddTask] = useState(false)

  const [isConfirmDelete, setIsConfirmDelete] = useState(false)

  const [nextActionHistory, setNextActionHistory] = useState([])
  const [nextActionHistoryItem, setNextActionHistoryItem] = useState('')

  const [isUpdateProject, setIsUpdateProject] = useState(false)
  const [isDeleteProject, setIsDeleteProject] = useState(false)
  const [isShareProject, setIsShareProject] = useState(false)

  const [updateProjectDetails, setUpdateProjectDetails] = useState({})

  const [isForbidden, setIsForbidden] = useState(false)

  const userDetails = useSelector((state) => state.userDetails)
  const isOwner = userDetails.owner.some((p) => p._id === projectId)

  const token = localStorage.getItem('JWT')
  const handleCheckboxChange = (rowId) => {
    setError('')
    setSelectedRow(rowId)
  }

  const resetState = () => {
    setError('')
    setIsEdit(false)
    setIsAddTask(false)
    setIsConfirmDelete(false)
    setSelectedRowDetails({})
    setSelectedRow(null)
    setIsUpdateProject(false)
    setIsDeleteProject(false)
    setIsShareProject(false)
    setNextActionHistory([])
    setNextActionHistoryItem('')
    setIsForbidden(false)
  }
  const getTasks = async () => {
    try {
      if (!token) throw new Error('JWT Token doesnt exist')
      const headers = {
        Authorization: token,
      }
      let res = await axios.get(`${apiUrl}/tasks/${projectId}`, {
        headers,
      })

      setTasks(res.data)
      res = await axios.get(`${apiUrl}/projects/${projectId}`, {
        headers,
      })
      setProjectDetails(res.data)
      console.log(res.data)
      setUpdateProjectDetails({
        name: res.data.name,
        description: res.data.description,
      })
      setIsLoading(false)
    } catch (err) {
      resetState()
      setError(err.response.data.error)
      if (err.response.status === 403) setIsForbidden(true)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getTasks()
    resetState()
  }, [projectId])

  return (
    <div>
      {isForbidden ? (
        <div>
          Project has been locked...
          <button
            onClick={() => {
              const unlockProject = async () => {
                try {
                  if (!token) throw new Error('JWT Token doesnt exist')
                  const headers = {
                    Authorization: token,
                  }
                  console.log(token)
                  console.log(projectId)
                  // put requests must have a body, if got nothing, just put null
                  const res = await axios.put(
                    `${apiUrl}/projects/${projectId}/unlockProject`,
                    null,
                    {
                      headers,
                    },
                  )
                  console.log(res)

                  setIsLoading(false)
                  resetState()
                  setIsForbidden(false)

                  await getTasks()
                } catch (err) {
                  console.log(err)
                }
              }
              unlockProject()
            }}
          >
            Unlock Project
          </button>
        </div>
      ) : (
        <div>
          {!isLoading && (
            <div>
              Project: {projectDetails.name} {projectId}
            </div>
          )}
          {!isLoading && (
            <div>
              <span>Actions tool bar</span>
              {/* edit task button */}
              <button
                onClick={() => {
                  if (!isEdit) {
                    // edit task
                    if (!selectedRow)
                      return setError('Please select a row to edit')
                    setIsEdit(true)
                  }
                  if (isEdit) {
                    // save task
                    setIsEdit(false)
                    console.log(selectedRow)
                    console.log(selectedRowDetails)
                    const editTask = async () => {
                      try {
                        if (!token) throw new Error('JWT Token doesnt exist')
                        const headers = {
                          Authorization: token,
                        }
                        const res = await axios.put(
                          `${apiUrl}/tasks/${selectedRow}`,
                          selectedRowDetails,
                          {
                            headers,
                          },
                        )
                        console.log(res)

                        setIsLoading(false)
                        resetState()

                        await getTasks()
                      } catch (err) {
                        console.log(err)
                      }
                    }
                    editTask()
                  }
                }}
              >
                {isEdit ? 'Save Task' : 'Edit Task'}
              </button>
              {/* add task button */}
              <button
                onClick={() => {
                  console.log('add task!')
                  setIsAddTask(!isAddTask)
                }}
              >
                Add Task
              </button>
              {/* delete task button */}
              <button
                onClick={() => {
                  console.log('attempt delete task!')
                  if (!selectedRow)
                    return setError('Please select a row to delete')
                  setIsConfirmDelete(true)
                }}
              >
                Delete Task
              </button>
              {isOwner && (
                <button onClick={() => setIsUpdateProject(true)}>
                  Update Project
                </button>
              )}
              {isOwner && (
                <button onClick={() => setIsDeleteProject(true)}>
                  Delete Project
                </button>
              )}
              {isOwner && (
                <button onClick={() => setIsShareProject(true)}>
                  Share Project
                </button>
              )}
            </div>
          )}
          {/* Share Project Modal */}
          <ShareProjectModal
            open={isShareProject}
            onClose={() => setIsShareProject(false)}
            token={token}
            apiUrl={apiUrl}
            projectDetails={projectDetails}
            projectId={projectId}
            resetState={resetState}
            getTasks={getTasks}
          />

          {/* Delete Project Modal */}
          <DeleteProjectModal
            open={isDeleteProject}
            onClose={() => setIsDeleteProject(false)}
            token={token}
            apiUrl={apiUrl}
            projectName={projectDetails.name}
            projectId={projectId}
            resetState={resetState}
            getTasks={getTasks}
          />

          {/* Update project modal */}
          <UpdateProjectModal
            open={isUpdateProject}
            onClose={() => {
              setIsUpdateProject(false)
              setUpdateProjectDetails({
                name: projectDetails.name,
                description: projectDetails.description,
              })
            }}
            projectId={projectId}
            projectDetails={projectDetails}
            token={token}
            apiUrl={apiUrl}
            resetState={resetState}
            getTasks={getTasks}
            updateProjectDetails={updateProjectDetails}
            setUpdateProjectDetails={setUpdateProjectDetails}
          />

          {/* Delete Task Confirmation Modal */}
          <DeleteTaskModal
            open={isConfirmDelete}
            onClose={() => setIsConfirmDelete(false)}
            token={token}
            apiUrl={apiUrl}
            selectedRow={selectedRow}
            resetState={resetState}
            getTasks={getTasks}
          />

          {/* Add Task Modal*/}
          <AddTaskModal
            open={isAddTask}
            onClose={() => {
              setIsAddTask(false)
            }}
            token={token}
            apiUrl={apiUrl}
            projectId={projectId}
            resetState={resetState}
            getTasks={getTasks}
          />

          {/* Next action history */}
          <NextActionHistoryModal
            open={nextActionHistoryItem}
            onClose={() => {
              setNextActionHistory([])
              setNextActionHistoryItem('')
            }}
            nextActionHistory={nextActionHistory}
            nextActionHistoryItem={nextActionHistoryItem}
          />

          {error && <div>{error}</div>}
          {/* Table */}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Item</th>
                    <th>Next Action</th>
                    <th>Priority</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((t) => (
                      <tr key={t._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRow === t._id}
                            onChange={() => {
                              handleCheckboxChange(t._id)
                              setSelectedRowDetails({
                                item: t.item,
                                nextAction: t.nextAction,
                                priority: t.priority,
                              })
                            }}
                          />
                        </td>
                        <td>
                          {isEdit && t._id === selectedRow ? (
                            <input
                              type="text"
                              value={selectedRowDetails.item}
                              onChange={(event) => {
                                setSelectedRowDetails({
                                  ...selectedRowDetails,
                                  item: event.target.value,
                                })
                              }}
                            />
                          ) : (
                            t.item
                          )}
                        </td>
                        <td>
                          {isEdit && t._id === selectedRow ? (
                            <input
                              type="text"
                              value={selectedRowDetails.nextAction}
                              onChange={(event) => {
                                setSelectedRowDetails({
                                  ...selectedRowDetails,
                                  nextAction: event.target.value,
                                })
                              }}
                            />
                          ) : (
                            <span
                              onClick={() => {
                                console.log(t.nextActionHistory)
                                setNextActionHistoryItem(t.item)
                                setNextActionHistory(t.nextActionHistory)
                              }}
                            >
                              {t.nextAction}
                            </span>
                          )}
                        </td>
                        <td>
                          {isEdit && t._id === selectedRow ? (
                            <input
                              type="number"
                              value={selectedRowDetails.priority}
                              onChange={(event) => {
                                setSelectedRowDetails({
                                  ...selectedRowDetails,
                                  priority: event.target.value,
                                })
                              }}
                            />
                          ) : (
                            t.priority
                          )}
                        </td>
                        <td>{t.createdAt}</td>
                        <td>{t.updatedAt}</td>
                      </tr>
                    ))
                  ) : (
                    <div>You have no tasks!</div>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Project
