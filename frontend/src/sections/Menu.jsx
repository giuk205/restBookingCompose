import { useState, useEffect } from "react";

export default function Menu() {
  const [menuData, setMenuData] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 700 && window.innerHeight > 800);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 700 && window.innerHeight > 800);
    };

    window.addEventListener("resize", handleResize);

    // Carica il menu dal file JSON
    const loadMenu = async () => {
      const response = await fetch("/menu.txt");  // Assicurati che il file menu.txt sia disponibile nella tua cartella pubblica
      const data = await response.json();
      setMenuData(data);
    };

    loadMenu();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!menuData) {
    return <div>Caricamento menu...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-200 px-4">
        <div className="w-full text-center bg-orange-200 p-4 md:p-8 lg:p-16">
          <h1 className="text-2xl lg:text-4xl text-gray-800 italic font-semibold mt-8">
            {menuData.Titolo}
          </h1>
  
          {/* Mappa le sezioni del menu */}
          {menuData.Sezioni.map((sezione, index) => (
            <div key={index} className="mt-8">
              <strong className="text-2xl lg:text-4xl block text-center">
                {sezione.Sottotitolo}
              </strong>
              {sezione.Piatti.map((piatto, piattoIndex) => (
                <div key={piattoIndex} className="mt-2">
                <span className="font-semibold text-xl lg:text-2xl block">{piatto.Nome}</span>
                <span className="text-xl lg:text-2xl block">{piatto.Descrizione}.</span>
                <div className="text-gray-500 text-lg lg:text-xl">{piatto.Prezzo}</div>

                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
  );
}
