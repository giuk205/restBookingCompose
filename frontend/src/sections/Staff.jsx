import { useEffect, useState } from "react";
import { connectionprefix, UserType } from "../globals";

import { IconAlarmClock, IconSquareCheck, IconSquareX, IconReload, IconEye, IconEyeOff, IconDownFromLine, IconArrowUpDown} from "../components/Icons.jsx"

export default function Staff({userPrivileges}) {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [viewAll, setViewAll] = useState(false);
  const [viewDeleted, setViewDeleted] = useState(false);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    async function fetchReservations() {
      let req = '';

      if (viewAll || viewDeleted) { // Verifica se almeno un parametro è presente
        req += '?'; // Aggiungi il punto interrogativo iniziale
      
        if (viewAll) {
          req += 'viewPast=true';
        }
      
        if (viewDeleted) {
          if (viewAll) { // Aggiungi & solo se viewAll è true
            req += '&';
          }
          req += 'viewDeleted=true';
        }
      }
      try {
        const response = await fetch(`${connectionprefix}/booked${req}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          // Estrarre solo i dati necessari da `bookings`
          const formattedData = data.bookings.map((res) => {
            const [date, time] = res.when.split("T"); // Divide la data dall'orario
            const formattedDate = date.split("-").reverse().join("/");
            return {
              id: res.idReservation,
              when: res.when,
              username: res.username,
              guests: res.guests,
              time: time.substring(0, 5), // Prende solo HH:MM
              date: formattedDate,
              tableNumber: res.assignedTable,
              status: res.bookStatus,
              note: res.note || "",
              from: res.from,
            };
          });

          setReservations(formattedData);
        } else {
          setMessage("Errore nel caricamento delle prenotazioni.");
        }
      } catch (error) {
        setMessage("Errore di connessione: " + error);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, [refresh]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${connectionprefix}/book?idbook=${id}&bookStatus=${newStatus}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        setMessage("Errore nell'aggiornamento dello stato.");
      }
    } catch (error) {
      setMessage("Errore di connessione: " + error);
    }
    setRefresh(!refresh);
  };

  // Funzione di confronto per ordinare le prenotazioni per data e ora
  const compareReservations = (a, b) => {
    const dateA = new Date(a.when);
    const dateB = new Date(b.when);
    return dateA - dateB; // Ordina in ordine crescente (dal più vecchio al più recente)
  };

  const handleAccept = (res) => {
    console.log("Accetta prenotazione:", res.id);
    if (userPrivileges < UserType.STAFF){
      // Logica per gestire l'accettazione
      handleStatusChange(res.id, "ACCEPTED");
    }
  };

  const handleDelete = (res) => {
    if (userPrivileges < UserType.STAFF){
        console.log("Elimina prenotazione:", res.id);
      // Logica per gestire l'eliminazione
      handleStatusChange(res.id, "DELETED");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-lg mt-16">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold text-center flex-1">Prenotazioni</h2>
        
        <button
            className="mr-2 cursor-pointer bg-green-500 text-white px-2 py-2 rounded shadow-md shadow-emerald-950 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={()=>{setViewAll(!viewAll);setRefresh(!refresh)}}     >
          {viewAll ? (<IconArrowUpDown className="w-6 h-6" />) :(<IconDownFromLine className="w-6 h-6" />)}
        </button>
        <button
            className="mr-2 cursor-pointer bg-green-500 text-white px-2 py-2 rounded shadow-md shadow-emerald-950 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={()=>{setViewDeleted(!viewDeleted);setRefresh(!refresh)}}     >
            {viewDeleted ? (<IconEye className="w-6 h-6" />) :(<IconEyeOff className="w-6 h-6" />)}
        </button>
        <button
            className="cursor-pointer bg-green-500 text-white px-2 py-2 rounded shadow-md shadow-emerald-950 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={()=>{setRefresh(!refresh)}}     >
        <IconReload className="w-6 h-6" />
        </button>
      </div>
      {message && <p className="text-center mt-4 text-red-500">{message}</p>}

      <div className="mt-4 border rounded-lg p-0 overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Caricamento prenotazioni...</p>
        ) : (
          <table className="w-full table-auto min-w-max">
            <thead>
              <tr className="bg-gray-200 text-left p-4">
                <th className="p-2 font-bold">id</th>
                <th className="p-2 font-bold">Nome</th>
                <th className="p-2 font-bold">Persone</th>
                <th className="p-2 font-bold">Alle</th>
                <th className="p-2 font-bold">Del</th>
                <th className="p-2 font-bold">Tavolo</th>
                <th className="p-2 font-bold">Stato</th>
                <th className="p-2 font-bold">Note</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    Nessuna prenotazione trovata
                  </td>
                </tr>
              ) : (

                reservations.sort(compareReservations).map((res) => {
                
                  const status = res.status; // Ottieni lo stato della prenotazione
                  const isAccepted = status === "ACCEPTED";
                  const isPending = status === "PENDENT";
                  const isDeleted = status === "DELETED";

                  return (
       
                  <tr key={res.id} className="bg-white border-b">
                    <td className="p-2">{res.id}</td>
                    <td className="p-2">{res.username}</td>
                    <td className="p-2">{res.guests}</td>
                    <td className="p-2">{res.time}</td>
                    <td className="p-2">{res.date}</td>
                    <td className="p-2">{res.tableNumber}</td>
                    <td className="p-2 flex">
                      <div className={`${
                          isAccepted
                            ? "bg-green-600 mr-4 text-white"
                            : "cursor-pointer text-gray-400 mr-4"
                          } ${isPending || isDeleted ? "cursor-pointer text-gray-400 mr-4" : ""}`}
                          onClick={() => !isAccepted && handleAccept(res)} // Gestisci il click solo se non è accettata
                      >
                        <IconSquareCheck/> </div>                      
                      <div className={`${
                          isAccepted ? "text-white mr-4 " : ""
                        } ${isPending ? "text-red-500 mr-4" : "text-gray-400 mr-4"} `}
                      >
                        <IconAlarmClock/></div>
                      <div className={`${
                          isDeleted ? "bg-red-500 text-white mr-4" : "cursor-pointer text-gray-400 mr-4"
                        } ${isAccepted ? "cursor-pointer text-gray-400 mr-4" : ""}`}
                        onClick={() => !isDeleted && handleDelete(res)} // Gestisci il click solo se non è eliminata
                      >
                        <IconSquareX/></div>
                    </td>

                    <td className="p-2">{res.note}</td>
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
