import PropTypes from 'prop-types';
import * as Dialog from "@radix-ui/react-dialog";

export function DeleteBooking({ isDeleteModalOpen, setIsDeleteModalOpen, prenotazione }) {

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

  return (
    <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
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
              Vuoi cancellare la prenotazione?
            </Dialog.Title>

            {prenotazione && (
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-gray-500">
                <p><strong>ID:</strong> {prenotazione.idReservation}</p>
                <p><strong>Data:</strong> {formatDateTime(prenotazione.when)}</p>
                <p><strong>Ospiti:</strong> {prenotazione.guests}</p>
                <p><strong>Note:</strong> {prenotazione.note || "Nessuna nota"}</p>
                <p><strong>Creata il:</strong> {formatDateTime(prenotazione.created)}</p>
                <p className="mt-2">Ci dispiace tu abbia cambiato idea, speriamo di rivederti presto.</p>
              </Dialog.Description>
            )}
            <div className="items-center gap-2 mt-3 text-sm sm:flex">
              <Dialog.Close asChild>
                <button className="w-full mt-2 p-2.5 flex-1 text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2">
                  Cancella
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                  aria-label="Close"
                >
                  Mantieni
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

DeleteBooking.propTypes = {
  isDeleteModalOpen: PropTypes.bool.isRequired, // Stato di apertura del modal di eliminazione
  setIsDeleteModalOpen: PropTypes.func.isRequired, // Funzione per modificare lo stato del modal di eliminazione
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