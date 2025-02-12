import { useState, useRef, useEffect} from "react";
import { UserType, connectionprefix, PageForm } from  '../globals';
import { IconExit  } from "../components/Icons";

export default function Register({ initialMessage = "Compila i campi e richiedi il codice", setActiveForm, prevForm, setPrevForm, idUser, userPrivileges, ricaricaUtenti, setRicaricaUtenti }) {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState(initialMessage);
  const [emailValida, setEmailValida] = useState(true);
  const [phoneValido, setPhoneValido] = useState(true);

  const [enButtonRegister, setEnButtonRegister] = useState(false);
  const [enButtonCode, setEnButtonCode] = useState(true);

  const modalRefRegister = useRef(null);  //Per chiudere la modal se click all'esterno
  
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
    // Rimuovi spazi, parentesi, trattini e altri caratteri speciali
    const cleanedPhone = phone.replace(/\s+|[-()]/g, '');
    const phoneRegex = /^\+?[0-9]{10,14}$/; // Accetta un + opzionale seguito da 10-14 cifre

    return phoneRegex.test(cleanedPhone);
};

const getValidPhone = (phone) => {
  // Rimuovi spazi e mantieni solo numeri e il + iniziale
  const cleanedPhone = phone.replace(/\s+/g, ''); // Rimuovi tutti gli spazi
  const validPhone = cleanedPhone.replace(/(?!^\+)[^0-9]/g, ''); // Mantieni il + iniziale e solo numeri

  return validPhone;
};


useEffect(() => {
  if (username && email && phone && code){
    if (isValidEmail(email) && isValidPhone(phone) && code>99 && code<1000){
      setEnButtonRegister(true);
      return;
    }
  }
  if (idUser !== null){
    if (username && email && phone){
      if (isValidEmail(email) && isValidPhone(phone)){
        setCode(999);
        setEnButtonRegister(true);
        return;
      }
    }
  }
  setEnButtonRegister(false);
}, [username, email, phone, code]);


  const handleSendCode = async () => {
    if (!username) {
      setMessage("Compila il campo Nome!");
      return;
    }
    if (!email) {
      setMessage("Inserisci un'email per ricevere il codice.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Inserisci un'email valida.");
      return;
    }
    if (!phone) {
      setMessage("Inserisci numero di telefono.");
      return;
    }
    if (!phone || !isValidPhone(phone)) {
      setMessage("Inserisci un numero di telefono valido (10 cifre).");
      return;
    }

    // Verifica che i campi siano stati compilati
    if (!email || !username || !phone) {
      setMessage('Per accedere devi compilare entrambi i campi');
      return;
    }
    setMessage(`Codice inviato all'email ${email}`);

    // Logica per inviare i dati al server
    try {
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
      const cleanPhone = getValidPhone(phone);
      const fetchPromise = await fetch(connectionprefix+'/register', {
        method: 'POST',
        credentials: 'include', //send cookie also on cross-origin fetch
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: username,
          email: email,
          phone: cleanPhone, 
          }),
        });
    
      const [response] = await Promise.all([fetchPromise, timeoutPromise]);

      if (response.ok) {
        const jsonData = await response.json();
        const msg =`Per debug: inviata email ${jsonData.emailAlert}` 
        setMessage(msg);
        }
      else{
        const data = await response.json();
        setMessage(JSON.stringify(data));
      }
    } catch (error) {
      setMessage(error);
    }
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
    setMessage("Registrazione inoltrata!");

    // Logica per inviare i dati al server
    try {
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
      const cleanPhone = getValidPhone(phone);
      const fetchPromise = await fetch(connectionprefix+'/register', {
        method: 'POST',
        credentials: 'include', //send cookie also on cross-origin fetch
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: username,
          email: email,
          phone: cleanPhone,  
          code: code,
          }),
        });
    
      const [response] = await Promise.all([fetchPromise, timeoutPromise]);

      if (response.ok) {
        const jsonData = await response.json();
        const msg =`Per debug: inviata email ${jsonData.emailAlert}.       Devi effettuare il login` 
        setMessage(msg);
        setCode('');
        setEnButtonCode(false);
        if  (idUser !== null){
          console.log("RICARICA UTENTI!");
          setRicaricaUtenti(!ricaricaUtenti);
        }
      }
      else{
        const data = await response.json();
        setMessage(JSON.stringify(data));
      }
    } catch (error) {

      setMessage(error);
    }
  };

  return (
    <div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center"
        onMouseDown={(e) => {if (modalRefRegister.current && !modalRefRegister.current.contains(e.target)) {
          (idUser === null)? setActiveForm(PageForm.LOGIN):  setActiveForm(PageForm.HOME)
        }}}
    >
      <div className="p-8 bg-white shadow-2xl rounded-2xl w-full max-w-md" ref={modalRefRegister}>
        <div className="flex flex-col items-center mb-6">
          <img src="/profilo5.png" alt="Profilo" className="mx-auto w-32 mb-4" />
          <h2 className="text-2xl font-bold mb-15 flex items-center w-full">
            <div className="flex-grow text-center">
             Registrazione utente
            </div>
            <div 
              className="cursor-pointer transition-all duration-200 hover:bg-green-500 rounded-sm ml-auto"
              onClick={() => { (idUser === null)? setActiveForm(PageForm.LOGIN):  setActiveForm(PageForm.HOME) }}
            >
              <IconExit />
            </div>
          </h2>

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
              onSelect={() => setPhoneValido(true)}
              />
          </div>
          {idUser === null && ( 
            <div className="flex items-center space-x-2 mt-8">
              <button
                onClick={handleSendCode}
                className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center w-24 h-10"
                style={{ width: "405px", height: "40px" }}
                disabled={!enButtonCode} // Disabilita se enButtonRegister è false
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
          )}
        </div>

        <div className="mt-10">
          <button
            onClick={handleRegister}
            className="cursor-pointer w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed" // Stili per il disabled
            disabled={!enButtonRegister} // Disabilita se enButtonRegister è false
          >
            Registrati
          </button>
        </div>

        {message && <p className="text-sm text-gray-600 mb-4 mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
