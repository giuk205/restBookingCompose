import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { connectionprefix, PageForm } from '../globals';
import { IconExit } from '../components/Icons';

const times = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00'
];

export default function BookingCalendar({ maxGuests = 10, message = "Ciao", setActiveForm, prevForm, setPrevForm, idUser }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [time, setTime] = useState(times[0]);
  const [note, setNote] = useState(""); // Stato per le richieste particolari
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState([]);

  const modalRefBook = useRef(null);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const formattedMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
        const response = await fetch(`${connectionprefix}/booked?month=${formattedMonth}`, { method: "GET", credentials: "include" });

        if (response.ok) {
          const data = await response.json();
          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

          const updatedCalendar = Array.from({ length: daysInMonth }, (_, i) => {
            const day = String(i + 1).padStart(2, '0');
            const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${day}`;
            // *************************************************************
            // *************************************************************
            // Elabora dati ricevuti dal BE per compilare i dati del giorno
            // *************************************************************
            // *************************************************************
            /*  find: gestisce solo il primo elemento che soddisfa la condizione
            const booking = data.bookings.find(res => res.when.startsWith(fullDate));
            return {
              date: fullDate,
              available: !booking,
              bookedByUser: booking && booking.booker === idUser
            };*/
            //  filter: considera tutte le prenotazioni di un determinato giorno
            const bookingsForDay = data.bookings.filter(res => res.when.startsWith(fullDate));
            const isAvailable = bookingsForDay.length === 0;
            const isBookedByUser = bookingsForDay.some(booking => booking.booker === idUser);

            return {
              date: fullDate,
              available: isAvailable,
              bookedByUser: isBookedByUser
            };
            // *************************************************************
            // *************************************************************
            // *************************************************************

          });

          setCalendarData(updatedCalendar);
        }
      } catch (error) {
        console.error("Errore di connessione: " + error);
      }
    }
    fetchReservations();
  }, [currentMonth, currentYear, idUser]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear(y => y - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear(y => y + 1);
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentYear, currentMonth, 1).getDay();
  };

  const renderDays = () => {
    const firstDay = getFirstDayOfMonth();
    const daysArray = new Array(firstDay).fill(null).concat(calendarData);

    return daysArray.map((day, index) => {
      if (!day) return <div key={index} className="w-10 h-10"></div>;
      
      let classes = "w-10 h-10 flex items-center justify-center border rounded-lg cursor-pointer";
      if (new Date(day.date) < new Date()) {
        classes += " bg-gray-300 text-gray-500";
      } else if (day.bookedByUser) {
        classes += " bg-green-200 border-green-600 text-green-600";
      } else if (!day.available) {
        classes += " border-red-600 text-red-600";
      } else {
        classes += " border-green-600 text-green-600 hover:bg-gray-200";
      }

      return (
        <div key={day.date} className={classes} onClick={() => (day.available || day.bookedByUser) && setSelectedDate(day.date)}>
          {new Date(day.date).getDate()}
        </div>
      );
    });
  };

  return (
    <div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center m-0"
         onClick={(e) => {if (modalRefBook.current && !modalRefBook.current.contains(e.target)) { setActiveForm(prevForm); setPrevForm(PageForm.HOME);}}}
    >
    {/* Contenitore principale con margine superiore */}
    <div className="p-5 bg-white shadow-2xl rounded-2xl w-full max-w-md mt-20"  ref={modalRefBook} >
        {/* Sezione superiore: Logo e Titolo */}
          <div className="text-center mb-6">
          <img src="/logo11.png" alt="Logo" className="mx-auto w-32 mb-2" />
          <h2 className="text-2xl font-bold flex items-center justify-between">
            <div className="cursor-pointer transition-all duration-200  hover:bg-green-500 rounded-sm"
              onClick={() => {setActiveForm(prevForm);setPrevForm(PageForm.HOME)} }
            >
              <IconExit />
            </div>
            <div> {/* Contenitore per il testo */}
              Prenota un Tavolo
            </div>
            <div className="w-12"></div> {/* Spazio vuoto a destra per bilanciare */}
          </h2>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={handlePrevMonth}
                className="text-2xl p-2 rounded-full hover:bg-gray-200"
              >
                &#9664;
              </button>
              <h3 className="text-lg font-semibold text-center">
                {new Date(currentYear, currentMonth).toLocaleString('default', {
                  month: 'long',
                })}{' '}
                {currentYear}
              </h3>
              <button
                onClick={handleNextMonth}
                className="text-2xl p-2 rounded-full hover:bg-gray-200"
              >
                &#9654;
              </button>
            </div>
            <div className="border border-gray-300 p-4 rounded-lg">
              <div className="grid grid-cols-7 gap-2 text-center">
                {renderDays()}
              </div>
            </div>
          </div>

          {/* Input per il numero di persone */}
          <div className="mb-2">
            <label className="block text-gray-700 font-bold mb-1">Persone</label>
            <input
              type="number"
              min="1"
              max={maxGuests}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="border rounded-lg p-2 w-full outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Selezione orario */}
          <div className="mb-2">
            <label className="block text-gray-700 font-bold mb-1">Orario</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border rounded-lg p-2 w-full outline-none focus:ring-2 focus:ring-blue-400"
            >
              {times.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Area di testo per richieste particolari */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-1">Richieste particolari</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border rounded-lg p-1 w-full h-10 resize-none outline-none focus:ring-2 focus:ring-blue-400 overflow-y-auto"
              placeholder="Inserisci eventuali richieste..."
            />
          </div>

          {/* Pulsante di prenotazione */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Prenota
          </button>

          {/* Messaggio opzionale */}
          {message && (
            <p className="text-sm text-gray-600 text-center mt-2">{message}</p>
          )}
        </div>
      </div>
    );
}   

BookingCalendar.propTypes = {
  maxGuests: PropTypes.number,
  message: PropTypes.string,
  setActiveForm: PropTypes.func.isRequired,
  prevForm: PropTypes.oneOf(Object.values(PageForm)),
  setPrevForm: PropTypes.func.isRequired,
  idUser: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
};
