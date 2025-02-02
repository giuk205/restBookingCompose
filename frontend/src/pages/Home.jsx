import PropTypes from 'prop-types';
import Admin from '../sections/Admin'
import Staff from '../sections/Staff';

import { UserType } from  '../globals';

const Home = ({ userPrivileges}) => {


  return (
    <div className="bg-gray-100 min-h-screen pt-20">
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
  };

  export default Home;

