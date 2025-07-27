import React from "react";
import { useState } from "react";
import { authenticateUser } from "./api";
// import { set } from "mongoose";

const Auth = ({onLoginSuccess})=>{
    const [id,setId]= useState();
    const[password, setPassword]= useState();
    const[error,setError] = useState();

    const handleLogin= async(e)=>{
        e.preventDefault();

        try{
            const response = await authenticateUser(id,password)
            console.log(response)
            if(response.status ===200){
                localStorage.setItem("token", "loggedIn");
                window.location.reload();
                onLoginSuccess()


            }else{
                setError("Invalid credentials")
            }


        }catch(err){
            setError("Invalid Cred!!")
        }

    }

    return (
        <div style={{fontFamily:'"Inter",sans-serif', maxWidth:'600px',margin:'40px auto',padding:'20px',border:'1px solid #e0e0e0', borderRadius:'10px',boxShadow:'0 4px 8px rgba(0,0,0,0.1)',backgroundColor:'#ffffff'}}>
            <h2>Hi,Please login and continue:)</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "15px" }}>
                    <input
                    type="text"
                    placeholder="User Id"
                    value={id}
                    onChange={(e)=>setId(e.target.value)}
                    style={{ width: "100%", padding: "10px", fontSize: "16px" }}/>
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    style={{ width: "100%", padding: "10px", fontSize: "16px" }}/>
                </div>
                {error && <p style={{color:"red"}}>{error}</p>}

                <button
                type="Submit"
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",

                }}>
                Login
                </button>

            </form>


        </div>


    )

}
export default Auth;