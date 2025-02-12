import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { UserType } from  '../globals';
import Admin from '../sections/Admin'
import Staff from '../sections/Staff';
import Tavoli from '../sections/Tavoli';
import Solipsista from '../sections/Solipsista';
import ChiSiamo from '../sections/ChiSiamo';
import Specialita from '../sections/Specialita';
import Menu from '../sections/Menu';    
import Pizza from '../sections/Pizza';  
import Pmenu from '../sections/Pmenu';
import Footer from '../sections/footer';

const Home = ({ activeForm, setActiveForm, idUser, setIdUser, userPrivileges, setUserPrivileges, prevForm, setPrevForm, className, setActionOnUser, homeRef, setRicaricaUtenti, ricaricaUtenti}) => {

  useEffect(() => { // Per ripristina la posizione dello scroll dopo una modal (login/user/prenota) Posizione salvata in navbar
    if (!className.includes('hidden')) {
      console.log("Ripristina la posizione dello scroll");
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
      {userPrivileges <= UserType.MANAGER  && (<>

        <section id="utenti" className="p-8  bg-gray-200">
          {/*<h2 className="text-3xl font-bold mb-4 mt-8">Sezione Utenti</h2>*/}
          <Admin homeRef={homeRef} activeForm={activeForm} setActiveForm={setActiveForm} idUser={idUser} setIdUser={setIdUser} userPrivileges={userPrivileges} setUserPrivileges={setUserPrivileges} prevForm={prevForm} setPrevForm={setPrevForm} setActionOnUser={setActionOnUser} setRicaricaUtenti={setRicaricaUtenti} ricaricaUtenti={ricaricaUtenti}/>
        </section>

        <section id="tavoli" className="p-8  bg-gray-200">
          {/*<h2 className="text-3xl font-bold mb-4">Sezione Gestione tavoli (Manager)</h2>*/}
          <Tavoli />
        </section>
      
      </>)}


      {userPrivileges <= UserType.STAFF  && (<>

        <section id="staff" className="p-8  bg-gray-200">
          {/*<h2 className="text-3xl font-bold mb-4 mt-8">Sezione Prenotazioni (Staff)</h2>*/}
          <Staff userPrivileges={userPrivileges}/>
        </section>
      </>)}

      

      {/* Sezioni  per utenti */}
      <section id="Solipsista" className="py-16 px-8 flex justify-center">
        <Solipsista />
      </section>

      
      {/* Contenuto della sezione Chi Siamo */}
      <section id="ChiSiamo" className="p-8 py-16 bg-orange-200">
        <h2 className="text-4xl text-center font-bold mb-4">Chi Siamo</h2>
         <ChiSiamo/>
      </section>
         
      
      {/* Contenuto della sezione specialità */}
      <section id="specialita" className="p-8 py-16">
        <h2 className="text-3xl text-center font-bold mb-4"> I nostri piatti, le nostre specialità</h2>
       <Specialita/>
      </section>
        

      {/* Contenuto della sezione Menu */} 
      <section id="Menu" className="p-8 py-16 bg-orange-200">
       <h2 className="text-4xl text-center font-bold mb-4">Menu</h2>
        <Menu/>
      </section>            
            
      
      {/* Contenuto della sezione Pizza */} 
      <section id="pizza" className="p-8 py-16">
       <Pizza/>
      </section>           
        
     
      {/* Contenuto menu Pizza */} 
      <section id="Pmenu" className="p-8 py-16 bg-orange-200">
      <h2 className="text-4xl text-center font-bold mb-4">Menù della pizza</h2>
         <Pmenu/>
      </section>           
       
     
      <section id="footer" className="p-8 py-16  bg-white">       
        <Footer/>

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

