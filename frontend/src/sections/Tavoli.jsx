import { useEffect, useState } from "react";
import { connectionprefix } from "../globals";

export default function Tavoli() {
  const [table, setTable] = useState([]);
  const [newTable, setNewTable] = useState({
    nome: "",
    posti: "",
    disponibileDa: "",
    disponibileFino: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTable() {
      try {
        const response = await fetch(`${connectionprefix}/table`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          // Estrarre e formattare i dati dei tavoli
          const formattedData = data.map((table) => ({
            id: table.idTable,
            nome: table.tableName || `Tavolo ${table.idTable}`, // Nome del tavolo (default se mancante)
            posti: table.seatNumber, // Numero di posti
            disponibileDa: table.availableFrom.split("T")[1].substring(0, 5), // Solo HH:MM
            disponibileFino: table.availableUntil
              ? table.availableUntil.split("T")[1].substring(0, 5)
              : "N/D", // Gestisce i valori null
          }));

          setTable(formattedData);
        } else {
          setMessage("Errore nel caricamento dei tavoli.");
        }
      } catch (error) {
        setMessage("Errore di connessione: " + error);
      } finally {
        setLoading(false);
      }
    }

    fetchTable();
  }, []);

  const handleChange = (e) => {
    setNewTable({
      ...newTable,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTable = async () => {
    const tableData = {
      tableName: newTable.nome,
      seatNumber: newTable.posti,
      availableFrom: newTable.disponibileDa +" 00:00:00",
      //to do:availableUntil: newTable.disponibileFino,
    };

    try {
      const response = await fetch(`${connectionprefix}/table`, {
        method: "POST", // Metodo POST per la creazione
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tableData),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        // Aggiungi il nuovo tavolo alla lista
        setTable((prevTable) => [
          ...prevTable,
          {
            id: result.idTable,
            nome: result.tableName,
            posti: result.seatNumber,
            disponibileDa: new Date(table.availableFrom).toLocaleString(), // Formatta la data in modo completo
            disponibileFino: table.availableUntil 
            ? new Date(table.availableUntil).toLocaleString()
          : "N/D", // Gestisce i valori null
          },
        ]);
        setMessage("Tavolo aggiunto con successo!");
      } else {
        const errorData = await response.json();
        setMessage(`Errore: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("Errore di connessione: " + error.message);
    }
  };

  const handleEditTable = async () => {
    const tableData = {
      tableName: newTable.nome,
      seatNumber: newTable.posti,
      availableFrom: newTable.disponibileDa,
      availableUntil: newTable.disponibileFino,
    };

    try {
      const response = await fetch(`<span class="math-inline">\{connectionprefix\}/table/</span>{newTable.id}`, {
        method: "PUT", // Metodo PUT per la modifica
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tableData),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        // Aggiorna il tavolo modificato nella lista
        setTable((prevTable) =>
          prevTable.map((table) => (table.id === result.idTable ? result : table))
        );
        setMessage("Tavolo modificato con successo!");
      } else {
        const errorData = await response.json();
        setMessage(`Errore: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("Errore di connessione: " + error.message);
    }
  };

  const handleSelectTableForEdit = (table) => {
    setNewTable({
      id: table.id,
      nome: table.nome,
      posti: table.posti,
      disponibileDa: table.disponibileDa,
      disponibileFino: table.disponibileFino,
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
              <label htmlFor="nome" className="w-1/4 text-left">
                Nome Tavolo
              </label>
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
              <label htmlFor="posti" className="w-1/4 text-left">
                Posti
              </label>
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
              <label htmlFor="disponibileDa" className="w-1/4 text-left">
                Disponibile Da
              </label>
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
              <label htmlFor="disponibileFino" className="w-1/4 text-left">
                Disponibile Fino
              </label>
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
            <div className="overflow-x-auto">
            <table className="border border-gray-400 rounded-lg overflow-hidden w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="font-bold border border-gray-300 text-left">Nome Tavolo</th>
                    <th className="font-bold border border-gray-300 text-left">Posti</th>
                    <th className="font-bold border border-gray-300 text-left">Disponibile Da</th>
                    <th className="font-bold border border-gray-300 text-left">Disponibile Fino</th>
                    <th className="font-bold border border-gray-300 text-left">Azione</th>
                  </tr>
                </thead>
                <tbody>
                  {table.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-4 border border-gray-500 rounded-lg">
                        Nessun tavolo disponibile
                      </td>
                    </tr>
                  ) : (
                    table.map((table, index) => {
                      const isEvenRow = index % 2 === 0;
                      const rowBackground = isEvenRow ? "bg-white" : "bg-neutral-300";
                      return (
                        <tr key={table.id} className={`bg withe border-gray-500 ${rowBackground}`}>
                          <td className="border border-gray-500">{table.nome}</td>
                          <td className="border border-gray-500">{table.posti}</td>
                          <td className="border border-gray-500">{table.disponibileDa}</td>
                          <td className="border border-gray-500">{table.disponibileFino}</td>
                          <td className="border border-gray-500">
                            <button
                              onClick={() => handleSelectTableForEdit(table)}
                              className="bg-blue-500 text-white py-1 rounded"
                            >
                              Modifica
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
              
  
