// Create a utility function to handle API requests
import axios from 'axios'

class ApiCallError extends Error {
  constructor(message, responseStatus) {
    super(message)
    this.responseStatus = responseStatus
  }
}

const apiCallAuth = async (method, subUrl, data = null) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const token = localStorage.getItem('JWT')
  try {
    if (!token) throw new ApiCallError('JWT Token does not exist', 401)

    const headers = {
      Authorization: token,
    }

    const config = {
      method: method,
      url: `${apiUrl}${subUrl}`,
      headers: headers,
      data: data,
    }

    const res = await axios(config)
    return res
  } catch (err) {
    console.log(err)
    if (
      err instanceof ApiCallError ||
      (err.response && err.response.status === 401)
    ) {
      console.log('here')
      // Token expired or unauthorized, redirect to login page
      window.location.href = 'http://localhost:3000/login'
    } else {
      throw err
    }
  }
}

export { apiCallAuth }
/*
  // Now you can use this utility function for any API call with different methods
  const editTask = async () => {
    try {
      const res = await apiCallAuth('put', `/tasks/${selectedRow}`, selectedRowDetails);
      console.log(res);
  
      setIsLoading(false);
      resetState();
      await getTasks();
    } catch (err) {
      console.log(err);
    }
  };
  
  // Example usage for other request types
  const getTask = async (taskId) => {
    try {
      const res = await apiCallAuth('get', `/tasks/${taskId}`, null);
      console.log(res);
      // Handle the response data or perform further actions
    } catch (err) {
      console.log(err);
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      const res = await apiCallAuth('delete', `/tasks/${taskId}`, null);
      console.log(res);
      // Handle the response data or perform further actions
    } catch (err) {
      console.log(err);
    }
  };
  
  // And so on for other API calls...
  */
