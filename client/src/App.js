import React,{useEffect, useState} from 'react'
import { addMainTask, addSubTask, getallTask, editMainTask, editsubTask, deleteTask } from './api';
import ProgressBar from "@ramonak/react-progress-bar";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const App = ()=>{
  const [mainTasks, setMainTasks] = useState([]);
  const [subTasks, setSubTasks] = useState({});
  const [taskText, setTaskTexts] = useState("");

  const calculateProgress = (task)=>{
    if(!task.subTasks || task.subTasks.length===0){
      return task.completed? 100: 0;
    }
    const completedSubtasks = task.subTasks.filter(s=>s.completed).length
    const totalSubTasks = task.subTasks.length;
    return Math.round((completedSubtasks/totalSubTasks)*100)

  }

  const handleAddTask = async()=>{
    if(!taskText.trim()) return;
    try{
      const response = await addMainTask({title: taskText, completed: false});
      console.log("Response Data:",response.data)
      setMainTasks([...mainTasks, {...response.data, isExpanded: false}]);
      setTaskTexts("");
    }
    catch(err){
      console.error("Failed to add task", err)
    }


  }

  const handleAddSubTask = async(MainTaskId)=>{
    if(!subTasks[MainTaskId].trim())return;
    
    const subTaskData = {
      title: subTasks[MainTaskId],
      completed: false

    }

    try{
      
      const response = await addSubTask(MainTaskId,subTaskData);
      const newSubTask = response.data
      console.log("response of subtask post api:", response.data)

      setSubTasks(prev => ({...prev, [MainTaskId]:''}))

      setMainTasks(prevTasks => prevTasks.map(task =>{
       if(task._id === MainTaskId){
        return{
          ...task,
          isExpanded: true,
          subTasks: [...(task.subTasks || []),newSubTask]

        }
       
      
       }
        return task;

    })
  );
    
      
    }catch(err){
      console.error("Failed to add subtask", err)
    }

  }

  const handleSubTaskInputChange = (taskId, value)=>{
    setSubTasks(prev => ({
      ...prev,
      [taskId]:value,
    }))

  }
  const handleEditMainTask = async (taskId, newTitle)=>{
    try{
      const response = await editMainTask(taskId, {title: newTitle})

      setMainTasks(prev =>
        prev.map(task=>
          task._id === taskId
          ?{...response.data, isExpanded: task.isExpanded}
          : task
        )
      )
    }catch(err){
      console.error("Failed to edit main task", err)
    }

  }

  const handleDeleteMainTask = async (taskId)=>{

    try{
      await deleteTask(taskId);
      setMainTasks(prev => prev.filter(task => task._id !== taskId));
    }catch(err){
      console.log("Failed to delete task", err)
    }

  }

  const handleToggleExpand = (taskid)=>{
    setMainTasks(prev => prev.map(task=>
      task._id === taskid?{...task,isExpanded: !task.isExpanded}
      : task
    ))


  }
  const handleToggleMainTaskCompletion = (id)=>{
    setMainTasks(prevTask => prevTask.map(task => 
      task._id === id ?{...task, completed:!task.completed}:task
    ))

  }
  const handleToggleSubTaskCompletion = async(taskId,subtaskId)=>{
    try{
      const currentMaintask = mainTasks.find(t=>t._id === taskId);
      const currentsubTask =  currentMaintask?.subTasks.find(s=> s._id=== subtaskId)

      if(!currentsubTask){
        console.error("Subtask not found for toggling completion")
        return
      }

      const newCompletedStatus = !currentsubTask.completed

      const response = await editsubTask(
        taskId,
        subtaskId,
        {completed: newCompletedStatus}
      )
     

      setMainTasks(prev=>prev.map(t=> t._id ===taskId?{
        ...t,
        subTasks: t.subTasks.map(s=>
          s._id === subtaskId ? {...s, completed: response.data.completed}: s
        )
      }: t
    ))

    }catch(err){
      console.log("error toggling subtask completion", err)
    }




  }

  useEffect(()=>{
    const fetchTasks = async()=>{
      try{
        const res = await getallTask();
        setMainTasks(res.data.map(task=>({...task, isExpanded: false})))

      }catch(err){
        console.log("Error fetching tasks",err)
      }

    }
    fetchTasks()

  },[])



  return(
    <div style={{fontFamily:'"Inter",sans-serif', maxWidth:'600px',margin:'40px auto',padding:'20px',border:'1px solid #e0e0e0', borderRadius:'10px',boxShadow:'0 4px 8px rgba(0,0,0,0.1)',backgroundColor:'#ffffff'}}>
      <h1 style={{textAlign: 'center', color: '#333',fontWeight:"bold"}}>Aparajita's Task Planner</h1>
      {/* Input and Add Button for main task */}
      <div style={{display:"flex", marginBottom: '20px', gap: '10px'}}>
        <input 
        type="text" 
        placeholder="Add a Task"
        value= {taskText}
        onChange={(e)=>setTaskTexts(e.target.value)}
        onKeyDown ={(e)=>{
          if(e.key === 'Enter'){
            handleAddTask()
          }

        }}
        style={{flexGrow:1, padding: '10px 15px',border:'1px solid #ccc', borderRadius: '8px', fontSize:'1rem'}}/>
        <button
        style={{padding:"10px 20px", backgroundColor: "#FFAC4B", color:"white", border:"none", borderRadius: '8px',cursor:'pointer',fontSize:"1rem", fontWeight:'bold',transition:'background-color 0.3s ease'}}
        onMouseOver={(e)=> e.currentTarget.style.backgroundColor='#E69C42'}
        onMouseOut={(e)=> e.currentTarget.style.backgroundColor='#FFAC4B'}
        onClick={handleAddTask}> Add Task
          
        </button>

      </div>
      {/* List of main Task */}
      <div>
        {mainTasks.length === 0?(
          <p style={{textAlign:'center',color:'#666'}}>No tasks yet. Add one above!</p>
        ):(
          mainTasks.map(task => (

            
            <div key = {task._id}>
              {/* Main task Row */}

              <div  style={{display: 'flex', alignItems:'center', justifyContent:'space-between',width:'100%'}}>
                {/* Check mark button for main task */}
           
                <button 
                onClick={()=>handleToggleMainTaskCompletion(task._id)}
                style={{

                   width: '24px',
                   height: '24px',
                   borderRadius: '50%',
                   border: `2px solid ${task.completed ? '#4CAF50' : '#ccc'}`,
                   backgroundColor: task.completed ? '#4CAF50' : 'transparent',
                   color: 'white',
                   fontSize: '0.9rem',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   cursor: 'pointer',
                   marginRight: '10px',
                   flexShrink: 0
                }}>
                  {task.completed? '✓':''}
                </button>
                <span style={{flexGrow:1,
                  fontSize: '1.1rem',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#999' : '#333'
                 }}>
                  {task.title}
                </span>

                {/* progress tracking circle */}
                <div style={{ width: 50, height: 50, marginRight: '15px', flexShrink: 0 }}> {/* Adjusted size and margin */}
                    <CircularProgressbar
                        value={calculateProgress(task)}
                        text={`${calculateProgress(task)}%`}
                        styles={buildStyles({
                            // Text color
                            textColor: '#FFAC4B',
                            // Trail color (the part of the circle that's not filled)
                            trailColor: '#e0e0e0',
                            // Path color (the filled part of the circle)
                            pathColor: '#FFAC4B',
                        })}
                    />
                </div>

                
               
          

                {/* Dropdown and add Subtask Buttons */}
                <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
               
                  <button
                  onClick={()=> handleToggleExpand(task._id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#e0e0e0',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    marginBottom: '5px'
                }}
                  >{task.isExpanded? '▼' : '▲'}</button>
                  {/* Task delete button */}
                   <button
                   onClick={()=>handleDeleteMainTask(task._id)}
                  style={{
                    padding: '4.5px 5.5px',
                    backgroundColor: '#e0e0e0',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    marginBottom: '5px'
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-3-3v3" />
                </svg>
                </button>

                  </div>


              </div>
              {/* Subtask input and List */}

              {task.isExpanded && (
                <div style={{ width: '100%', marginTop: '15px', paddingLeft: '20px' }}>
                  {/* Adding subtaskInput */}
                  <div style={{ display: 'flex', marginBottom: '10px', gap: '10px' }}>
                    <input 
                    type='text' 
                    placeholder='Add a subtask..' 
                    value={subTasks[task._id] || ''}
                    onChange={(e)=> handleSubTaskInputChange(task._id,e.target.value)}
                    onKeyDown={(e)=>{
                      if(e.key === 'Enter'){
                        handleAddSubTask(task._id)
                      }
                    }}
                    style={{
                      flexGrow: 1,
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                  }}/>
                  <button
                  onClick={()=>handleAddSubTask(task._id)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#FFAC4B',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e)=> e.currentTarget.style.backgroundColor='#E69C42'}
                onMouseOut={(e)=> e.currentTarget.style.backgroundColor='#FFAC4B'}>Add Subtask
                </button>

                  </div>

                  {/* List of Subtasks */}
                 
                  {task.subTasks.length === 0?(
                    <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', marginTop: '10px' }}>No Subtasks Added yet? Please add from above.</p>
                  ):(
                    task.subTasks.map(subtask =>(
                      <div
                      key={subtask._id}
                      style={{display: 'flex',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px dashed #eee'}}>

                          {/* Checkmark Button of subtask */}
                          <button
                          onClick={()=>handleToggleSubTaskCompletion(task._id,subtask._id,)}
                           style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${subtask.completed ? '#4CAF50' : '#ccc'}`,
                            backgroundColor: subtask.completed ? '#4CAF50' : 'transparent',
                            color: 'white',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            marginRight: '10px',
                            flexShrink: 0
                        }}>
                          
                          {subtask.completed? '✓' : ''}
                        </button>
                        <span
                          style={{
                                fontSize: '0.95rem',
                                textDecoration: subtask.completed ? 'line-through' : 'none',
                                color: subtask.completed ? '#999' : '#555' // Corrected: Removed duplicate color
                                }}
                                >
                                {subtask.title}
                              </span>

                      </div>

                    ))
                  )}

              </div>

              )}
              



            </div>
          )
        )
        )}
      </div>

    
    </div>
  )


}

export default App