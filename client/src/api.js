import axios from "axios";

// const BASE_URL = "http://localhost:5003/api";
const BASE_URL = "https://plannerback-1.onrender.com/";

//add the main task
export const addMainTask = (taskData)=> axios.post(`${BASE_URL}/tasks`,taskData)

// add subtask for the maintask
export const addSubTask = (taskId, subTaskData)=> axios.post(`${BASE_URL}/${taskId}/subtasks`,subTaskData)

// edit main task
export const editMainTask = (taskid,updatedData )=> axios.patch(`${BASE_URL}/edit/${taskid}`, updatedData)

// edit subtask
export const editsubTask = (taskId,subTaskId,updatedData) => axios.patch(`${BASE_URL}/${taskId}/subtasks/${subTaskId}`,updatedData)

// get all tasks
export const getallTask = ()=> axios.get(`${BASE_URL}/tasks`)

// delete task
export const deleteTask = (taskId) => axios.delete(`${BASE_URL}/${taskId}`)