import { useState, useEffect } from "react";

export default function Pmenu() {
  const [menuData, setMenuData] = useState(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await fetch("/Pmenu.txt");
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error("Errore nel caricamento del menu:", error);
      }
    };

    loadMenu();
  }, []); // <-- Array vuoto = eseguito solo al primo render

  if (!menuData) {
    return <div>Caricamento menu...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-200 px-4">
      <div className="w-full text-center bg-orange-200 p-4 md:p-8 lg:p-16">
        <h1 className="text-4xl lg:text-6xl text-gray-800 font-semibold mt-8">
          {menuData.Titolo}
        </h1>

        {/* Mappa le sezioni del menu */}
        {menuData.Sezioni.map((sezione, index) => (
          <div key={index} className="mt-8">
            <strong className="font-Cormorant+Garamond text-2xl lg:text-4xl block text-center">
              {sezione.Sottotitolo}
            </strong>
            {sezione.Piatti.map((piatto, piattoIndex) => (
              <div key={piattoIndex} className="mt-2">
                <span className="font-semibold text-xl lg:text-2xl">{piatto.Nome}</span> 
                <span className="text-xl lg:text-2xl block">{piatto.Descrizione}.</span> 
                <div className="text-gray-500 text-lg lg:text-xl ">{piatto.Prezzo}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
