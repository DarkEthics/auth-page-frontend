import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const ProtectedRoute = ({children}) => {
    const navigate = useNavigate();

    const [currentState, setcurrentState] = useState('loading');

    useEffect(()=>{
        const check = async () =>{
            const {data, _ } = await supabase.auth.getSession();
            if(data.session){
                setcurrentState('ok');
            }
            else{
                setcurrentState('redirect');
            }
        }
        check();
    },[])

    useEffect(() => {
        if(currentState === 'redirect'){
            navigate('/login');
            console.log('navigated');
        }
    },[currentState])
    
    if(currentState ==='loading'){
        return <h1>loading</h1>;
    }
    else if(currentState === 'ok'){
        return children;
    }
}

export default ProtectedRoute;