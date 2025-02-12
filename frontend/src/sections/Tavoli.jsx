import { useEffect, useState } from "react";
import { connectionprefix } from "../globals";

export default function Tavoli() {
  const [tables, setTables] = useState([]);

  const [selected, setSelected] = useState(null);


  const [newTable, setNewTable] = useState({
    idTable:null,
    nome: "",
    posti: "",
    disponibileDa: "",
    disponibileFino: "",
  });
  const [message, setMessage] = useState("Seleziona un tavolo da modificare o inserisci dati per aggiungerne uno nuovo.");
  const [loading, setLoading] = useState(true);

  const [enAddTable, setEnAddTable] = useState(false);
  const [enModTable, setEnModTable] = useState(false);
  const [refreshTables, setRefreshTables] = useState(true);

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
          const formattedData = Object.fromEntries(
            data.map((table) => [
              table.idTable,
              {
                id: table.idTable,
                nome: table.tableName || `Tavolo ${table.idTable}`, // Nome del tavolo (default se mancante)
                posti: table.seatNumber, // Numero di posti
                disponibileDa: new Date(table.availableFrom).toLocaleDateString('it-IT', { // 'it-IT' per il formato italiano
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric' // Usa 'numeric' per l'anno a 4 cifre
                }), //.split("T")[1].substring(0, 5), // Solo HH:MM
                disponibileFino: table.availableUntil
                  ? new Date(table.availableUntil).toLocaleDateString('it-IT', { // 'it-IT' per il formato italiano
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric' // Usa 'numeric' per l'anno a 4 cifre
                })
                  : "N/D", // Gestisce i valori null
              }
            ])
          );

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

    fetchTable();
  }, [refreshTables]);

  const handleChange = (e) => {
    setNewTable({
      ...newTable,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {   //abilita disabilita tasti
    const fieldsToCheck = ['nome', 'posti', 'disponibileDa']; // Array con i nomi dei campi da controllare
    const allFieldsFilled = fieldsToCheck.every(field => newTable[field] !== "");
    if (selected !== null){
      setEnModTable(allFieldsFilled);
      setEnAddTable(false);  
    }
    else{
      setEnAddTable(allFieldsFilled);
      setEnModTable(false);  
    }
  }, [newTable]);

  const handleAddTable = async () => {
    const tableData = {
      tableName: newTable.nome,
      seatNumber: newTable.posti,
      availableFrom: newTable.disponibileDa + " 00:00.00", // Aggiunto i secondi
      ...(newTable.disponibileFino !== "" && { availableUntil: newTable.disponibileFino + " 00:00.00" }), 
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
        setNewTable({ ...newTable, nome: "", });
        // Aggiungi il nuovo tavolo alla lista
        setRefreshTables(!refreshTables);
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
      idTable:  newTable.idTable,
      tableName: newTable.nome,
      seatNumber: newTable.posti,
      availableFrom: newTable.disponibileDa + " 00:00.00", // Aggiunto i secondi
      ...(newTable.disponibileFino !== "" && { availableUntil: newTable.disponibileFino + " 00:00.00" }), 
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
        setNewTable({ ...newTable, nome: "", });
        setSelected(null);
        // Aggiungi il nuovo tavolo alla lista
        setRefreshTables(!refreshTables);
        setMessage("Tavolo modificato con successo!");
      } else {
        const errorData = await response.json();
        setMessage(`Errore: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("Errore di connessione: " + error.message);
    }
  };

  const handleSelectTableForEdit = (id) => {
    const table = tables[id]; // Accesso diretto alla mappa
  
    if (table) {
      if (selected && selected == id){
        setSelected(null);
        setNewTable({ ...newTable, id: null });
        setNewTable({ ...newTable, nome: "", });
        setMessage("Seleziona un tavolo da modificare o inserisci dati per aggiungerne uno nuovo");
        return;
      }
      setSelected(id);
      setNewTable({
        idTable: id,
        nome: table.nome,
        posti: table.posti,
        disponibileDa: formatDateForInput(table.disponibileDa),
        disponibileFino: formatDateForInput(table.disponibileFino),
      });
      setMessage("Modificare i campi e salva le modifiche con 'Modifica Tavolo'");

    }
  };
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""; // Se la data è null o vuota, restituisce ""
  
    // Estrarre solo la parte "dd/MM/yy" eliminando l'orario
    const parts = dateString.split("/"); // ["08", "02", "25"]
    if (parts.length !== 3) return ""; // Se il formato non è corretto, restituisce ""
  
    const day = parts[0].padStart(2, "0"); // Garantisce due cifre per il giorno
    const month = parts[1].padStart(2, "0"); // Garantisce due cifre per il mese
    const year = parts[2]; // Converti "25" in "2025"
  
    return `${year}-${month}-${day}`; // Restituisce il formato "YYYY-MM-DD"
  };
  

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-lg mt-16">
      <h2 className="text-2xl font-bold text-center">Gestione Tavoli</h2>

      <div className="mt-4 border rounded-lg p-">
        {loading ? (
          <p className="text-center text-gray-500">Caricamento tavoli...</p>
        ) : (
          <div className="space-y-4">
            {/* Aggiungi nuova riga per il nuovo tavolo */}
            <div className="p-4">
              <div className="flex justify-between items-center pb-4">
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

              <div className="flex justify-between items-center pb-4">
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

              <div className="flex justify-between items-center pb-4">
                <label htmlFor="disponibileDa" className="w-1/4 text-left">
                  Disponibile Dal
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

              <div className="flex justify-between items-center pb-4">
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

              <div className="mt-4 flex justify-center items-center pb-4">
                <div className="flex space-x-4"> {/* Contenitore per i bottoni */}
                  <button
                    onClick={handleEditTable}
                    className="bg-green-500 text-white px-2 py-2 rounded shadow-md shadow-emerald-950 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!enModTable} 
                  >
                    Modifica Tavolo
                  </button>
                  <div className="w-16"></div> {/* Spazio vuoto */}
                  <button
                    onClick={handleAddTable}
                    className="bg-green-500 text-white px-2 py-2 rounded shadow-md shadow-emerald-950 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!enAddTable} 
                  >
                    Aggiungi Tavolo
                  </button>
                </div>
              </div>
            </div>
            <p className="text-red-500 text-xs italic pl-4">{message}</p>
            {/* Tabella dei tavoli esistenti */}
            <div className="overflow-x-auto">
            <table className="border border-gray-400 rounded-lg overflow-hidden w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="font-bold border border-gray-300 text-left pl-1">id</th>
                    <th className="font-bold border border-gray-300 text-left pl-1">Nome Tavolo</th>
                    <th className="font-bold border border-gray-300 text-left pl-1">Posti</th>
                    <th className="font-bold border border-gray-300 text-left pl-1">Disponibile Dal</th>
                    <th className="font-bold border border-gray-300 text-left pl-1">Disponibile Fino</th>
  
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(tables).length === 0 ? ( // Controlla se ci sono tavoli
                    <tr>
                      <td colSpan="5" className="text-center p-4 border border-gray-500 rounded-lg pl-1">
                        Nessun tavolo disponibile
                      </td>
                    </tr>
                  ) : (
                    Object.values(tables).map((table, index) => { // Itera sui valori dell'oggetto
                      const isEvenRow = index % 2 === 0;
                      let rowBackground = isEvenRow ? "bg-white" : "bg-neutral-300";
                      if (table.id === selected){
                        rowBackground = "bg-green-200"
                      }
                      return (
                        <tr key={table.id} className={`bg withe border-gray-500 ${rowBackground} cursor-pointer`}
                          onClick={() => handleSelectTableForEdit(table.id)}
                        >
                          <td className="border border-gray-500 pl-1">{table.id}</td>
                          <td className="border border-gray-500 pl-1">{table.nome}</td>
                          <td className="border border-gray-500 pl-1">{table.posti}</td>
                          <td className="border border-gray-500 pl-1">{table.disponibileDa}</td>
                          <td className="border border-gray-500 pl-1">{table.disponibileFino}</td>
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
              
  
