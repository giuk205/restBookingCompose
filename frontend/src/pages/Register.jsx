import { useState } from "react";
import { UserType, connectionprefix, PageForm } from  '../globals';

export default function Register({ initialMessage = "Ciao" }) {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState(initialMessage);
  const [emailValida, setEmailValida] = useState(true);
  const [phoneValido, setPhoneValido] = useState(true);

  /**
   * Controllo email e numer odi telefono
   * Gestisce la pressione del tasto codice email.
   * Verifica che i campi siano stati compilati e poi 
   * esegue la logica per inviare i dati al server.
   */  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
      const phoneRegex = /^[0-9]{10}$/; // Accetta solo 10 cifre
      return phoneRegex.test(phone);
  };

  const handleSendCode = async () => {
    if (!email) {
      setMessage("Inserisci un'email per ricevere il codice.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Inserisci un'email valida.");
      return;
    }
    if (!phone) {
      setMessage("Inserisci numero di telefono per ricevere il codice.");
      return;
    }
    if (!phone || !isValidPhone(phone)) {
      setMessage("Inserisci un numero di telefono valido (10 cifre).");
      return;
    }
    setMessage(`Codice inviato all'email ${email}`);

    // Verifica che i campi siano stati compilati
    if (!email || !username || !phone) {
      setMessage('Per accedere devi compilare entrambi i campi');
      return;
    }

    // Logica per inviare i dati al server
    try {
      console.log('Register.handleSendCode Proviamo a comunicare con il python');
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));

      const fetchPromise = await fetch(connectionprefix+'/register', {
        method: 'POST',
        credentials: 'include', //send cookie also on cross-origin fetch
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: username,
          email: email,
          phone: phone, 
          }),
        });
    
      const [response] = await Promise.all([fetchPromise, timeoutPromise]);

      if (response.ok) {
        //console.log('board.handleButtonPower() OK');
        //const data = await response.json();
        console.log('Register.handleSendCode REQUEST DONE, response OK!');
        const jsonData = await response.json();
        const newUpdate = jsonData.message.trim().split(" ")[0];
        console.log('Register.handleSendCode newUpdate:',newUpdate);
        }
      else{
        const data = await response.json();
        console.log('Register.handleSendCode  Fail: %s/nData: %s',response, data);
      }
    } catch (error) {
      console.error('Register.handleSendCode  Fetch error:', error);
    }
    finally{
      console.log('Register.handleSendCode Finally');
    }
    console.log('Register.handleSendCode END');

  };

  const handleRegister = async () => {
    if (!username || !email || !phone || !code) {
      setMessage("Compila tutti i campi per registrarti.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Inserisci un'email valida.");
      return;
    }
    if (!isValidPhone(phone)) {
      setMessage("Inserisci un numero di telefono valido.");
      return; 
    }
    setMessage("Registrazione completata!");

    // Logica per inviare i dati al server
    try {
      console.log('Register.handleRegister Proviamo a comunicare con il python');
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));

      const fetchPromise = await fetch(connectionprefix+'/register', {
        method: 'POST',
        credentials: 'include', //send cookie also on cross-origin fetch
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: username,
          email: email,
          phone: phone, 
          code: code,
          }),
        });
    
      const [response] = await Promise.all([fetchPromise, timeoutPromise]);

      if (response.ok) {
        //console.log('board.handleButtonPower() OK');
        //const data = await response.json();
        console.log('Register.handleRegister REQUEST DONE, response OK!');
        const jsonData = await response.json();
        const newUpdate = jsonData.message.trim().split(" ")[0];
        console.log('Register.handleRegister newUpdate:',newUpdate);
        }
      else{
        const data = await response.json();
        console.log('Register.handleRegister  Fail: %s/nData: %s',response, data);
      }
    } catch (error) {
      console.error('Register.handleRegister  Fetch error:', error);
    }
    finally{
      console.log('Register.handleRegister Finally');
    }
    console.log('Register.handleRegister END');
  };



  return (
    <div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center">
      <div className="p-8 bg-white shadow-2xl rounded-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/profilo5.png" alt="Profilo" className="mx-auto w-32 mb-4" />
          <h2 className="text-2xl font-bold text-center">Registrazione utente</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}

              placeholder="Nome"
              className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              placeholder="Inserire email"
              className={`w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                emailValida ? "" : "border-pink-500 text-pink-600"
              }`}
              onBlur={() => setEmailValida(email !== "" && isValidEmail(email))}
              onSelect={() => setEmailValida(true)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefono</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
              }}
              placeholder="Telefono"
              className={`w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 ${phoneValido ? '' : 'border-pink-500 text-pink-600'}`} 
              onFocus={() => { if (phone === '' || phone === '+39') setPhone('+39'); }} 
              onBlur={() => setPhoneValido(isValidPhone(phone))}
              onSelect={() => setPhoneValida(true)}
              />
            </div>

          <div className="flex items-center space-x-2 mt-8">
            <button
              onClick={handleSendCode}
              className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center w-24 h-10"
              style={{ width: "405px", height: "40px" }}
            >
              Codice email
            </button>
            <input
              type="text"
              name="code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
              }}
              placeholder="123"
              maxLength="3"
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="mt-10">
          <button
            onClick={handleRegister}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Registrati
          </button>
        </div>

        {message && <p className="text-sm text-gray-600 mb-4 mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
