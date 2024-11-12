import React, { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axiosInstance from '../../axiosinterceptor';

const genres = [
    "Adventure",
    "Biography",
    "Children's",
    "Classic",
    "Comic/Graphic Novel",
    "Crime",
    "Drama",
    "Dystopian",
    "Fantasy",
    "Historical Fiction",
    "Horror",
    "Literary Fiction",
    "Mystery",
    "Non-Fiction",
    "Paranormal",
    "Philosophical",
    "Poetry",
    "Romance",
    "Science Fiction",
    "Self-Help",
    "Short Story",
    "Suspense/Thriller",
    "True Crime",
    "Western",
    "Young Adult"
];


const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [step, setStep] = useState(1);
    const [user, setUser] = useState({
        email: '',
        username: '',
        name: '',
        phoneNumber: '',
        password: '',
        interests: []
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const updateUser = (e, newValue) => {
        if (e && Array.isArray(newValue)) {
            setUser(prevState => ({
                ...prevState,
                interests: newValue
            }));
        } else {
            setUser(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
    };

    const validateUser = () => {
        axiosInstance.post("http://localhost:3000/user/login", user)
            .then((res) => {
                if (res.data.usertoken) {
                    localStorage.setItem("token", res.data.usertoken);
                    navigate('/home');
                }
            })
            .catch((err) => {
                console.error("Login failed", err);
                alert("Invalid login credentials");
            });
    };

    const handleToggleSignup = () => {
        setIsSignup(!isSignup);
        setStep(1);

        setUser({
            email: '',
            username: '',
            name: '',
            phoneNumber: '',
            password: '',
            interests: []
        });
        setErrors({});
    };

    const handleNext = () => {
        const newErrors = {};
        if (!user.email) newErrors.email = "Email is required";
        if (!user.username) newErrors.username = "Username is required";
        if (!user.password) newErrors.password = "Password is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setStep(2);
        }
    };

    const signupUser = () => {
        axiosInstance.post("http://localhost:3000/user/signup", user)
            .then((res) => {
                if (res.data.usertoken) {
                    localStorage.setItem("token", res.data.usertoken);
                    navigate('/home');
                }
            })
            .catch((err) => {
                console.error("Sign-up failed", err);
                alert("Failed to register. Please try again.");
            });
    };


    const textFieldStyles = {
        width: '260px',
        margin: '25px auto 0',
        display: 'block',
        '& .MuiInputLabel-root': {
            fontSize: '12px',
            color: '#cfcfcf',
            textTransform: 'uppercase',
            textAlign: 'center',
        },
        '& .MuiInput-root': {
            width: '100%',
            marginTop: '5px',
            paddingBottom: '5px',
            fontSize: '16px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
            textAlign: 'center',
        },
    };

    return (
        <div className='login'>
            <div className={`cont ${isSignup ? 's--signup' : ''}`}>
                <div className="form sign-in">
                    <h2>Welcome back,</h2>
                    <TextField
                        id="username-login"
                        label="USERNAME"
                        variant="standard"
                        name="username"
                        value={user.username}
                        onChange={updateUser}
                        sx={textFieldStyles}
                    />
                    <TextField
                        id="password-login"
                        type='password'
                        label="Password"
                        name='password'
                        variant="standard"
                        value={user.password}
                        onChange={updateUser}
                        sx={textFieldStyles}
                    />
                    <p className="forgot-pass">Forgot password?</p>
                    <button 
                        type="button" 
                        className="submit" 
                        onClick={validateUser}
                        disabled={!user.username || !user.password}
                    >
                        Sign In
                    </button>
                </div>

                <div className="sub-cont">
                    <div className="img">
                        <div className="img__text m--up">
                            <h2>New here?</h2>
                            <p>Sign up and discover a great amount of new opportunities!</p>
                        </div>
                        <div className="img__text m--in">
                            <h2>One of us?</h2>
                            <p>If you already have an account, just sign in. We've missed you!</p>
                        </div>
                        <div className="img__btn" onClick={handleToggleSignup}>
                            <span className="m--up">Sign Up</span>
                            <span className="m--in">Sign In</span>
                        </div>
                    </div>

                    <div className="form sign-up">
                        <h2>Time to feel like home,</h2>
                        {step === 1 ? (
                            <>
                                <TextField
                                    id="email-signup"
                                    label="EMAIL"
                                    variant="standard"
                                    name="email"
                                    value={user.email}
                                    onChange={updateUser}
                                    // error={!!errors.email}
                                    // helperText={errors.email}
                                    sx={textFieldStyles}
                                />
                                <TextField
                                    id="username-signup"
                                    label="USERNAME"
                                    variant="standard"
                                    name="username"
                                    value={user.username}
                                    onChange={updateUser}
                                    // error={!!errors.username}
                                    // helperText={errors.username}
                                    sx={textFieldStyles}
                                />
                                <TextField
                                    id="password-signup"
                                    type='password'
                                    label="Password"
                                    name='password'
                                    variant="standard"
                                    value={user.password}
                                    onChange={updateUser}
                                    // error={!!errors.password}
                                    // helperText={errors.password}
                                    sx={textFieldStyles}
                                />
                                <button
                                    type="button"
                                    className="submit"
                                    onClick={handleNext}
                                    disabled={!user.email || !user.username || !user.password}
                                >
                                    Next
                                </button>
                            </>
                        ) : (
                            <>
                                <TextField
                                    id="name-signup"
                                    label="NAME"
                                    variant="standard"
                                    name="name"
                                    value={user.name}
                                    onChange={updateUser}
                                    sx={textFieldStyles}
                                />
                                <TextField
                                    id="phoneNo-signup"
                                    label="PhoneNo"
                                    variant="standard"
                                    name="phoneNumber"
                                    value={user.phoneNumber}
                                    onChange={updateUser}
                                    sx={textFieldStyles}
                                />
                                <Autocomplete
                                    multiple
                                    limitTags={2}
                                    id="interests-signup"
                                    options={genres}
                                    value={user.interests}
                                    onChange={updateUser}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Interests"
                                            sx={{
                                                ...textFieldStyles,
                                                '& .MuiAutocomplete-endAdornment': {
                                                    right: 0,
                                                    width: '30px'
                                                },
                                            }}
                                        />
                                    )}
                                    name="interests"
                                    sx={{
                                        width: '260px',
                                        margin: '25px auto 0',
                                        display: 'block',
                                        '& .MuiButtonBase-root': {
                                            width: 30,
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="submit"
                                    onClick={signupUser}
                                    disabled={!user.name || !user.phoneNumber || user.interests.length == 0 }
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
