export default function ChiSiamo() {
    return (
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between py-12">
            {/* Immagine sinistra */}
            <div 
                className="w-full md:w-1/3 h-64 md:h-96 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/solipsista.jpg')" }}
            ></div>
            
            {/* Testo centrale */}
            <div className="w-full md:w-1/3 text-center px-6 flex items-center">
                <p className="text-lg leading-relaxed text-gray-700">
                    Dal 1996, il Solipsista è stato un punto di riferimento per gli amanti della pizza. 
                    Nata come piccola pizzeria di quartiere, la nostra passione per la cucina italiana 
                    ci ha spinto a crescere e ad ampliare l’offerta. Oggi, il Solipsista è un ristorante italiano 
                    dove la tradizione incontra l’innovazione, mantenendo intatta l’anima della pizzeria 
                    che ci ha reso famosi. 
                </p>
            </div>
            
            {/* Immagine destra */}
            <div 
                className="w-full md:w-1/3 h-64 md:h-96 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/sfondo.jpg')" }}
            ></div>
        </div>
    );
}
