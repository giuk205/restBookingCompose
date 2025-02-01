import PropTypes from 'prop-types';
import { PageForm } from  '../globals';
import { useState, useEffect } from "react";
import { connectionprefix } from "../globals";
import { IconExit, IconMoveLeft } from "../components/Icons";



export default function User({ prevForm, setActiveForm}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPasswordFake, setOldPasswordFake] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");


  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`${connectionprefix}/user`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setEmail(data.email);
          setPhone(data.phone);
        } else {
          setMessage("Errore nel caricamento dei dati utente.");
        }
      } catch (error) {
        setMessage("Errore di connessione:" + error);
      }
    }
    fetchUserData();
  }, []);

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`${connectionprefix}/user`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, phone }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Errore nell'aggiornamento del profilo:" + error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== repeatPassword) {
      setMessage("Le nuove password non coincidono.");
      return;
    }
    try {
      const response = await fetch(`${connectionprefix}/user`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPasswordFake, newPassword }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Errore nel cambio password:" + error);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Sei sicuro di voler cancellare il tuo account?")) {
      try {
        const response = await fetch(`${connectionprefix}/user`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        setMessage("Errore nella cancellazione dell'account:" + error);
      }
    }
  }

  return (
    <div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center m-0">
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
        <div className="cursor-pointer transition-all duration-200 border-zinc-600 border-2 rounded-lg hover:bg-green-500"
          onClick={() => {console.log( "USER LOGOUT prevForm:"+PageForm);

            setActiveForm(prevForm);} }
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)} >
          <div className="icon"> 
           {isHovering===true ? <IconMoveLeft /> : <IconExit />}
          </div>
        </div>
        <div> {/* Contenitore per il testo */}
          Modifica Profilo
        </div>
        <div className="w-12"></div> {/* Spazio vuoto a destra per bilanciare */}
      </h2>


    
      <label className="block mb-2">Nome</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <label className="block mb-2">Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <label className="block mb-2">Telefono</label>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <button onClick={handleUpdateUser} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-6">Aggiorna Dati</button>

        {/* Cancella dati utente */}
        <div className="mb-6 text-center border-blue-500 border-1 rounded-lg hover:bg-red-500">
          <button  onClick={handleDeleteUser} className="text-blue-500 hover:text-white text-sm"  >
            Cancella i miei dati utente e le mie prenotazioni 
          </button>
        </div>

      <h2 className="text-xl font-bold mb-4">Cambio Password</h2>
      <label className="block mb-2">Vecchia Password</label>
      <input type="password" value={oldPasswordFake} autoComplete="off" placeholder="Inserisci la password attuale"   readOnly onFocus={(e) => e.target.removeAttribute("readOnly")} onChange={(e) => setOldPasswordFake(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <label className="block mb-2">Nuova Password</label>
      <input type="password" readOnly onFocus={(e) => e.target.removeAttribute("readOnly")} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <label className="block mb-2">Ripeti Nuova Password</label>
      <input type="password" readOnly onFocus={(e) => e.target.removeAttribute("readOnly")} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <button onClick={handleChangePassword} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Cambia Password</button>
      
      {message && <p className="text-center mt-4 text-red-500">{message}</p>}
    </div>
</div>
  );
}
User.propTypes = {
    activeForm: PropTypes.oneOf(Object.values(PageForm)).isRequired, 
    setActiveForm: PropTypes.func.isRequired,
    prevForm: PropTypes.oneOf(Object.values(PageForm)),
}