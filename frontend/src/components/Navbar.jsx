import PropTypes from 'prop-types';
import { UserType, PageForm } from  '../globals';
import { useState, useRef, useEffect } from 'react';
import { IconMenuList, IconSetting, IconUserSetting, IconUser, IconLogout } from "./Icons";



export default function Navbar({ activeForm, setActiveForm, idUser, setIdUser, userPrivileges, setUserPrivileges, prevForm, setPrevForm, homeRef}) {

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


  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-linear-to-r/srgb backdrop-blur-xs from-orange-300/90  to-amber-200/90 p-2 shadow-lg flex justify-between items-center">
        {/* Sezione sinistra */}
        <div className=" text-zinc-200  flex">
          <button onClick={toggleMenu} onMouseDown={(e) => e.stopPropagation()}  className="icon hover:text-white hover:border-white hover:bg-green-800 rounded-lg border border-transparent cursor-pointer">
            <IconMenuList /></button>
          {userPrivileges < UserType.USER && ( <> &nbsp;&nbsp;
            <button className="icon hover:text-white hover:border-white hover:bg-green-800 rounded-lg border border-transparent cursor-pointer">
              <IconSetting /></button> </> )}
          &nbsp;&nbsp;
          {/* Icona utente */}
          <button className="icon hover:text-white hover:border-white hover:bg-green-800 rounded-lg border border-transparent cursor-pointer"
              onClick={() => {
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
        <button className="bg-zinc-200 text-green-600 font-bold px-6 py-2 rounded-xl shadow-xl hover:bg-green-800 hover:text-white cursor-pointer"
            onClick={() => {
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
        <div className="fixed top-14 left-0 z-10 backdrop-blur-xs bg-orange-300/90 teal-500 pt-6 shadow-lg rounded-md w-48"
        ref={menuRef} >
          <ul className="space-y-2 pl-4">
            {/* Voce Logout, solo se loggato */}
              {idUser !== null && (<>
                <li><div
                    onClick={() => {
                      setIdUser(null);
                      setUserPrivileges(UserType.USER);
                      setActiveForm(PageForm.HOME);
                      toggleMenu();
                    }}
                    className="flex justify-between items-center px-4 py-2 rounded hover:bg-green-300 cursor-pointer w-full"
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
              {userPrivileges <= UserType.ADMIN  && (<>
                <li><a href="#admin" onClick={() => {setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-green-300">
                  Admin
                </a></li>
            </>
            )}
          {/* Voce prenotazioni, solo se loggato e non utente */}
          {userPrivileges < UserType.USER  && (<>
            <li><a href="#staff" onClick={() => {setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-green-300">
              Staff
            </a></li>
            </>
          )}

          <hr className="border-t border-black-500 my-2 mr-4" />
          </>
          )}
          {/* Voci del menu */}
          <li><a href="#menu" onClick={() => {setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-green-300">
            Menu
          </a></li>
          <li><a href="#chi-siamo" onClick={() => {setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-green-300">
            Chi siamo
          </a></li>
          <li><a href="#contatti" onClick={() => {setActiveForm(PageForm.HOME); toggleMenu(); }} className="block px-4 py-2 rounded hover:bg-green-300">
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
