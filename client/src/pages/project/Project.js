import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'

const apiUrl = process.env.REACT_APP_API_URL

const Project = (props) => {
  const { projectId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedRowDetails, setSelectedRowDetails] = useState({})
  const [isAddTask, setIsAddTask] = useState(false)
  const [addTaskDetails, setAddTaskDetails] = useState({})
  const [isConfirmDelete, setIsConfirmDelete] = useState(false)

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
    setAddTaskDetails({})
    setSelectedRow(null)
  }
  const getTasks = async () => {
    try {
      if (!token) throw new Error('JWT Token doesnt exist')
      const headers = {
        Authorization: token,
      }
      const res = await axios.get(`${apiUrl}/tasks/${projectId}`, {
        headers,
      })
      console.log(res)
      setIsLoading(false)
      setTasks(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getTasks()
    resetState()
  }, [projectId])

  return (
    <div>
      <div>Project</div>
      <div>{projectId}</div>
      <div>
        <span>Actions tool bar</span>
        {/* edit task button */}
        <button
          onClick={() => {
            if (!isEdit) {
              // edit task
              if (!selectedRow) return setError('Please select a row to edit')
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
      </div>
      {/* delete task button */}
      <button
        onClick={() => {
          console.log('attempt delete task!')
          if (!selectedRow) return setError('Please select a row to delete')
          setIsConfirmDelete(true)
        }}
      >
        Delete Task
      </button>

      {error && <div>{error}</div>}

      {/* Delete Task confirmation (refactor next time) */}
      {isConfirmDelete && (
        <button
          onClick={() => {
            console.log('deleted!!!!!!')
            const deleteTask = async () => {
              setIsLoading(true)
              try {
                if (!token) throw new Error('JWT Token doesnt exist')
                const headers = {
                  Authorization: token,
                }
                const res = await axios.delete(
                  `${apiUrl}/tasks/${selectedRow}`,
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
            deleteTask()
          }}
        >
          Confirm Delete
        </button>
      )}

      {/* Add  Task Module (refactor next time)*/}
      {isAddTask && (
        <div>
          <h3>Add Task </h3>
          <div>
            <label>
              Item:
              <input
                type="text"
                value={addTaskDetails.item || ''}
                onChange={(event) => {
                  setAddTaskDetails({
                    ...addTaskDetails,
                    item: event.target.value,
                  })
                }}
              />
            </label>

            <label>
              Next Action:
              <input
                type="text"
                value={addTaskDetails.nextAction || ''}
                onChange={(event) => {
                  setAddTaskDetails({
                    ...addTaskDetails,
                    nextAction: event.target.value,
                  })
                }}
              />
            </label>

            <label>
              Priority:
              <input
                type="number"
                value={addTaskDetails.priority || ''}
                onChange={(event) => {
                  setAddTaskDetails({
                    ...addTaskDetails,
                    priority: event.target.value,
                  })
                }}
              />
            </label>

            <div>
              <button
                onClick={() => {
                  setIsLoading(true)
                  const addTask = async () => {
                    try {
                      if (!token) throw new Error('JWT Token doesnt exist')
                      const headers = {
                        Authorization: token,
                      }
                      const res = await axios.post(
                        `${apiUrl}/tasks`,
                        { ...addTaskDetails, project: projectId },
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
                  addTask()
                }}
              >
                Confirm Add Task
              </button>
            </div>
          </div>
        </div>
      )}
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
  )
}

export default Project
