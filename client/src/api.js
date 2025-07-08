import axios from "axios";

// const BASE_URL = "http://localhost:5003/api";
const BASE_URL = "https://plannerback-1.onrender.com";

//add the main task
export const addMainTask = (taskData)=> axios.post(`${BASE_URL}/tasks`,taskData)

// add subtask for the maintask
export const addSubTask = (taskId, subTaskData)=> axios.post(`${BASE_URL}/${taskId}/subtasks`,subTaskData)

// edit main task
export const editMainTask = (taskid,updatedData )=> axios.patch(`${BASE_URL}/edit/${taskid}`, updatedData)

// edit subtask
export const editsubTask = async (taskId, subTaskId, updatedData) => {
    console.log("PATCH URL:", `${BASE_URL}/${taskId}/subtasks/${subTaskId}`);
    console.log("Payload:", updatedData);
  
    try {
      const response = await axios.patch(
        `${BASE_URL}/${taskId}/subtasks/${subTaskId}`,
        updatedData
      );
      console.log("✅ Response from backend:", response);
      return response;
    } catch (error) {
      console.error("❌ editsubTask API error:", error.response?.data || error.message);
      throw error;
    }
  };
// get all tasks
export const getallTask = ()=> axios.get(`${BASE_URL}/tasks`)

//get all subtasks which are completed
export const getCompletedSubtasks = ()=> axios.get(`${BASE_URL}/subtasksCompleted`)

// delete task
export const deleteTask = (taskId) => axios.delete(`${BASE_URL}/${taskId}`)