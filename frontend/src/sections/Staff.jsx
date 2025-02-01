import { useEffect, useState } from "react";
import { connectionprefix } from "../globals";

export default function Staff() {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch(`${connectionprefix}/booked`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          // Estrarre solo i dati necessari da `bookings`
          const formattedData = data.bookings.map((res) => {
            const [date, time] = res.when.split("T"); // Divide la data dall'orario
            return {
              id: res.idReservation,
              guests: res.guests,
              time: time.substring(0, 5), // Prende solo HH:MM
              date,
              tableNumber: res.assignedTable,
              status: res.bookStatus,
              note: res.note || "Nessuna nota",
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
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-lg mt-16">
      <h2 className="text-2xl font-bold text-center">Prenotazioni</h2>

      {message && <p className="text-center mt-4 text-red-500">{message}</p>}

      <div className="mt-4 border rounded-lg p-4">
        {loading ? (
          <p className="text-center text-gray-500">Caricamento prenotazioni...</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 font-bold">ID Prenotazione</th>
                <th className="p-2 font-bold">N. Persone</th>
                <th className="p-2 font-bold">Orario</th>
                <th className="p-2 font-bold">Data</th>
                <th className="p-2 font-bold">N. Tavolo</th>
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
                reservations.map((res) => (
                  <tr key={res.id} className="bg-white border-b">
                    <td className="p-2">{res.id}</td>
                    <td className="p-2">{res.guests}</td>
                    <td className="p-2">{res.time}</td>
                    <td className="p-2">{res.date}</td>
                    <td className="p-2">{res.tableNumber}</td>
                    <td className="p-2">{res.status}</td>
                    <td className="p-2">{res.note}</td>
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
