import PropTypes from 'prop-types';
import * as Dialog from "@radix-ui/react-dialog";
import { connectionprefix, PageForm } from '../globals';

export function BookingModal({ isModalOpen, setIsModalOpen, prenotazione, modeModal, actionOnUser }) {

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const deleteReservation = async (reservationId) => {
    try {
      const response = await fetch(`${connectionprefix}/book?idbook=${reservationId}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Se hai autenticazione
        },
      });
  
      if (!response.ok) {
        throw new Error("Errore nella cancellazione della prenotazione");
      }
  
      console.log("Prenotazione eliminata con successo!");
      return true; // Ritorna true se la cancellazione ha avuto successo
    } catch (error) {
      console.error("Errore:", error.message);
      return false; // Ritorna false se c'è stato un errore
    }
  };
  

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg px-4 py-6">
            <div className=" flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <Dialog.Title className="text-lg font-medium text-gray-800 text-center mt-3">
              {" "}
              {modeModal ? "Prenotazione registrata" : "Vuoi cancellare la prenotazione?"}
            </Dialog.Title>
            <div className='bg-yellow-300'>
              {actionOnUser ? (
                <span>
                  L'utente {actionOnUser} riceverà una email{' '}
                  {modeModal ? 'di conferma' : 'promemoria'}
                </span>
              ) : (
                <span>
                  Riceverai una email {modeModal ? 'di conferma' : 'promemoria'}
                </span>
              )}
            </div>
            {prenotazione && (
              <div className="mt-1 text-sm leading-relaxed text-gray-500">
                <div><strong>ID:</strong> {prenotazione.idReservation}</div>
                <div><strong>Data:</strong> {formatDateTime(prenotazione.when)}</div>
                <div><strong>Ospiti:</strong> {prenotazione.guests}</div>
                <div><strong>Note:</strong> {prenotazione.note || "Nessuna nota"}</div>
                <div><strong>Creata il:</strong> {formatDateTime(prenotazione.created)}</div>
                <p className="mt-2">{modeModal ? "Non vediamo l'ora di condividere la nostra passione per la cucina." : "Ci dispiace tu abbia cambiato idea, speriamo di rivederti presto."}</p>
              </div>
            )}
            <Dialog.Description />
            <div className="items-center gap-2 mt-3 text-sm sm:flex">
              {!modeModal && (
                <button className="w-full mt-2 p-2.5 flex-1 text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2"
                  onClick={async () => {
                    console.log("Eliminazione in corso...");
    
                    const success = await deleteReservation(prenotazione.idReservation);
                    
                    if (success) {
                      setIsModalOpen(false); // Chiudi la modale solo se la DELETE è andata a buon fine
                    }
                  }}>
                  Cancella
                </button>
              )}

              <Dialog.Close asChild>
                <button
                  className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                  aria-label="Close"
                >
                  {modeModal ? "Chiudi" : "Mantieni"}
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

BookingModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired, // Stato di apertura del modal di eliminazione
  setIsModalOpen: PropTypes.func.isRequired, // Funzione per modificare lo stato del modal di eliminazione
  modeModal: PropTypes.bool.isRequired, //false conferma cancellazione
  prenotazione: PropTypes.oneOfType([
    PropTypes.shape({
      idReservation: PropTypes.number.isRequired, // ID della prenotazione, deve essere un numero
      when: PropTypes.string.isRequired, // Data della prenotazione in formato ISO
      guests: PropTypes.number.isRequired, // Numero di ospiti
      note: PropTypes.string, // Nota opzionale
      created: PropTypes.string.isRequired, // Data di creazione in formato ISO
    }),
    PropTypes.oneOf([null]) // Permette null come valore
  ]),
  
  
  
  
};