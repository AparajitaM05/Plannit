import React, { useEffect, useState } from "react";
import Auth from './Auth';
import TaskPlannerDashboard from './TaskPlannerDashboard';



const App = ()=>{
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  

  useEffect(()=>{
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");

  },[])

  return(
    <div>
      {isAuthenticated? <TaskPlannerDashboard/> : <Auth/>}
    </div>
  )

}
export default App