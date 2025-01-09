import React, { useState } from 'react';
import Navbar from '../../Components/Normal/Navbar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserType, setToken } from '../../slice/userSlicer';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const UserLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(username, 'user');
    //     console.log(password, 'pass');


    //     if (!username || !password) {
    //         setError('Please fill in all fields');
    //     } else {
    //         axios
    //             .post('http://127.0.0.1:8000/login/', { username, password })
    //             .then((response) => {
    //                 const { access, userType } = response.data;

    //                 if (access) {
    //                     dispatch(setToken({ access }));
    //                     dispatch(setUserType(userType));

    //                     localStorage.setItem('accessToken', access);
    //                     localStorage.setItem('userType', userType);

    //                     if (userType === 'bus_owner') {
    //                         navigate('/busowner-dashboard/busowner-dashboard2');
    //                     } else if (userType === 'normal_user') {
    //                         navigate('/');
    //                     }
    //                 } else {
    //                     setError('Login failed');
    //                 }
    //             })
    //             .catch((error) => {
    //                 if (error.response && error.response.data.error) {
    //                     setError(error.response.data.error);
    //                 } else {
    //                     setError('Something went wrong. Please try again later.');
    //                 }
    //                 console.error(error);
    //             });

    //         setError('');
    //         // setUsername('');
    //         // setPassword('');
    //     }



    // }

   
    
    // const handleGoogleLogin = async (response) => {
    //     const idToken = response.credential;
    //     console.log(idToken); // Log the token to verify it's valid
     
    //     try {
    //         const res = await axios.post("http://127.0.0.1:8000/google-login/", { token: idToken });
    //         if (res.status === 200) {
    //             console.log("Google login successful:", res.data);
    //             // Handle successful login (dispatching state, redirect, etc.)
    //         } else {
    //             console.error("Google login failed:", res.data.error);
    //         }
    //     } catch (error) {
    //         console.error("Error during Google login:", error.response ? error.response.data : error);
    //         // Show an error message to the user
    //     }
    // };
    


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, 'user');
        console.log(password, 'pass');
    
        if (!username || !password) {
            setError('Please fill in all fields');
        } else {
            axios
                .post('http://127.0.0.1:8000/login/', { username, password })
                .then((response) => {
                    const { access, userType } = response.data;

                    console.log(response.data,'dataaaaaaaaa');
                    
    
                    if (access) {
                        dispatch(setToken({ access }));
                        dispatch(setUserType(userType));
    
                        localStorage.setItem('accessToken', access);
                        localStorage.setItem('userType', userType);
    
                        if (userType === 'bus_owner') {
                            navigate('/busowner-dashboard/busowner-dashboard2');
                        } else if (userType === 'normal_user') {
                            navigate('/');
                        }
                    } else {
                        setError('Login failed');
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.data.error) {
                        setError(error.response.data.error);  
                    } else {
                        setError('Something went wrong. Please try again later.');
                    }
                    console.error(error);
                });
    
            setError('');
        }
    }
    





    const handleGoogleLogin = async (response) => {
        const idToken = response.credential;
        console.log(idToken);  
    
        try {
            const res = await axios.post("http://127.0.0.1:8000/google-login/", { token: idToken });
            if (res.status === 200) {
                console.log("Google login successful:", res.data);
    
                dispatch(setToken({ token: res.data.tokens.access }));
                dispatch(setUserType({ userType: 'normal_user' }));

                console.log('acces token',res.data.tokens.access);
                console.log('type',res.data.user.user_type);
                
    
                localStorage.setItem("accessToken", res.data.tokens.access);
                localStorage.setItem("refresh_token", res.data.tokens.refresh);
                localStorage.setItem("userType",'normal_user' );
    
                navigate('/')  
            } else {
                console.error("Google login failed:", res.data.error);
            }
        } catch (error) {
            console.error("Error during Google login:", error.response ? error.response.data : error);
        }
    };
   
    

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-red-600 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-white">Sign in to your account</h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {/* Google Button */}
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={() => console.log('Google login failed')}
                                    useOneTap
                                    clientId="95471622345-6mrooku1asdkjvraoqdr18k4jfo5gakf.apps.googleusercontent.com"
                                    // redirectUri="http://localhost:3000/callback"
                                    // redirectUri="http://localhost:5173/"
                                />

                                {/* Register Button */}
                                <button
                                    type="button"
                                    onClick={() => navigate('/signUp')}
                                    className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Create an Account
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );


}

export default UserLogin;
