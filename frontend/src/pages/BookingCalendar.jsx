import PropTypes from 'prop-types';
import { useState } from 'react';

const times = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00'
];

export default function BookingCalendar({ maxGuests = 10, message = "Ciao" }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [time, setTime] = useState(times[0]);
    const [note, setNote] = useState(""); // Stato per le richieste particolari
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const handlePrevMonth = () => {
      setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
      if (currentMonth === 0) setCurrentYear(currentYear - 1);
    };
  
    const handleNextMonth = () => {
      setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
      if (currentMonth === 11) setCurrentYear(currentYear + 1);
    };

    const renderDays = () => {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
      const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
      
      const days = [];
      
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
      }
    
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(
          <div
            key={day}
            className={`w-10 h-10 flex items-center justify-center border rounded-lg cursor-pointer hover:bg-gray-200 ${
              selectedDate === day ? 'bg-green-400 text-white' : ''
            }`}
            onClick={() => setSelectedDate(day)}
          >
            {day}
          </div>
        );
      }
    
      while (days.length < totalCells) {
        days.push(<div key={`empty-after-${days.length}`} className="w-10 h-10"></div>);
      }
    
      return days;
    };
  
    return (
      <div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center m-0">
        <div className="p-5 bg-white shadow-2xl rounded-2xl w-full max-w-md mt-20">
          <div className="text-center mb-6">
            <img src="/logo11.png" alt="Logo" className="mx-auto w-32 mb-2" />
            <h2 className="text-2xl font-bold">Prenota un Tavolo</h2>
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
};
