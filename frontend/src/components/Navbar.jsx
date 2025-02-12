import PropTypes from 'prop-types';
import { UserType, PageForm, connectionprefix } from  '../globals';
import { useState, useRef, useEffect } from 'react';
import { IconMenuList, IconSetting, IconUserSetting, IconUser, IconLogout, IconBlocks, IconNotebook } from "./Icons";

import {MyModal} from './MyModal';

export default function Navbar({ activeForm, setActiveForm, idUser, setIdUser, userPrivileges, setUserPrivileges, prevForm, setPrevForm, setActionOnUser, homeRef}) {

  console.log( "function Navbar activeForm:"+activeForm);                
  console.log( "function Navbar met prevForm:"+prevForm);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Ref per il menu laterale

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Chiudi il menu se clicchi fuori
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside); // Uso mousedown per una migliore reattività
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Importante: rimuove event listener quando il componente si smonta o il menu si chiude
    };
  }, [isMenuOpen]);

/*
            <button className="icon hover:text-white hover:border-white hover:bg-green-800 rounded-lg border border-transparent cursor-pointer"
              onClick={}>
              <IconSetting /></button> </> )}
*/
  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-linear-to-r/srgb backdrop-blur-xs from-orange-400/90  to-red-500/90 p-2 shadow-lg flex justify-between items-center">
        {/* Sezione sinistra */}
        <div className=" text-zinc-200  flex">
          <button onClick={toggleMenu} onMouseDown={(e) => e.stopPropagation()}  className="flex justify-center items-center hover:text-white hover:border-white hover:bg-lime-600 rounded-lg border p-1 border-transparent cursor-pointer">
            <IconMenuList /></button>
          
          {/* Icona ingranaggio abilita MyModal
          &nbsp;&nbsp;
          {userPrivileges < UserType.USER && ( 
            <MyModal/>
          )}
          */}

          &nbsp;&nbsp;
          {/* Icona utente */}
          
          <button className="flex justify-center items-center hover:text-white hover:border-white hover:bg-lime-600 rounded-lg border p-1 border-transparent cursor-pointer"
              onClick={() => {
                setActionOnUser(null);
                if (activeForm !== PageForm.LOGIN && activeForm !== PageForm.USER) {
                  if (activeForm === PageForm.HOME){
                    //Salva la posizione dello scroll di Home
                    homeRef.current.dataset.scrollPosition = window.scrollY;
                  }

                  console.log( "CLICK ICONA UTENTE mette activeForm in prevForm:"+activeForm);
                  setPrevForm(activeForm);
                  console.log( idUser === null ? "CLICK ICONA UTENTE attiva LOGIN"+PageForm.LOGIN:"CLICK ICONA UTENTE attiva USER"+PageForm.USER);
                  setActiveForm(idUser === null ? PageForm.LOGIN : PageForm.USER);                   
                }
                else{
                  console.log( "CLICK ICONA UTENTE mette activeForm:"+activeForm);
                  setActiveForm(prevForm);
                  setPrevForm(PageForm.HOME);
             }}}>
            {idUser!==null ? <IconUserSetting /> : <IconUser />}
          </button>
        </div>

        {/* Center Section    */}
        <h2 className="text-stone-800 text-3xl font-bold sm:flex sm:items-center">
          <span className="hidden sm:block">Ristorante</span>&nbsp;Solipsista</h2>

        {/* Right Section */}
        <button className="bg-zinc-200 text-green-600 font-bold px-6 py-2 rounded-xl shadow-xl hover:bg-lime-600 hover:text-white cursor-pointer"
            onClick={() => {
              setActionOnUser(null);
              if (activeForm === PageForm.HOME){
                //Salva la posizione dello scroll di Home
                homeRef.current.dataset.scrollPosition = window.scrollY;
              }
              if (activeForm !== PageForm.BOOKING){
                setPrevForm(activeForm);
                setActiveForm(PageForm.BOOKING);
              } 
              }} >
          Prenota
        </button>
      </nav>


      {isMenuOpen && (
        <div className="fixed top-14 left-0 z-10 backdrop-blur-xs bg-orange-400/90 teal-500 pt-6 shadow-lg rounded-md w-48"
        ref={menuRef} >
          <ul className="space-y-2 pl-4">
            {/* Voce Logout, solo se loggato */}
              {idUser !== null && (<>
                <li><div
                    onClick={ async () => {
                      //aggiorno subito interfaccia utente
                      setActionOnUser(null);
                      setIdUser(null);
                      setUserPrivileges(UserType.USER);
                      setActiveForm(PageForm.HOME);
                      toggleMenu();
                      window.location.href = "#Solipsista";

                      try {
                        const response = await fetch(`${connectionprefix}/logout`, {
                          method: "GET",
                          credentials: "include",
                        });
                        if (response.ok) {
                          console.log("Effettuato logout");
                        } else {
                          console.log("Logout fallito");
                        }
                      } catch (error) {
                        console.error("Errore durante il logout:", error);
                      }

                    }}
                    className="flex justify-between items-center px-4 py-2 rounded hover:bg-lime-500 cursor-pointer w-full"
                  >
                  <span>Logout</span>
                  <IconLogout className="icon" />
                </div></li>


{/* 
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
        <div className="cursor-pointer transition-all duration-200 border-zinc-600 border-2 rounded-lg hover:bg-green-500"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)} >
          <div className="icon"> 
           {isHovering===true ? <IconMoveLeft /> : <IconExit />}
          </div>
        </div>
        <div>
          Modifica Profilo
        </div>
        <div className="w-12"></div>
      </h2>

*/  }

            {/* Voce Admin, solo se loggato come Admin*/}
              {userPrivileges <= UserType.MANAGER  && (<>
                <li><a href="#utenti" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} 
                  className="flex justify-between items-center px-4 py-2 rounded hover:bg-lime-500 cursor-pointer w-full">
                  <span>Utenti</span>
                  <IconSetting className="icon" />
                 </a></li>
                <li><a href="#tavoli" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} 
                  className="flex justify-between items-center px-4 py-2 rounded hover:bg-lime-500 cursor-pointer w-full">
                  <span>Tavoli</span>
                  <IconBlocks className="icon" />
                </a></li>
            </>
            )}
          {/* Voce prenotazioni, solo se loggato e non utente */}
          {userPrivileges < UserType.USER  && (<>
            <li><a href="#staff" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} 
                  className="flex justify-between items-center px-4 py-2 rounded hover:bg-lime-500 cursor-pointer w-full">
                  <span>Prenotazioni</span>
                  <IconNotebook className="icon" />
            </a></li>
            </>
          )}

          <hr className="border-t border-black-500 my-2 mr-4" />
          </>
          )}
          {/* Voci del menu */}
          <li><a href="#Solipsista" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-lime-500">
            Solipsista
          </a></li>
          <li><a href="#ChiSiamo" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-lime-500">
            Chi siamo
          </a></li>
          <li><a href="#specialita" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-lime-500">
            Specialità
          </a></li>
          <li><a href="#Menu" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-lime-500">
            Menu
          </a></li>
          <li><a href="#pizza" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-lime-500">
            Pizza
          </a></li>
          <li><a href="#footer" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-lime-500">
            Contatti
          </a></li>
        </ul>
        </div>
      )}
    </>
  );
  
}
Navbar.propTypes = {
    activeForm: PropTypes.oneOf(Object.values(PageForm)).isRequired, 
    setActiveForm: PropTypes.func.isRequired,
    prevForm: PropTypes.oneOf(Object.values(PageForm)).isRequired, 
    setPrevForm: PropTypes.func.isRequired,
    idUser: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
    setIdUser: PropTypes.func.isRequired,
    userPrivileges: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
    setUserPrivileges: PropTypes.func.isRequired,
    homeRef: PropTypes.object
    
  };
