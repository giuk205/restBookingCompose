import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { UserType, connectionprefix, PageForm } from  '../globals';
import { IconExit  } from "../components/Icons";

export default function Login({  setActiveForm, idUser, setIdUser,  setUserPrivileges, prevForm, setPrevForm}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('Compila i campi');
  const [isForgotPasswordAttempted, setIsForgotPasswordAttempted] = useState(false);
    
  const loginFetchOngoing = useRef(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Nuovo stato per disabilitare il bottone


  const modalRefLogin = useRef(null);  //Per chiudere la modal se click all'esterno

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

    if (loginFetchOngoing.current || !username || !password) {
      return; // Impedisce l'invio se la fetch è già in corso o username/password sono vuoti
    }

    console.log('Username:', username);
    console.log('Password:', password);
    // Verifica che i campi siano stati compilati
    if (!username || !password) {
      setMessage('Per accedere devi compilare entrambi i campi');
      return;
    }

    loginFetchOngoing.current = true;
    setIsButtonDisabled(true); // Disabilita il bottone

    // Logica per inviare i dati al server
    try {
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Connessione in corso');

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
        if(jsonData.message==='Login riuscito'){
          setIdUser(jsonData.idUser);
          setUserPrivileges(jsonData.privilege);
          console.log('login.loginAcces() idUser:',jsonData.idUser," privilege:",jsonData.userPrivileges);
          let pf = prevForm;
          if (pf === PageForm.REGISTER){
            pf = PageForm.HOME; 
          }
          setActiveForm(pf);
          setPrevForm(PageForm.HOME);
        }
      }
      else{
        try { 
          const data = await response.json(); // parse la risposta JSON
          console.error('login.loginAcces() Fail:', response.status, response.statusText, 'Data:', data);
          if (data && data.message) { 
            setMessage(data.message);
          }
        } catch (error) {
          console.error('login.loginAcces() Fail:', response.status, response.statusText, 'Errore parsing JSON:', error);
          const text = await response.text();
          console.error("Testo della risposta:", text); // Stampa il testo della risposta
        }
      }
    } catch (error) {
      console.error('login.loginAcces()  Fetch error:', error);
    }
    finally{
      loginFetchOngoing.current = false;
      setIsButtonDisabled(false); // Riabilita il bottone
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
  const handleForgotPassword = async() => {
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
    const fetchPromise = await fetch(connectionprefix+'/register', {
      method: 'POST',
      credentials: 'include', //send cookie also on cross-origin fetch
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: username,
        name: username,
        phone: 9999,
        code: 9999,
        }),
      });
  
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
    const [response] = await Promise.all([fetchPromise, timeoutPromise]);

    const jsonData = await response.json();
    if (response.ok) {
      if(jsonData.message==='Utente autorizzato con successo'){
        const msg =`Per debug: inviata email ${jsonData.emailAlert}.<br />Devi effettuare il login`;
        setMessage(msg);
      }
      else{
        setMessage(jsonData.message);
      }
    }
    else{
      try { 
        const data = await response.json(); // parse la risposta JSON
        console.error('login.handleForgotPassword() Fail:', response.status, response.statusText, 'Data:', data);
        if (data && data.message) { 
          setMessage(data.message);
        }
      } catch (error) {
        console.error('login.handleForgotPassword() Fail:', response.status, response.statusText, 'Errore parsing JSON:', error);
        const text = await response.text();
        console.error("Testo della risposta:", text); // Stampa il testo della risposta
      }
    }
 };
 
  const handleRegister = () => {
    //alert('Vai alla registrazione!');
    setActiveForm(PageForm.REGISTER);
  };

//  <h2 className="text-4xl font-bold text-center mb-15">Login</h2>

  return (
    <div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center"
      onMouseDown={(e) => {if (modalRefLogin.current && !modalRefLogin.current.contains(e.target)) { setActiveForm(prevForm); setPrevForm(PageForm.HOME);}}}
    >
    <div className="p-8 sm:p-8 bg-white shadow-2xl rounded-2xl w-full mx-auto max-w-md sm:max-w-sm" ref={modalRefLogin}>
  
    <h2 className="text-4xl font-bold mb-15 flex items-center w-full">
    <div className="flex-grow text-center">
      Login
    </div>
    <div 
      className="cursor-pointer transition-all duration-200 hover:bg-green-500 rounded-sm ml-auto"
      onClick={() => { setActiveForm(prevForm); setPrevForm(PageForm.HOME) }}
    >
      <IconExit />
    </div>
  </h2>





        {/* Nome o Email */}
        <form>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-1">Nome o Email</label>
          <input
            type="text"
            name="username"
            autoComplete="username"
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
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage('Compila i campi');

              }}
            />
            <button type="submit" className="hidden"></button>
  
        </div>
        </form>
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
            disabled={!username || !password || isButtonDisabled} 
          >
            Accedi
          </button>
        </div>
        <p className="text-red-500 text-xs italic" dangerouslySetInnerHTML={{ __html: message }}></p>
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
    prevForm: PropTypes.oneOf(Object.values(PageForm)),
    setPrevForm: PropTypes.func.isRequired,
  };

