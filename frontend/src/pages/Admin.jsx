import { useEffect, useState } from "react";
import { connectionprefix } from "../globals";
 
export default function Admin() {
  const [user, setUser] = useState([]); // Stato per memorizzare gli utenti
  const [message, setMessage] = useState(""); // Stato per messaggi di errore o successo
  const [loading, setLoading] = useState(true); // Stato di caricamento
 
  // Fetch dei dati di tutti gli utenti al caricamento del componente
  useEffect(() => {
    async function fetchUserData() {
      try {
        console.log("useEffect[].fetchUserData");
        const response = await fetch(`${connectionprefix}/data`, {
          method: "GET",
          credentials: "include",
        });
        console.log("useEffect[].fetchUserData after fetch");
 
        if (response.ok) {
            console.log("useEffect[].fetchUserData response ok");
            const data = await response.json();
          setUser(data); // Imposta i dati degli utenti nello stato
        } else {
          console.log("useEffect[].fetchUserData Errore nel caricamento degli utenti.");
          setMessage("Errore nel caricamento degli utenti.");
        }
      } catch (error) {
        console.log("useEffect[].fetchUserData Errore di connessione."+error);
        setMessage("Errore di connessione."+error);
      } finally {
        console.log("useEffect[].fetchUserData finally");
        setLoading(false); // Imposta loading a false una volta completata la richiesta
      }
    }
 
    fetchUserData();
  }, []); // La richiesta verrà fatta solo una volta al caricamento del componente
 
  // Mostra il messaggio di errore solo se presente
  const renderMessage = () => {
    return message && <p className="text-center mt-4 text-red-500">{message}</p>;
  };
 
  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-lg mt-16" >
      <h2 className="text-2xl font-bold text-center">Gestione Utenti</h2>
 
      {/* Mostra il messaggio di errore o successo */}
      {renderMessage()}
 
      {/* Sezione utenti */}
      <div className="mt-4 border rounded-lg p-4">
        {/* Mostra un messaggio di caricamento fino a quando i dati non sono pronti */}
        {loading ? (
          <p className="text-center text-gray-500">Caricamento utenti...</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 font-bold">Nome</th>
                <th className="p-2 font-bold">Email</th>
                <th className="p-2 font-bold">Telefono</th>
                <th className="p-2 font-bold">Privilegi</th>
                <th className="p-2 font-bold">Azione</th>
              </tr>
            </thead>
            <tbody>
              {user.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">Nessun utente trovato</td>
                </tr>
              ) : (
                user.map((user) => (
                  <tr key={user.id} className="bg-white border-b">
                    <td className="p-2">1:{user.username}</td>
                    <td className="p-2">2:{user.email}</td>
                    <td className="p-2">3:{user.phone}</td>
                    <td className="p-2">4:{user.privilege}</td>
                    <td>
                      <button className="text-blue-500 hover:text-blue-700">Modifica</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}