import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connectionprefix, PageForm } from  '../globals';


function Login(activeForm, setActiveForm,idUser, setIdUser, userPrivileges, setUserPrivileges ) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('Compila i campi');

  const handleSubmit = () => {
    // Qui implementerai la logica per inviare i dati al server
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Code:', code);
    // ...
    loginAcces()
  };
  const loginAcces = async () => {
    try {
      console.log('login.loginAcces() Proviamo a comunicare con il python');
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));

      const fetchPromise = await fetch(connectionprefix+'/login', {
        method: 'POST',
        credentials: 'include', //send cookie also on cross-origin fetch
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: username,
          pwd: password,
          }),
        });
    
      const [response] = await Promise.all([fetchPromise, timeoutPromise]);

      if (response.ok) {
        //console.log('board.handleButtonPower() OK');
        //const data = await response.json();
        console.log('login.loginAcces() REQUEST DONE, response OK!');
        const jsonData = await response.json();
        const newUpdate = jsonData.message.trim().split(" ")[0];
        console.log('login.loginAcces() newUpdate:',newUpdate);
        }
      else{
        const data = await response.json();
        console.log('login.loginAcces()  Fail: %s/nData: %s',response, data);
      }
    } catch (error) {
      console.error('login.loginAcces()  Fetch error:', error);
    }
    finally{
      console.log('login.loginAcces() Finally');
    }
    console.log('login.loginAcces() END');
  };

  return (
    <div className="bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed h-screen w-screen">        
    <div className="mt-20 p-6 sm:p-4 bg-white shadow-2xl rounded-2xl w-full mx-auto max-w-md sm:max-w-sm max-h-screen overflow-y-auto">

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Accedi</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Nome utente o email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Inserisci il tuo nome utente o email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Inserisci la tua password"
          />
          <a href="#" className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800">
            Dimenticato la password?
          </a>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
            Codice
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="code"
            type="number"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Inserisci il codice"
          />
        </div>
        <div className="flex items-center justify-between">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setMessage('Hai cliccato su "Invia codice"')}
            >
                  Invia codice
            </button>
            <div className="flex">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() =>setActiveForm(PageForm.REGISTER)}
                >
                  Registrami
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleSubmit}
                >
                  Accedi
                </button>
            </div>
        </div>
        <p className="text-red-500 text-xs italic">{message}</p>
      </div>
      </div>
      </div>
    );
}

export default Login;
