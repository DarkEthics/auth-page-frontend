import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"
import { useEffect, useState } from "react";





const  Dashboard = () => {

    const [userName, setuserName] = useState('');
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        const getuserdata = async () => {
            const {data , error} = await supabase.auth.getUser();
            setisLoading(false);
            setuserName(data.user.user_metadata.username);
        } 
        getuserdata()
    },[])

    const navigate = useNavigate();

    const handleClick = async (e) => {
        const  {data, error} = await supabase.auth.signOut();
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