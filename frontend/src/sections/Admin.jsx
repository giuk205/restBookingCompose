import { useEffect, useState } from "react";
import { connectionprefix } from "../globals";

export default function Admin() {
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
  }, []);

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

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-lg mt-16">
      <h2 className="text-2xl font-bold text-center">Gestione Utenti</h2>

      {renderMessage()}

      <div className="mt-4 border rounded-lg p-4">
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
                <th className="p-2 font-bold">Azione</th>
              </tr>
            </thead>
            <tbody>
              {user.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    Nessun utente trovato
                  </td>
                </tr>
              ) : (
                user.map((user) => (
                  <tr key={user.id} className="bg-white border-b">
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.phone}</td>
                    <td className="p-2">{getPrivilegeLabel(user.privilege)}</td>
                    <td>
                      <button className="text-blue-500 hover:text-blue-700">
                        Modifica
                      </button>
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
