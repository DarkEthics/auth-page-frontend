import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";



export default function Login(){
    const [isLoading, setisLoading] = useState(false);
    const [errorMsg,seterrorMsg] = useState(null);
    const [emailReceived,setemailReceived] = useState('');
    const [passwordReceived, setpasswordReceived] = useState('');
    const [failedAttempts, setfailedAttempts] = useState(0);
    const [isLocked, setisLocked ] = useState(false);
    const [countdown, setcountdown] = useState(100);

    const navigate = useNavigate();

    const handleChangeEmail = (e) => {
        setemailReceived(e.target.value);
    }

    const handleChangePassword = (e) => {
        setpasswordReceived(e.target.value);
    }

    // const handleLoginWithGoogle = (e) => {
    //     supabase.auth.signInWithOAuth({ 
    //         provider: 'google',
    //         options: {
    //             redirectTo: 'http://localhost:5173/dashboard'
    //         }
    //     })
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        seterrorMsg(null);
        console.log(isLoading);

        //ui checks
        if(!emailReceived || !passwordReceived){
            seterrorMsg("All fields required...");
            return;
        }
        if(passwordReceived.length < 6){
            seterrorMsg('Password must be at least 6 characters')
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(emailReceived)){
            seterrorMsg('Invalid email format')
            return
        }

        setisLoading(true);

        console.log('trying');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`,{
                method : 'POST',
                headers : {
                    'content-type' : 'application/json' 
                },
                body : JSON.stringify({
                    email : emailReceived,
                    password : passwordReceived
                }) 
            })
            const data = await response.json();

            setisLoading(false);
            if(!response.ok){
                console.error(data.error,failedAttempts);
                setfailedAttempts(prev => prev + 1);
                seterrorMsg(data.error);
            }
            else{
                console.log(data);
                localStorage.setItem('jwt',data.jwt);
                // console.log(localStorage.getItem('jwt'));
                navigate('/dashboard');
            }
            console.log(data);

        } catch (err) {
            console.error(err);
            setisLoading(false);
            seterrorMsg('Internal server error');
        }

    
        if(failedAttempts+1 == 5){
            setisLocked(true);
            seterrorMsg("Too many attempts, try again later")
            const intervalId = setInterval(()=>{
                setcountdown(prev => prev-0.5);
            },50)
            setTimeout(()=>{
                clearInterval(intervalId);
                setfailedAttempts(0);
                setisLocked(false);
                seterrorMsg(null);
                setcountdown(100);
            },10000)
        }
        
    }

    return (
        <>
            <input placeholder="Enter your email" value={emailReceived} onChange={handleChangeEmail}/>
            <input value={passwordReceived} onChange={handleChangePassword} placeholder="Enter your password" type="password"/>
            <button onClick={handleSubmit} disabled={isLoading || isLocked}>Submit</button>
            {/* <button onClick={handleLoginWithGoogle} disabled={isLoading || isLocked}> Login with google </button> */}
            <Link to='/signup'>Don't have an account. Signup</Link>
            {errorMsg && <p>{errorMsg}</p>}
            {isLoading && <p>Loading..</p>}
            {isLocked && <div style={{width : `${countdown}%`, height : '5px' , background : 'red'}}></div>}
        </>
    )
}