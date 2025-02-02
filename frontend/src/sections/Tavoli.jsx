import { useEffect, useState } from "react";
import { connectionprefix } from "../globals";

export default function Tavoli() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({
    nome: "",
    numero: "",
    posti: "",
    disponibileDa: "",
    disponibileFino: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await fetch(`${connectionprefix}/tables`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          
          const formattedData = data.tables.map((table) => {
            const [dateFrom, timeFrom] = table.availableFrom.split("T");
            const [dateTo, timeTo] = table.availableUntil.split("T");
            return {
              id: table.id,
              nome: table.name,
              numero: table.number,
              posti: table.seats,
              disponibileDa: dateFrom,
              disponibileFino: dateTo,
            };
          });

          setTables(formattedData);
        } else {
          setMessage("Errore nel caricamento dei tavoli.");
        }
      } catch (error) {
        setMessage("Errore di connessione: " + error);
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, []);

  const handleChange = (e) => {
    setNewTable({
      ...newTable,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTable = () => {
    // Aggiungi un nuovo tavolo nella lista (in una vera app, dovresti inviare i dati al server)
    setTables([...tables, { ...newTable, id: tables.length + 1 }]);
    setNewTable({
      nome: "",
      numero: "",
      posti: "",
      disponibileDa: "",
      disponibileFino: "",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-lg mt-16">
      <h2 className="text-2xl font-bold text-center">Gestione Tavoli</h2>

      <div className="mt-4 border rounded-lg p-4">
        {loading ? (
          <p className="text-center text-gray-500">Caricamento tavoli...</p>
        ) : (
          <div className="space-y-4">
            {/* Aggiungi nuova riga per il nuovo tavolo */}
            <div className="flex justify-between items-center">
              <label htmlFor="nome" className="w-1/4 text-left">Nome Tavolo</label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={newTable.nome}
                onChange={handleChange}
                placeholder="Nome tavolo"
                className="w-3/4 p-2 border rounded"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="numero" className="w-1/4 text-left">Numero Tavolo</label>
              <input
                type="text"
                name="numero"
                id="numero"
                value={newTable.numero}
                onChange={handleChange}
                placeholder="Numero tavolo"
                className="w-3/4 p-2 border rounded"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="posti" className="w-1/4 text-left">Posti</label>
              <input
                type="number"
                name="posti"
                id="posti"
                value={newTable.posti}
                onChange={handleChange}
                placeholder="Posti"
                className="w-3/4 p-2 border rounded"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="disponibileDa" className="w-1/4 text-left">Disponibile Da</label>
              <input
                type="date"
                name="disponibileDa"
                id="disponibileDa"
                value={newTable.disponibileDa}
                onChange={handleChange}
                className="w-3/4 p-2 border rounded"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="disponibileFino" className="w-1/4 text-left">Disponibile Fino</label>
              <input
                type="date"
                name="disponibileFino"
                id="disponibileFino"
                value={newTable.disponibileFino}
                onChange={handleChange}
                className="w-3/4 p-2 border rounded"
              />
            </div>

            <div className="text-center mt-4">
              <button
                onClick={handleAddTable}
                className="bg-green-500 text-white px-6 py-2 rounded"
              >
                Aggiungi Tavolo
              </button>
            </div>

            {/* Tabella dei tavoli esistenti */}
            <table className="w-full table-auto min-w-max mt-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 font-bold">Nome Tavolo</th>
                  <th className="p-2 font-bold">Numero Tavolo</th>
                  <th className="p-2 font-bold">Posti</th>
                  <th className="p-2 font-bold">Disponibile Da</th>
                  <th className="p-2 font-bold">Disponibile Fino</th>
                </tr>
              </thead>
              <tbody>
                {tables.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4">
                      Nessun tavolo disponibile
                    </td>
                  </tr>
                ) : (
                  tables.map((table) => (
                    <tr key={table.id} className="bg-white border-b">
                      <td className="p-2">{table.nome}</td>
                      <td className="p-2">{table.numero}</td>
                      <td className="p-2">{table.posti}</td>
                      <td className="p-2">{table.disponibileDa}</td>
                      <td className="p-2">{table.disponibileFino}</td>
                      <td className="p-2">
                        <button
                          onClick={() => {/* Logica per modificare il tavolo */}}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Modifica
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
