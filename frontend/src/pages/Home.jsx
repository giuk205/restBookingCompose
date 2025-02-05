import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { UserType } from  '../globals';
import Admin from '../sections/Admin'
import Staff from '../sections/Staff';
import Tavoli from '../sections/Tavoli';
import Solipsista from '../sections/Solipsista';

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
      {/* Sezioni  per autorizzati */}
      {userPrivileges <= UserType.ADMIN  && (<>

        <section id="admin" className="p-8  bg-gray-200">
          <h2 className="text-3xl font-bold mb-4">Sezione Admin</h2>
          <Admin />
        </section>

      </>)}

      {userPrivileges <= UserType.MANAGER  && (<>

        <section id="tavoli" className="p-8  bg-gray-200">
          <h2 className="text-3xl font-bold mb-4">Sezione Gestione tavoli (Manager)</h2>
          <Tavoli />
        </section>
      
      </>)}


      {userPrivileges <= UserType.STAFF  && (<>

        <section id="staff" className="p-8  bg-gray-200">
          <h2 className="text-3xl font-bold mb-4">Sezione Prenotazioni (Staff)</h2>
          <Staff />
        </section>
      </>)}

      

      {/* Sezioni  per utenti */}
      <section id="Solipsista" className="py-16 px-8 flex justify-center">
        <Solipsista />
      </section>

      <section id="menu" className="p-8 ">
        <h2 className="text-3xl font-bold mb-4">Menu</h2>
        {/* Contenuto della sezione Menu */}
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

