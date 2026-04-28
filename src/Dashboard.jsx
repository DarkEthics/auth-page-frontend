import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const  Dashboard = () => {

    const [userName, setuserName] = useState('');
    const [isLoading, setisLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('jwt');

    useEffect(() => {
        const getuserdata = async () => {
            try {
                
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`,{
                    method : 'GET',
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                })
                const data = await response.json();
                if(!response.ok){
                    console.error(data.error)
                    navigate('/login');
                }
                else{
                    setisLoading(false);
                    setuserName(data.username);
                }
            } catch (err) {
                console.log('inside catch')
                console.log(err);
                navigate('/login')

                //server error occured
                // do we need another ui state for this?
                //for now just navigating to login
                
            }

        } 
        getuserdata()
    },[])


    const handleClick = (e) => {
        localStorage.removeItem('jwt');
        navigate('/login');
    }

    return (
        <>
        {isLoading ? <p>Loading...</p> : <h1>Welcome {userName}</h1>}
        <button onClick = {handleClick}>Logout</button>
        </>
    )
}

export default Dashboard;