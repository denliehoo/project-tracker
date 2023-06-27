import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'

const apiUrl = process.env.REACT_APP_API_URL

const Project = (props) => {
  const { projectId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshData, setRefreshData] = useState(true)
  const [tasks, setTasks] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [error, setError] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [editDetails, setEditDetails] = useState({})
  const token = localStorage.getItem('JWT')
  const handleCheckboxChange = (rowId) => {
    setError('')
    setSelectedRow(rowId)
  }

  useEffect(() => {
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
        setRefreshData(false)
      } catch (err) {
        console.log(err)
        setRefreshData(false)
      }
    }
    if (refreshData) getTasks()
  }, [projectId, refreshData])

  return (
    <div>
      <div>Project</div>
      <div>{projectId}</div>
      <div>
        <span>Actions tool bar</span>
        <button
          onClick={() => {
            if (!isEdit) {
              if (!selectedRow) return setError('Please select a row')
              setIsEdit(true)
            }
            if (isEdit) {
              setIsEdit(false)
              console.log(selectedRow)
              console.log(editDetails)
              const editTask = async () => {
                try {
                  if (!token) throw new Error('JWT Token doesnt exist')
                  const headers = {
                    Authorization: token,
                  }
                  const res = await axios.put(
                    `${apiUrl}/tasks/${selectedRow}`,
                    editDetails,
                    {
                      headers,
                    },
                  )
                  console.log(res)
                  setIsLoading(false)
                  setRefreshData(true)
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
      </div>
      {error && <div>{error}</div>}
      <button
        onClick={() => {
          console.log(editDetails)
        }}
      >
        Log edit details
      </button>

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
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRow === t._id}
                      onChange={() => {
                        handleCheckboxChange(t._id)
                        setEditDetails({
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
                        value={editDetails.item}
                        onChange={(event) => {
                          setEditDetails({
                            ...editDetails,
                            item: event.target.value,
                          })
                        }}
                      />
                    ) : (
                      t.item
                    )}
                  </td>
                  <td
                    onClick={() => {
                      console.log(t.nextActionHistory)
                    }}
                  >
                    {t.nextAction}
                  </td>
                  <td>{t.priority}</td>
                  <td>{t.createdAt}</td>
                  <td>{t.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Project
