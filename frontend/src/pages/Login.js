import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();  // Prevenir el comportamiento por defecto del formulario
        try {
            const response = await axios.post('http://localhost:3009/auth/login', {
                email: email,
                password: password
            });
            localStorage.setItem('token', response.data.token);  // Guardar el token en localStorage
            console.log('Login exitoso');
            // Redirigir al usuario al Dashboard o manejar la navegación aquí
        } catch (err) {
            if (err.response) {
                // El servidor respondió con un estado fuera del rango 2xx
                console.error("Error en la respuesta del servidor:", err.response.status);
                setError(err.response.data.message);
            } else if (err.request) {
                // La petición fue hecha pero no se recibió respuesta
                console.error("No response from server");
                setError("No se pudo conectar al servidor.");
            } else {
                // Algo más causó un error
                console.error("Login error", err.message);
                setError(err.message);
            }
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </label>
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;
