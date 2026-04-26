import { useState } from "react";
import { supabase } from './supabaseClient';
import { useNavigate, Link } from "react-router-dom";


export default function Signup(){
    const [isLoading, setisLoading] = useState(false);

    const [errorMsg,seterrorMsg] = useState(null);

    const [emailReceived,setemailReceived] = useState('');
    const [userNameReceived, setuserNameReceived] = useState('');
    const [passwordReceived, setpasswordReceived] = useState('');
    const [confirmPasswordReceived, setconfirmPasswordReceived] = useState('');

    const navigate = useNavigate();


    const handleChangeEmail = (e) => {
        setemailReceived(e.target.value);
    }

    const handleChangePassword = (e) => {
        setpasswordReceived(e.target.value);
    }

    const handleChangeUserName = (e) => {
        setuserNameReceived(e.target.value);
    }

    const handleChangeConfirmPassword = (e) => {
        setconfirmPasswordReceived(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        seterrorMsg(null);

        //ui checks
        if(!emailReceived || !passwordReceived ||!userNameReceived){
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
        const usernameRegex = /^[a-zA-Z0-9_-]+$/
        if(!usernameRegex.test(userNameReceived)){
            seterrorMsg('Username can only contain letters, numbers, underscores and hyphens');
            return;
        }

        if(passwordReceived !== confirmPasswordReceived){
            seterrorMsg('Passwords don\'t match')
            return;
        }

        // signup in supabase and diable submit button
        setisLoading(true);
        const {data, error} =  await supabase.auth.signUp(
            {
                email : emailReceived,
                password: passwordReceived,
                options : {
                    data : {
                        username : userNameReceived
                    }
                }
            
            });
        setisLoading(false);

        // unable to signup
        if(error){
            console.error(error);
            seterrorMsg(error.message);
        }
        // successfully signed up , move to login
        else{
            console.log(data);
            navigate('/login');
        }
    }

    return (
        <>
        <input value={emailReceived} onChange={handleChangeEmail} placeholder="Enter your email"/>
        <input value={userNameReceived} onChange={handleChangeUserName} placeholder="Enter your name"/>
        <input value={passwordReceived} onChange={handleChangePassword} placeholder="Enter your password" type="password"/>
        <input value={confirmPasswordReceived} onChange={handleChangeConfirmPassword} placeholder="Re-enter password" type="password"/>

        <button onClick={handleSubmit} disabled={isLoading}>Submit</button>
        <Link to='/login'>Already have an account? Login.</Link>
        {errorMsg && <p>{errorMsg}</p>}
        {isLoading && <p>Loading..</p>}

        </>
    )
}