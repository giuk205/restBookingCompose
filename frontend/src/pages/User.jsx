import PropTypes from 'prop-types';
import { PageForm, connectionprefix, UserType } from  '../globals';
import { useState, useEffect, useRef } from "react";
import { IconExit  } from "../components/Icons";
import ConfirmationWindow from '../components/ConfirmationWindow';



export default function User({ idUser, setIdUser, userPrivileges, setUserPrivileges, prevForm, setPrevForm, setActiveForm, actionOnUser, ricaricaUtenti, setRicaricaUtenti}) {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privilege, setPrivilege] = useState("");
  const [oldPasswordFake, setOldPasswordFake] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  //const [modalMessage, setModalMessage] = useState("");

  const modalRef = useRef(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        let idU='';
        if (actionOnUser !== null){
          idU='?idUser='+actionOnUser;
        }
        const response = await fetch(`${connectionprefix}/user${idU}`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setId(data.id);
          setUsername(data.username);
          setEmail(data.email);
          setPhone(data.phone);
          setPrivilege(data.privilege)
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
        body: JSON.stringify({ id: id, name: username, email, phone, privilege}),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        if (idUser !== id || userPrivileges < UserType.USER){
          setRicaricaUtenti(!ricaricaUtenti);
        }
      }
      else{
        setMessage(data.error);
      }
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
    // Invece di usare window.confirm, mostriamo il modal personalizzato
    setShowModal(true);
  };

  const confirmDeletion = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`${connectionprefix}/user?idUser=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      //setModalMessage(data.message);
      if (idUser === id){
        //Se sono io fa 
        setIdUser(null);
        setUserPrivileges(UserType.USER);
        setActiveForm(prevForm);
        setPrevForm(PageForm.HOME);
        const response1 = await fetch(`${connectionprefix}/logout`, {
          method: "GET",
          credentials: "include",
        });
        const data1 = await response1.json();
      }
      else{ //sono arrivato da pagina utenti
        setRicaricaUtenti(!ricaricaUtenti);
        setActiveForm(PageForm.HOME);
      }
    } catch (error) {
      //setModalMessage("Errore nella cancellazione dell'account: " + error);
      console.error("Errore nella cancellazione dell'account: " + error);
    }
  };

  const cancelDeletion = () => {  //annulla l'operazione
    setShowModal(false);
  };
  
  const myGetPrivilegeLabel = (privilege) => {
    const labels = {
      0: "Proprietario",
      10: "Amministratore",
      20: "Manager",
      30: "Staff",
      40: "Utente",
    };
    return labels[privilege] || "Sconosciuto";
  };

  const privilegeOptions = Object.entries(UserType)
  .filter(([_, value]) => value > (userPrivileges===UserType.MANAGER?UserType.STAFF:userPrivileges)) // Filtra privilegi superiori
  .map(([_, value]) => ({ label: myGetPrivilegeLabel(value), value }));

  return (
<div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center m-0"
     onMouseDown={(e) => {if (modalRef.current && !modalRef.current.contains(e.target)) { setActiveForm(prevForm); setPrevForm(PageForm.HOME);}}}
  >
    <div className="max-w-md mx-auto p-5 bg-white shadow-lg rounded-lg mt-20" ref={modalRef}>
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-between w-full">
        <div className="flex-grow text-center">
          {/* Contenitore per il testo, centrato */}
          Modifica Profilo
        </div>
        <div className="cursor-pointer transition-all duration-200 hover:bg-green-500 rounded-sm"
             onClick={() => {setActiveForm(prevForm);setPrevForm(PageForm.HOME)} }>
          <IconExit />
        </div>
      </h2>


    
      <label className="block mb">Nome</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded mb-2" />

      <label className="block mb">Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-2" />

      <label className="block mb">Telefono</label>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded mb-2" />

      {actionOnUser !== null && userPrivileges<UserType.MANAGER ? (
        <>
          <label className="block mb-1">Privilegi</label>
          <select
            value={privilege}
            onChange={(e) => setPrivilege(Number(e.target.value))}
            className="w-full p-2 border rounded mb-2"
          >
            {privilegeOptions.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </>
      ) : null}
{/*
      {actionOnUser !== null ? (<>
        <label className="block mb">Privilegi</label>
        <input type="tel" value={privilege} onChange={(e) => setPrivilege(e.target.value)} className="w-full p-2 border rounded mb-2" />
      </>) : null}
*/}

      <button onClick={handleUpdateUser} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4">Aggiorna Dati</button>

        {/* Cancella dati utente */}
        <div className="mb-2 text-center border-blue-500 border-1 rounded-lg hover:text-white hover:bg-red-500">
          <button onClick={handleDeleteUser}>Cancella i miei dati utente e le mie prenotazioni</button>
          {showModal && (
            <ConfirmationWindow
              title="Sei sicuro di voler cancellare il tuo account?"
              message="Verranno cancellate anche tutte le tue prenotazioni"
              onConfirm={confirmDeletion}
              onCancel={cancelDeletion}
            />
          )}
        </div>
        {/*message && <p>{message}</p>*/}
        {actionOnUser === null ? (<>
          <h2 className="text-xl font-bold mb-2">Cambio Password</h2>
          <label className="block mb">Vecchia Password</label>
          <input type="password" value={oldPasswordFake} autoComplete="off" placeholder="Inserisci la password attuale"   readOnly onFocus={(e) => e.target.removeAttribute("readOnly")} onChange={(e) => setOldPasswordFake(e.target.value)} className="w-full p-2 border rounded mb-2" />

          <label className="block mb">Nuova Password</label>
          <input type="password" readOnly onFocus={(e) => e.target.removeAttribute("readOnly")} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded mb-2" />

          <label className="block mb">Ripeti Nuova Password</label>
          <input type="password" readOnly onFocus={(e) => e.target.removeAttribute("readOnly")} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className="w-full p-2 border rounded mb-2" />

          <button onClick={handleChangePassword} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Cambia Password</button>
        </>) : null}

      {message && <p className="text-center mt-2 text-red-500">{message}</p>}
    </div>
</div>
  );
}
User.propTypes = {
  idUser: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  setIdUser: PropTypes.func.isRequired,
  setUserPrivileges: PropTypes.func.isRequired,
  prevForm: PropTypes.oneOf(Object.values(PageForm)),
  setPrevForm: PropTypes.func.isRequired,
  setActiveForm: PropTypes.func.isRequired,

}