import { useParams, useNavigate } from 'react-router-dom'
import { apiCallAuth } from '../../api/apiRequest'
import { useEffect, useState } from 'react'
import AddTaskModal from './components/AddTaskModal'
import DeleteTaskModal from './components/DeleteTaskModal'
import NextActionHistoryModal from './components/NextActionHistoryModal'
import { useSelector } from 'react-redux'
import UpdateProjectModal from './components/UpdateProjectModal'
import DeleteProjectModal from './components/DeleteProjectModal'
import ShareProjectModal from './components/ShareProjectModal'
import {
  Box,
  Button,
  Grid,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import EditIcon from '@mui/icons-material/Edit'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import CenteredBoxInLayout from '../../components/UI/CenteredBoxInLayout'
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

  const [sortBy, setSortBy] = useState('updatedAt') // Default sorting field
  const [sortOrder, setSortOrder] = useState('desc') // Default sorting order

  const [isForbidden, setIsForbidden] = useState(false)

  const userDetails = useSelector((state) => state.userDetails)
  const isOwner = userDetails.owner.some((p) => p._id === projectId)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [totalTasks, setTotalTasks] = useState(0)
  const [limit, setLimit] = useState(10) // Default limit is 10

  const navigate = useNavigate()

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value))
  }

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
    setSortBy('updatedAt')
    setSortOrder('desc')
    setTotalPageCount(1)
    setCurrentPage(1)
    setTotalTasks(0)
    setLimit(10)
  }
  const getTasks = async () => {
    setIsLoading(true)
    try {
      let res
      res = await apiCallAuth(
        'get',
        `/tasks/${projectId}?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${currentPage}&limit=${limit}`,
      )
      setTasks(res.data.tasks)
      setTotalPageCount(res.data.totalPageCount)
      setTotalTasks(res.data.totalTasks)
      res = await apiCallAuth('get', `/projects/${projectId}`)
      setProjectDetails(res.data)
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
  const handleSort = async (field) => {
    // If the same field is clicked again, toggle the sorting order
    if (field === sortBy) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      // Otherwise, set the new sorting field and reset the sorting order
      setSortBy(field)
      setSortOrder('desc')
    }
    await getTasks()
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPageCount))
  }

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleEdit = () => {
    if (!isEdit) {
      // edit task
      if (!selectedRow) return setError('Please select a row to edit')
      setIsEdit(true)
    }
    if (isEdit) {
      // save task
      setIsEdit(false)
      const editTask = async () => {
        try {
          const res = await apiCallAuth(
            'put',
            `/tasks/${selectedRow}`,
            selectedRowDetails,
          )

          setIsLoading(false)
          resetState()

          await getTasks()
        } catch (err) {
          console.log(err)
        }
      }
      editTask()
    }
  }

  useEffect(() => {
    getTasks()
  }, [projectId, sortBy, sortOrder, currentPage, limit])
  useEffect(() => {
    resetState()
  }, [projectId])

  return (
    <div>
      {isForbidden ? (
        <CenteredBoxInLayout>
          <Typography variant="h3" sx={{ textAlign: 'center' }}>
            Project has been locked
          </Typography>

          <Typography sx={{ textAlign: 'center' }}>
            {isOwner
              ? `Free users can only own 1 Project. If you choose not to be
              a premium user, you may unlock and use only 1 Project at a time.`
              : 'Please inform the owner to unlock the Project'}
          </Typography>

          {isOwner && (
            <Button
              variant="contained"
              fullWidth
              sx={{ marginTop: '10px', marginBottom: '10px' }}
              onClick={() => {
                const unlockProject = async () => {
                  try {
                    // put requests must have a body, if got nothing, just put null
                    const res = await apiCallAuth(
                      'put',
                      `/projects/${projectId}/unlockProject`,
                    )

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
            </Button>
          )}
          {isOwner && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/billing')}
            >
              Go Premium
            </Button>
          )}
        </CenteredBoxInLayout>
      ) : (
        <div>
          {!isLoading && (
            <Grid
              container
              justifyContent="space-between"
              spacing={2}
              style={{ marginBottom: '10px' }}
            >
              <Grid item>
                <Typography variant="h5"> {projectDetails.name}</Typography>
              </Grid>
              {/* Buttons */}
              <Grid item>
                {/* edit task button */}
                <Box display="inline-block" marginRight={1}>
                  <Tooltip title={isEdit ? 'Save Task' : 'Edit Task'}>
                    <IconButton
                      onClick={() => {
                        handleEdit()
                      }}
                    >
                      {isEdit ? <SaveAsIcon /> : <EditIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
                {/* add task button */}
                <Box display="inline-block" marginRight={1}>
                  <Tooltip title="Add Task">
                    <IconButton
                      onClick={() => {
                        setIsAddTask(!isAddTask)
                      }}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                {/* delete task button */}
                <Box display="inline-block" marginRight={1}>
                  <Tooltip title="Delete Task">
                    <IconButton
                      onClick={() => {
                        if (!selectedRow)
                          return setError('Please select a row to delete')
                        setIsConfirmDelete(true)
                      }}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                {isOwner && (
                  <Box display="inline-block" marginRight={1}>
                    <Tooltip title="Update Project">
                      <IconButton
                        variant="contained"
                        onClick={() => setIsUpdateProject(true)}
                      >
                        <EditNoteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                {isOwner && (
                  <Box display="inline-block" marginRight={1}>
                    <Tooltip title="Delete Project">
                      <IconButton
                        variant="contained"
                        onClick={() => setIsDeleteProject(true)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                {isOwner && (
                  <Box display="inline-block" marginRight={1}>
                    <Tooltip title="Share Project">
                      <IconButton
                        variant="contained"
                        onClick={() => setIsShareProject(true)}
                      >
                        <FolderSharedIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {/* Share Project Modal */}
          <ShareProjectModal
            open={isShareProject}
            onClose={() => setIsShareProject(false)}
            projectDetails={projectDetails}
            projectId={projectId}
            resetState={resetState}
            getTasks={getTasks}
          />

          {/* Delete Project Modal */}
          <DeleteProjectModal
            open={isDeleteProject}
            onClose={() => setIsDeleteProject(false)}
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
            resetState={resetState}
            getTasks={getTasks}
            updateProjectDetails={updateProjectDetails}
            setUpdateProjectDetails={setUpdateProjectDetails}
          />

          {/* Delete Task Confirmation Modal */}
          <DeleteTaskModal
            open={isConfirmDelete}
            onClose={() => setIsConfirmDelete(false)}
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
              <div style={{ height: '70vh', overflow: 'auto' }}>
                <table style={{ width: '100%' }}>
                  <thead
                    style={{
                      position: 'sticky',
                      top: '0',
                      backgroundColor: '#f2f2f2',
                    }}
                  >
                    <tr>
                      <th></th>
                      {[
                        'item',
                        'nextAction',
                        'priority',
                        'createdAt',
                        'updatedAt',
                      ].map((h) => (
                        <th
                          onClick={() => handleSort(h)}
                          style={{ cursor: 'pointer' }}
                        >
                          {h
                            .split(/(?=[A-Z])/)
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(' ')}{' '}
                          {sortBy === h && (sortOrder === 'asc' ? '^' : 'v')}
                        </th>
                      ))}
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
              {/* Pagination*/}
              <div>
                {limit === 0 ? (
                  <span>Viewing all tasks</span>
                ) : (
                  <span>
                    Viewing task {(currentPage - 1) * limit + 1} to{' '}
                    {currentPage * limit > totalTasks
                      ? totalTasks
                      : currentPage * limit}{' '}
                    out of {totalTasks}
                  </span>
                )}

                <IconButton
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ArrowLeftIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextPage}
                  disabled={currentPage === totalPageCount}
                >
                  <ArrowRightIcon />
                </IconButton>
              </div>
              {/* Page limit */}
              <div>
                <label htmlFor="limitSelect">Tasks per page:</label>
                <select
                  id="limitSelect"
                  value={limit}
                  onChange={handleLimitChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="0">All</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Project
