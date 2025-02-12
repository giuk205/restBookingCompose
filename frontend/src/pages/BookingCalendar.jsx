import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { connectionprefix, PageForm } from '../globals';
import { IconExit } from '../components/Icons';
import { BookingModal } from '../components/BookingModal';

const times = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00'
];

export default function BookingCalendar({ className, maxGuests = 10,  activeForm, setActiveForm, prevForm, setPrevForm, idUser, actionOnUser }) {
  const [modeModal, setModeModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrenotazione, setSelectedPrenotazione] = useState(null);

  const [bookUser, setBookUser] = useState(null);
  

  const [message, setMessage] = useState(`Imposta le persone, l'orario e seleziona il giorno`);
  const [selectedDate, setSelectedDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [guests, setGuests] = useState(1);
  const [time, setTime] = useState(times[0]);
  const [note, setNote] = useState(""); // Stato per le richieste particolari
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState([]);
  const [data, setData] = useState(null);


  const modalRefBook = useRef(null);
  const assignedTable = useRef(null);

  useEffect(() => {
    if ( actionOnUser===null ){
      setBookUser(idUser);
    }
    else{
      setBookUser(actionOnUser);
    }
  }, [idUser, actionOnUser]);
  

  useEffect(() => {
    async function fetchReservations() {
      try {
        const formattedMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
        const response = await fetch(`${connectionprefix}/booked?month=${formattedMonth}`, { method: "GET", credentials: "include" });

        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Errore di connessione: " + error);
      }
    }
    if (activeForm === PageForm.BOOKING && !isModalOpen) {
      fetchReservations();
    }
  }, [currentMonth, currentYear, activeForm, isModalOpen]);
    

  // Compila array con info relative a ogni giorno
  // input:
  // -- bookUser                utente se ha effettuato il login
  // -- time                    orario desiderato per la prenotazione
  // -- guests                  numero ospiti
  //
  // array di output updateCalendar (messa in setCalendarData):
  // -- date: fullDate          giorno in analisi, key del campo
  // -- available: isAvailable  vero se prenotabile
  // -- mine: mine : null       json array con prenotazioni dell'utente
  useEffect(() => {
    if (!data) return;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const booktimeHour = parseInt(time.split(':')[0], 10);
    const isLunch = booktimeHour < 15;

    const updatedCalendar = Array.from({ length: daysInMonth }, (_, i) => {
        const day = String(i + 1).padStart(2, '0');
        const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${day}`;
        
        const bookingsForDay = data.bookings.filter(res => res.when.startsWith(fullDate));
        
        const availableTables = data.tables.filter(table => {
            const availableFrom = new Date(table.availableFrom);
            const availableUntil = table.availableUntil ? new Date(table.availableUntil) : null;
            const currentDate = new Date(fullDate);
            return currentDate >= availableFrom && (!availableUntil || currentDate <= availableUntil);
        });

        const freeTables = availableTables.filter(table => {
            if (table.seatNumber < guests) return false;
            const lunchBooked = bookingsForDay.some(booking => 
                booking.assignedTable === table.idTable && 
                (booking.bookStatus === 'PENDENT' || booking.bookStatus === 'ACCEPTED') &&
                new Date(booking.when).getHours() < 15
            );
            const dinnerBooked = bookingsForDay.some(booking => 
                booking.assignedTable === table.idTable && 
                (booking.bookStatus === 'PENDENT' || booking.bookStatus === 'ACCEPTED') &&
                new Date(booking.when).getHours() >= 15
            );
            
            return isLunch ? !lunchBooked : !dinnerBooked;
        });

        const availableTable = freeTables
          .filter(table => table.seatNumber >= guests)  // Filtra solo quelli che possono ospitare i guests
          .sort((a, b) => a.seatNumber - b.seatNumber) // Ordina dal più piccolo al più grande
          [0]; // Prendi il primo (quello con meno posti disponibili ma sufficiente)
      
        const idTable = availableTable ? availableTable.idTable : null;
        
        const isAvailable = idTable !== null && new Date(fullDate) >= new Date();
      
        const mine = bookUser ? bookingsForDay
            .filter(booking => booking.booker === bookUser)
            .map(({ bookStatus, bookedFrom, created, guests, idReservation, note, updated, when }) => {
              const whenDate = new Date(when); // Crea un oggetto Date dalla stringa 'when'
              const formattedTime = whenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formatta l'ora
          
              return {
                bookStatus,
                bookedFrom,
                created,
                guests,
                idReservation,
                note,
                updated,
                when,
                formattedTime: formattedTime, 
              };
            }) : [];

        return {
            date: fullDate,
            available: isAvailable,
            idTable: idTable,
            mine: mine.length > 0 ? mine : null
        };
    });

    setCalendarData(updatedCalendar);
  }, [data, time, bookUser, guests]);


  const  handlePrenotaClick = async () =>{
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));

    const fetchPromise = await fetch(connectionprefix+'/book', {
      method: 'POST',
      credentials: 'include', //send cookie also on cross-origin fetch
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        when: `${selectedDate} ${time}:00`,     //formato "2025-02-15 19:30:00"
        guests: guests,
        idUser: bookUser,
        note: note,
        assignedTable: assignedTable.current,
        }),
      });
  
    const [response] = await Promise.all([fetchPromise, timeoutPromise]);

    if (response.ok) {
      const result = await response.json();
      setSelectedDate(null);
      setValidDate(false);
      setPrevForm(FormData.BOOKING);
      setSelectedPrenotazione(result); //info prenotazione e cancella
      setModeModal(true);    //per modal inserzione prenotazione
      setIsModalOpen(true);

    }

  }

  const handleSelectDay = (day) =>{
    console.log("Selezionato:",day);
    if (day.date === selectedDate){
      setSelectedDate(null);
      setValidDate(false);
      setMessage(`Imposta le persone, l'orario e seleziona il giorno`);
      assignedTable.current = null;
    }
    else{
      setSelectedDate(day.date);
      if (day.available === true){
        setValidDate(true);
        assignedTable.current = day.idTable;

      }
      else{
        setValidDate(false);
      }

      if (day.mine && day.mine.length > 0) { // Verifica che day.mine esista e non sia vuoto
        const prenotazioni = day.mine.map(prenotazione => {
            const isFutureBooking = new Date(prenotazione.when) >= new Date();

            return (
              <div className="flex items-center gap-2" key={prenotazione.idReservation}> {/* Usa flex con gap e allineamento */}
                {isFutureBooking && (
                  <button 
                    onClick={() => handleDeleteClick(prenotazione)}
                    className="p-1 rounded-md hover:bg-gray-200"
                  >
                    <IconExit className="cursor-pointer" />
                  </button>
                )}
                <div className="flex-1">
                    Prenotato per {prenotazione.guests} persone alle {prenotazione.formattedTime} ({prenotazione.bookStatus})
                </div>
              </div>
            );
        });

        setMessage(<div>{prenotazioni}</div>); // Imposta il messaggio con un elemento JSX che contiene le prenotazioni
      } else {
        setMessage(`Imposta le persone, l'orario e seleziona il giorno`);
      }
    }
  }

  // Funzione per gestire il click sull'icona della prenotazione vecchia
  const handleDeleteClick = (prenotazione) => {
      //console.log("Prenotazione selezionata per la cancellazione:", prenotazione, );
      setSelectedDate(null);
      setPrevForm(FormData.BOOKING);
      console.log("BookingCalendar DeleteBook click activeForm:"+activeForm);
      console.log("BookingCalendar DeleteBook click prevForm(messo BOOKING):"+prevForm);

      setSelectedPrenotazione(prenotazione); //info prenotazione e cancella
      setModeModal(false); //per modal cancellazione
      setIsModalOpen(true);

  };



  const handlePrevMonth = () => {
    setMessage(`Imposta le persone, l'orario e seleziona il giorno`);
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear(y => y - 1);
  };

  const handleNextMonth = () => {
    setMessage(`Imposta le persone, l'orario e seleziona il giorno`);
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
      
      let classes = "w-10 h-10 flex items-center justify-center border rounded-lg";
      let text = '';
      if (new Date(day.date) < new Date()) {
        classes += " bg-gray-300";
         text = " text-gray-500";
      } else if (!day.available) {
        classes += " border-red-600";
        text = " text-red-600";
      } else {
        classes += " border-green-600 hover:bg-gray-200";
        text = " text-green-600";
      }
      const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
      const dayDateObj = day && day.date ? new Date(day.date) : null;
      if (selectedDateObj && dayDateObj && selectedDateObj.getTime() === dayDateObj.getTime()) { // Confronto per valore
        if (new Date(day.date) >= new Date()) {
          classes += " bg-green-400";
          text = " text-white";
        }
      }
      else if (day.mine) {
        classes += " bg-green-200";
      }
      classes += text;
      if (day.available || day.mine){
        classes += " cursor-pointer";
      }
      return (
        <div key={day.date} className={classes} onClick={() => (day.available || day.mine) && handleSelectDay(day) }>
          {new Date(day.date).getDate()}
        </div>
      );
    });
  };

  return (
    <div className={`h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center m-0 ${className}`}
      onMouseDown={(e) => {if (modalRefBook.current && !modalRefBook.current.contains(e.target)) {
           setMessage(`Imposta le persone, l'orario e seleziona il giorno`);
           setActiveForm(prevForm); 
           setPrevForm(PageForm.HOME);}}}
    >
      <div>
        <BookingModal 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          prenotazione={selectedPrenotazione} 
          modeModal={modeModal}
          actionOnUser={actionOnUser}
        />
      </div>

      {/* Contenitore principale con margine superiore */}
      <div className="p-5 bg-white shadow-2xl rounded-2xl w-full max-w-md mt-20" ref={modalRefBook}>
        <div className="text-center mb-6">
          <img src="/logo11.png" alt="Logo" className="mx-auto w-32 mb-2" />
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center relative w-full">
            {/* Testo centrato */}
            <div className="absolute left-0 right-0 text-center">
              Prenota un Tavolo
              {actionOnUser && ( // Se actionOnUser non è null, rendi questo blocco
                <span> per userId {actionOnUser}</span>
              )}
            </div>
            {/* Icona X posizionata a destra nell'angolo */}
            <div 
              className="absolute top-[-150px] right-[-15px] p-2 cursor-pointer transition-all duration-200 hover:bg-green-500 rounded-sm"
              onClick={() => { setActiveForm(prevForm); setPrevForm(PageForm.HOME) }}
            >
              <IconExit />
            </div>
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
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-default disabled:opacity-50" // Stili per il bottone disabilitato
          disabled={!validDate}
          onClick={()=>{
            if (bookUser === null){
              setPrevForm(PageForm.BOOKING);
              setActiveForm(PageForm.LOGIN); 
            }
            else{ handlePrenotaClick();}
          }}
        >
          Prenota
        </button>

        {/* Messaggio opzionale */}
        {message && (
          <div className="text-sm text-gray-600 text-center mt-2">{message}</div>
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
  bookUser: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  className: PropTypes.string,
};
