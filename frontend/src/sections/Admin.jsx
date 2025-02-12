import { useEffect, useState } from "react";
import { connectionprefix, PageForm, UserType } from "../globals";
import { IconSetting, IconForkKnife } from "../components/Icons";


export default function Admin({homeRef, activeForm, setActiveForm, idUser, setIdUser, userPrivileges, setUserPrivileges, prevForm, setPrevForm, setActionOnUser, ricaricaUtenti, setRicaricaUtenti}) {
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`${connectionprefix}/data`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setMessage("Errore nel caricamento degli utenti.");
        }
      } catch (error) {
        setMessage("Errore di connessione." + error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [ricaricaUtenti]);

  const getPrivilegeLabel = (privilege) => {
    const labels = {
      0: "Proprietario",
      10: "Amministratore",
      20: "Manager",
      30: "Staff",
      40: "Utente",
    };
    return labels[privilege] || "Sconosciuto";
  };

  const renderMessage = () => {
    return message && <p className="text-center mt-4 text-red-500">{message}</p>;
  };

  const sortedUsers = user.sort((a, b) => a.privilege - b.privilege);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-lg mt-16">

      <div className="flex items-center">
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-bold">Gestione Utenti</h2>
        </div>
        <button className="bg-green-500 text-white px-6 py-2 rounded shadow-md shadow-emerald-950"
        onClick={()=>{
          //Salva la posizione dello scroll di Home
          homeRef.current.dataset.scrollPosition = window.scrollY;
          setPrevForm(PageForm.HOME);
          setActiveForm(PageForm.REGISTER);
        }}>
          Aggiungi Utente
        </button>
      </div>

      {renderMessage()}

      <div className="mt-4 border rounded-lg  overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Caricamento utenti...</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 font-bold">Nome</th>
                <th className="p-2 font-bold">Email</th>
                <th className="p-2 font-bold">Telefono</th>
                <th className="p-2 font-bold">Privilegi</th>
                <th className="p-2 font-bold">Azioni</th>
              </tr>
            </thead>
            <tbody>
          {user.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">Nessun utente trovato</td>
            </tr>
          ) : (
            sortedUsers.map((user, index) => {
              const isEvenRow = index % 2 === 0;
              const rowBackground = isEvenRow ? "bg-white" : "bg-neutral-300";

              // Controlliamo se il privilegio cambia rispetto all'elemento attuale
              const isPrivilegeChanged =
                index < sortedUsers.length - 1 && user.privilege !== sortedUsers[index + 1].privilege;

              return (
                <tr
                  key={user.id}
                  className={`${rowBackground} border-b border-black 
                    ${isPrivilegeChanged ? "border-b border-orange-500" : ""} 
                    hover:bg-gray-200 transition-colors duration-300`}
                >
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.phone}</td>
                  <td className="p-2">{getPrivilegeLabel(user.privilege)}</td>
                  <td>
                    <button className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      hidden={userPrivileges >= UserType.MANAGER && user.privilege < UserType.USER}
                      onClick={()=>{
                        //Salva la posizione dello scroll di Home
                        homeRef.current.dataset.scrollPosition = window.scrollY;
                        setPrevForm(PageForm.HOME);
                        setActionOnUser(user.id);
                        setActiveForm(PageForm.USER);
                      }}
                    >
                      <IconSetting/>
                    </button>
                    <button className="ml-4 text-blue-500 hover:text-blue-700 cursor-pointer "
                      onClick={()=>{
                        setPrevForm(PageForm.HOME);
                        setActionOnUser(user.id);
                        setActiveForm(PageForm.BOOKING);
                      }}
                    >
                      <IconForkKnife/>
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>

          </table>
        )}
      </div>
    </div>
  );
}
