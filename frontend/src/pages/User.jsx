import PropTypes from 'prop-types';
import { PageForm } from  '../globals';
import { useState, useEffect, useRef } from "react";
import { connectionprefix } from "../globals";
import { IconExit  } from "../components/Icons";



export default function User({ prevForm, setActiveForm}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPasswordFake, setOldPasswordFake] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");


  const modalRef = useRef(null);

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
<div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center m-0"
       onClick={(e) => {if (modalRef.current && !modalRef.current.contains(e.target)) { setActiveForm(prevForm);}}} >
    <div className="max-w-md mx-auto p-5 bg-white shadow-lg rounded-lg mt-20" ref={modalRef}>
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-between w-full">
        <div className="flex-grow text-center">
          {/* Contenitore per il testo, centrato */}
          Modifica Profilo
        </div>
        <div className="cursor-pointer transition-all duration-200 hover:bg-green-500 rounded-sm"
             onClick={() => {setActiveForm(prevForm)} }>
          <IconExit />
        </div>
      </h2>


    
      <label className="block mb">Nome</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded mb-2" />

      <label className="block mb">Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-2" />

      <label className="block mb">Telefono</label>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded mb-2" />

      <button onClick={handleUpdateUser} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4">Aggiorna Dati</button>

        {/* Cancella dati utente */}
        <div className="mb-2 text-center border-blue-500 border-1 rounded-lg hover:text-white hover:bg-red-500">
          <button  onClick={handleDeleteUser} className=" text-sm"  >
            Cancella i miei dati utente e le mie prenotazioni 
          </button>
        </div>

      <h2 className="text-xl font-bold mb-2">Cambio Password</h2>
      <label className="block mb">Vecchia Password</label>
      <input type="password" value={oldPasswordFake} autoComplete="off" placeholder="Inserisci la password attuale"   readOnly onFocus={(e) => e.target.removeAttribute("readOnly")} onChange={(e) => setOldPasswordFake(e.target.value)} className="w-full p-2 border rounded mb-2" />

      <label className="block mb">Nuova Password</label>
      <input type="password" readOnly onFocus={(e) => e.target.removeAttribute("readOnly")} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded mb-2" />

      <label className="block mb">Ripeti Nuova Password</label>
      <input type="password" readOnly onFocus={(e) => e.target.removeAttribute("readOnly")} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className="w-full p-2 border rounded mb-2" />

      <button onClick={handleChangePassword} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Cambia Password</button>
      
      {message && <p className="text-center mt-2 text-red-500">{message}</p>}
    </div>
</div>
  );
}
User.propTypes = {
    activeForm: PropTypes.oneOf(Object.values(PageForm)).isRequired, 
    setActiveForm: PropTypes.func.isRequired,
    prevForm: PropTypes.oneOf(Object.values(PageForm)),
}