import { useState, useEffect} from "react";
import { getSessionToken } from "../Authentication/AuthService";
import { decodeToken } from "../Authentication/DecodeToken";
import './Tasks.css';
import { toast } from "react-toastify";

export default function Tasks({user}){
    const [showAddTask,setShowAddTask]=useState(false);
    const [showUpdateTask,setShowUpdateTask]=useState(false);
    const [taskDetails,setTaskDetails]=useState([]);
    const [userTasks,setUserTasks]=useState([]);
    const [adminTasks,setAdminTasks]=useState([]);
    const [updateDetails,setUpdateDetails]=useState([]);
    const [isAdminTask,setIsAdminTask]=useState(false);
    const [isUserTask,setIsUserTask]=useState(false);
    const [taskHeading,setTaskHeading]=useState('');
    const [addTaskbutton,setAddTaskButton]=useState(false);

    //fetch tasks
    const fetchTasks=async ()=>{
        const token=getSessionToken();
        const tokenValues=decodeToken(token);
        try {
            const response= await fetch(`http://localhost:5000/api/taskdetails/${tokenValues.username}`,{
                method:'post',
                headers : {
                    'Content-Type': 'application/json',
                    Authorization: token ? `${token}` : '',
                },
                body : JSON.stringify(tokenValues),
            });
            const res= await response.json();

            if(response.ok && tokenValues.isAdmin){
                setAdminTasks(res);
                setIsAdminTask(true);
                setTaskHeading('All Tasks List');
            }else if(response.ok && !tokenValues.isAdmin){
                setUserTasks(res);
                setIsUserTask(true);
                setAddTaskButton(true);
                setTaskHeading('Your Tasks');
            }
        } catch (error) {
            console.log(`fetch failed : ${error}`)
        }
    };

    useEffect(()=>{
        const token=getSessionToken();
        const tokenValues=decodeToken(token);

        if((token!=null && tokenValues.isAdmin) || (token!=null && !tokenValues.isAdmin)){
            fetchTasks();
        }else{
            setUserTasks([]);
            setAdminTasks([]);
            setTaskHeading('');
        }
    },[])

    const addTask=()=>{
        setShowAddTask(true);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskDetails((prevUserData) => ({
          ...prevUserData,
          [name]: value,
        }));
      };

      //Add new Task
      const handleAddTask= async ()=>{
        const token=getSessionToken();
        const tokenValues=decodeToken(token);
        setTaskDetails({...taskDetails,...tokenValues})

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${tokenValues.username}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `${token}` : '',
              },
              body: JSON.stringify(taskDetails),
            });
            const data = await response.json();
            if(response.ok){
                toast.success(`New Task Added Successfully`,{
                    position:toast.POSITION.TOP_CENTER,
                });
                fetchTasks();
                setShowAddTask(false);
            }else{
                toast.error(`Unable to Add Task ${data.error}`,{
                    position:toast.POSITION.TOP_CENTER,
                });
            }
          } catch (error) {
            console.error('Error during adding new task:', error);
        }   
    }

    const editTask=(id)=>{
        setUpdateDetails([userTasks.find((item) => item._id === id)]);
        setShowUpdateTask(true);
    };

    //Update Task
    const handleUpdateTask=async ()=>{
        const token=getSessionToken();
        const tokenValues=decodeToken(token);
        try {
            const response = await fetch(`http://localhost:5000/api/updatetasks/${tokenValues.username}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(taskDetails),
            });
            const data = await response.json();
            if(response.ok){
                toast.success(data.message,{
                    position:toast.POSITION.TOP_CENTER,
                });
                setShowUpdateTask(false);
                fetchTasks();
                setTaskDetails([]);
            }else{
                toast.error(`Unable to Update Task ${data.error}`,{
                    position:toast.POSITION.TOP_CENTER,
                });
                setTaskDetails([]);
            }
          } catch (error) {
            console.error('Error during update task:', error);
        }   
    };  

    //Delete Task
    const deleteTask= async (id)=>{
        try {
            const response = await fetch('http://localhost:5000/api/deletetasks', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify([id]),
            });
            const data = await response.json();
            if(response.ok){
                toast.success(data.message,{
                    position:toast.POSITION.TOP_CENTER,
                });
                setTaskDetails([]);
                fetchTasks();
            }else{
                toast.error(`Unable to Delete Task ${data.error}`,{
                    position:toast.POSITION.TOP_CENTER,
                });
                setTaskDetails([]);
            }
          } catch (error) {
            console.error('Error during deleting task:', error);
        }   
    }

    const cancel=()=>{
        setShowAddTask(false);
        setShowUpdateTask(false);
    }

    const renderUserTasks=()=>{
        if (userTasks.length===0){
            return null
        }else if(userTasks.some(obj => obj.hasOwnProperty('message'))){
            return <div style={{'textAlign':'center'}}>{userTasks[0].message}</div>
        }else {
            return  userTasks.map(list=>
                    <div key={list._id} id="user-tasks">
                        <div>{list.title}</div>
                        <div>{list.description}</div>
                        <div>{list.duedate}</div>
                        <div>{list.status}</div>
                        <div id='edit-button' onClick={()=>{editTask(list._id)}}>Edit Task</div>
                        <div id="delete-button" onClick={()=>{deleteTask(list._id)}}>Delete Task</div>
                    </div>) 
        }
    }

    const renderAdminTasks=()=>{
        return  adminTasks.map(list=>
                    <div key={list._id} id="admin-tasks">
                        <div>{list.title}</div>
                        <div>{list.description}</div>
                        <div>{list.duedate}</div>
                        <div>{list.status}</div>
                    </div>)
    }

    const renderTaskTitle=()=>{
        if (userTasks.some(obj => obj.hasOwnProperty('message'))){
            return null
        }else if(isAdminTask){
            return <div id="titles-admin-div">
                        <div>Task Title</div>   
                        <div>Task Description</div>
                        <div>Task dueDate</div>  
                        <div>Task Status</div>  
                    </div>
        }else{
            return <div id="titles-div">
                        <div>Task Title</div>   
                        <div>Task Description</div>
                        <div>Task dueDate</div>  
                        <div>Task Status</div>  
                    </div>
        }
    }


    return(
        <>
            <section id="tasks">
                <div id="task-details">
                    <div id="welcome-user">
                        <div id="wel-msg">Welcome {user}</div>
                        {addTaskbutton && <div id="addtask-button"><button onClick={addTask}>+ Add NewTask</button></div>}
                    </div>

                    {showAddTask && <div id="new-task" className="addOrupdate-panel">
                        <div><input type="text" name="title" placeholder="Enter Title" onChange={handleInputChange} /></div>
                        <div><textarea name="description" placeholder="Add Description" onChange={handleInputChange}></textarea></div>
                        <div><input type="date" name="dueDate" placeholder="Enter Due Date" onChange={handleInputChange}/></div>
                        <div id="radio-main-div">
                            <div>Select status of Task you can change it later</div>
                            <div id="radio-div">
                                <div><span>Pending</span><span><input type="radio" name="status" value="Pending" onChange={handleInputChange}/></span> </div>
                                <div><span>Inprogress</span><span><input type="radio" name="status" value="Inprogress" onChange={handleInputChange}/></span> </div>
                                <div><span>Completed</span><span><input type="radio" name="status" value="Completed" onChange={handleInputChange}/></span> </div>
                            </div>
                        </div>
                        <div><input type="button" value='Save' onClick={handleAddTask} /></div>
                        <div ><input type="button" value='Cancel' onClick={cancel} id="cancel-button" /></div>
                    </div>}

                    {showUpdateTask && <div id="update-task" className="addOrupdate-panel">
                        <div><input type="hidden" name="id" value={updateDetails[0]._id} onChange={handleInputChange} /></div>
                        <div><input type="text" name="title" defaultValue={updateDetails[0].title} onChange={handleInputChange} /></div>
                        <div><textarea name="description" defaultValue={updateDetails[0].description}  onChange={handleInputChange}></textarea></div>
                        <div><input type="date" name="dueDate" defaultValue={updateDetails[0].duedate}  onChange={handleInputChange}/></div>
                        <div id="radio-main-div">
                            <div>Select status of Task you can change it later</div>
                            <div id="radio-div">
                                <div><span>Pending</span><span><input type="radio" name="status" value='Pending'  onChange={handleInputChange} defaultChecked={updateDetails[0].status==='Pending'}/></span> </div>
                                <div><span>Inprogress</span><span><input type="radio" name="status" value='Inprogress'  onChange={handleInputChange} defaultChecked={updateDetails[0].status==='Inprogress'}/></span> </div>
                                <div><span>Completed</span><span><input type="radio" name="status" value='Completed'  onChange={handleInputChange} defaultChecked={updateDetails[0].status==='Completed'}/></span> </div>
                            </div>
                        </div>
                        <div><input type="button" value='Update' onClick={handleUpdateTask} /></div>
                        <div><input type="button" value='Cancel' onClick={cancel} id="cancel-button" /></div>
                    </div>}

                    <div id="task-heading">{taskHeading}</div>
                    <div id="render-tasks">
                        {(isUserTask || isAdminTask) && 
                            renderTaskTitle()
                        }

                        {isUserTask && renderUserTasks()}

                        {isAdminTask && renderAdminTasks()}       
                    </div>
                </div>
            </section>
        </>
    )
}