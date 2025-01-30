import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UserType, connectionprefix, PageForm } from  '../globals';

export default function Login({ activeForm, setActiveForm, idUser, setIdUser, userPrivileges, setUserPrivileges, prevForm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('Compila i campi');
  const [isForgotPasswordAttempted, setIsForgotPasswordAttempted] = useState(false);

  if (idUser !== null) {
    console.error('Login() Valore idUser non nullo forza PageForm.USER idUser:',idUser);
    setActiveForm(PageForm.USER); // Forza il form attivo a USER
    return;
  }

  /**
   * Gestisce la pressione del tasto Accedi.
   * Verifica che i campi siano stati compilati e poi 
   * esegue la logica per inviare i dati al server.
   */
  const handleSubmit = async () => {
    console.log('Username:', username);
    console.log('Password:', password);
    // Verifica che i campi siano stati compilati
    if (!username || !password) {
      setMessage('Per accedere devi compilare entrambi i campi');
      return;
    }

    // Logica per inviare i dati al server
    try {
      console.log('login.loginAccess() Proviamo a comunicare con il python');
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
        console.log('login.loginAcces() REQUEST DONE, response OK!');
        const jsonData = await response.json();
        if(jsonData.message==='Login successful'){
          setIdUser(jsonData.idUser);
          console.log('login.loginAcces() idUser:',jsonData.idUser);
          setActiveForm(prevForm);
        }
      }
      else{
        const data = await response.json();
        console.log('login.loginAcces()  Fail: %s/nData: %s',response, data);
      }
    } catch (error) {
      console.error('login.loginAcces()  Fetch error:', error);
    }
    finally{
      //console.log('login.loginAcces() Finally');
    }
    //console.log('login.loginAcces() END');
  };

  /**
   * Verifica se una stringa è un'email valida.
   * @param {string} email - La stringa da verificare.
   * @returns {boolean} - True se la stringa è un'email valida, altrimenti false.
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Gestisce la pressione del testo 'Password dimenticata'.
   * Verifica che il campi nome sia compilat (con una email)
   * e poi esegue la logica per inviare i dati al server e la email.
   */
  const handleForgotPassword = () => {
    setIsForgotPasswordAttempted(true); // Attiva la validazione visiva
    // alert('Recupero password avviato!');
    if (!username) {
      setMessage('Inserisci l\'email per poter ricevere la password temporanea');
      return;
    }
    // Verifica che l'username sia un'email valida
    if (!isValidEmail(username)) {
      setMessage('Inserisci un\'email valida');
      return;
    }
    // Logica per inviare i dati al server
    setMessage('Procedura recupero password avviata');
    console.log('Login().ForgotPassword.Richiedi email per email:', username);
    //TODO
   };
 
  const handleRegister = () => {
    //alert('Vai alla registrazione!');
    setActiveForm(PageForm.REGISTER);
  };

//    <div className="bg-white p-16 rounded-2xl shadow-lg w-full max-w-md">

  return (
    <div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center">
    <div className="p-8 sm:p-8 bg-white shadow-2xl rounded-2xl w-full mx-auto max-w-md sm:max-w-sm">
  
    <h2 className="text-4xl font-bold text-center mb-15">Login</h2>

        {/* Nome o Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-1">Nome o Email</label>
          <input
            type="text"
            placeholder="Inserisci il tuo nome o Email"
            className={`border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isForgotPasswordAttempted && !isValidEmail(username) ? "border-pink-500 text-pink-600" : ""
            }`}
            onChange={(e) => {
              setUsername(e.target.value);
              setMessage('Compila i campi');
              setIsForgotPasswordAttempted(false); // Reset validazione se l'utente modifica il campo
            }}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-1">Password</label>
          <input
            type="password"
            placeholder="Inserisci la tua password"
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage('Compila i campi');

            }}
          />
        </div>

        {/* Password Dimenticata */}
        <div className="mb-6 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-blue-500 hover:underline text-sm"
          >
            Password dimenticata?
          </button>
        </div>

        {/* Bottoni */}
        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={handleRegister}
            className="w-1/2 bg-indigo-400 text-white py-2 rounded-lg hover:bg-gray-600"
          >
            Registrami
          </button>
          <button
            onClick={handleSubmit}
            className={`w-1/2 text-white py-2 rounded-lg ${!username || !password ? 'bg-gray-400' : 'bg-green-500 hover:bg-blue-600'}`}

            disabled={!username || !password}
          >
            Accedi
          </button>
        </div>
        <p className="text-red-500 text-xs italic">{message}</p>
      </div>
    </div>
  );
}

//activeForm, setActiveForm,idUser, setIdUser, userPrivileges, setUserPrivileges
Login.propTypes = {
    activeForm: PropTypes.oneOf(Object.values(PageForm)), 
    setActiveForm: PropTypes.func.isRequired, 
    idUser: PropTypes.number, 
    setIdUser: PropTypes.func.isRequired,
    userPrivileges: PropTypes.oneOf(Object.values(UserType)), 
    setUserPrivileges: PropTypes.func.isRequired,
  };

