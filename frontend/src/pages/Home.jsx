import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { UserType } from  '../globals';
import Admin from '../sections/Admin'
import Staff from '../sections/Staff';
import Tavoli from '../sections/Tavoli';

const Home = ({ userPrivileges, className, homeRef}) => {

  useEffect(() => { // Per ripristina la posizione dello scroll dopo una modal (login/user/prenota) Posizione salvata in navbar
    if (!className.includes('hidden')) {
      //console.log("Ripristina la posizione dello scroll");
      const savedScroll = homeRef.current.dataset.scrollPosition;
      if (savedScroll) {
        window.scrollTo(0, savedScroll);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className]);


  return (
    <div ref={homeRef} className={`bg-gray-100 min-h-screen pt-20 ${className}`}>
      {/* Sezioni    */}
      {userPrivileges <= UserType.ADMIN  && (<>
        <section id="admin" className="p-8  bg-gray-200">
          <h2 className="text-3xl font-bold mb-4">Sezione Admin</h2>
          <Admin />
        </section>
      </>)}
      {userPrivileges <= UserType.STAFF  && (<>
        <section id="staff" className="p-8  bg-gray-200">
          <h2 className="text-3xl font-bold mb-4">Sezione Prenotazioni (Staff)</h2>
          <Staff />
        </section>
      </>)}
      <section id="Solipsista" className="py-16 px-8 flex justify-center">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">
          Solipsista – L’esperienza è solo tua
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Benvenuto in <strong>Solipsista</strong>, un luogo in cui la realtà si piega ai tuoi sensi e il gusto diventa un’esperienza assoluta. Qui, il mondo esterno svanisce, lasciando spazio solo a te, ai tuoi desideri e ai sapori che si intrecciano in un’armonia perfetta.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 mt-4">
            Non è solo un ristorante, è un viaggio interiore. Ogni piatto è pensato per essere vissuto in modo unico e personale, perché ciò che conta è la tua percezione, la tua emozione, il tuo momento.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 mt-4 font-semibold">
            In un mondo che urla, <em>Solipsista sussurra.</em> Qui, l’unica realtà che esiste è la tua.
         </p>
        </div>
      </section>

      <section id="menu" className="p-8 ">
        <h2 className="text-3xl font-bold mb-4">Menu</h2>
        {/* Contenuto della sezione Menu */}
        <Tavoli/>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
        <div>Sezione Menu</div>
      </section>

      <section id="chi-siamo" className="p-8 bg-gray-200">
        <h2 className="text-3xl font-bold mb-4">Chi Siamo</h2>
        {/* Contenuto della sezione Chi Siamo */}
        <div>Sezione Chi Siamo</div>
        <div>Sezione Chi Siamo</div>
        <div>Sezione Chi Siamo</div>
        <div>Sezione Chi Siamo</div>
        <div>Sezione Chi Siamo</div>
        <div>Sezione Chi Siamo</div>
        <div>Sezione Chi Siamo</div>
        <div>Sezione Chi Siamo</div>
        <div>Sezione Chi Siamo</div>
        <div>Sezione Chi Siamo</div>
      </section>

      <section id="contatti" className="p-8 ">
        <h2 className="text-3xl font-bold mb-4">Contatti</h2>
        {/* Contenuto della sezione Contatti */}

        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
        <div>Sezione Contatti</div>
      </section>
    </div>
  );
};

Home.propTypes = {
    userPrivileges: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
    className: PropTypes.string,
    homeRef: PropTypes.object
  };

  export default Home;

