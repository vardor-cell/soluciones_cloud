import React, {useState, useContext} from 'react';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';
import { useNavigate} from 'react-router-dom'
import TaskList from './TaskList';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setToken, setIdUser} = useContext(GlobalContext);
    const navigate = useNavigate();

    const DoLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {}, {
                auth: { username: username, password: password }
            });
            setToken(response.data.token);
            setIdUser(response.data.id_usuario);

            localStorage.setItem('user', response.data.id_usuario);
            localStorage.setItem('token', response.data.token);

            navigate("/tasklist");
        } catch (error) {
            console.error('Error while doing login:', error);
        }
    };
    

    const handleSubmit = (event) => {
        event.preventDefault();
        DoLogin();
    };

    const handleCreateUserClick = (event) => {
        event.preventDefault();
        navigate('/createuser');
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="/create-user" onClick={handleCreateUserClick}>Create one here</a></p>
            </form>
        </div>
    );
};

export default Login;
