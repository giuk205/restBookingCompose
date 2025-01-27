import PropTypes from 'prop-types';
import { UserType, PageForm } from  '../globals';

export default function Navbar({ activeForm, setActiveForm, idUser, userPrivileges}) {

  const IconMenuList = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"  strokeLinejoin="round" >
        <path d="M3 12h18"/>        <path d="M3 18h18"/>        <path d="M3 6h18"/>
      </svg>
    ); };

  const IconSetting = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"  strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>      
      </svg>
    );  };

  const IconUser = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
      </svg>
    );  };

  const IconUserSetting = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 21a8 8 0 0 1 10.434-7.62"/><circle cx="10" cy="8" r="5"/><circle cx="18" cy="18" r="3"/><path d="m19.5 14.3-.4.9"/><path d="m16.9 20.8-.4.9"/><path d="m21.7 19.5-.9-.4"/><path d="m15.2 16.9-.9-.4"/><path d="m21.7 16.5-.9.4"/><path d="m15.2 19.1-.9.4"/><path d="m19.5 21.7-.4-.9"/><path d="m16.9 15.2-.4-.9"/>
      </svg>
    );  };

    const IconLogout = () => {
        return (
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-crossed"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/></svg>        );  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-linear-to-r/srgb from-indigo-600  to-teal-400 p-4 shadow-lg flex justify-between items-center">
        {/* Sezione sinistra */}

        <div className=" text-zinc-200  flex">
            <IconLogout/>
            <button className="hover:text-white hover:border-white hover:bg-green-800 rounded-lg border border-transparent cursor-pointer">
                <IconMenuList />
            </button>
            {userPrivileges < UserType.USER && (
                <>
                &nbsp;&nbsp;
                <button className="hover:text-white hover:border-white hover:bg-green-800 rounded-lg border border-transparent cursor-pointer">
                    <IconSetting />
                </button>
                </>
            )}
            &nbsp;&nbsp;
            <button className="hover:text-white hover:border-white hover:bg-green-800 rounded-lg border border-transparent cursor-pointer"
                onClick={() => {
                    console.log( idUser === null ? "setActiveForm LOGIN: PageForm.LOGIN" : "setActiveForm USER:PageForm.USER");
                    setActiveForm(idUser === null ? PageForm.LOGIN : PageForm.USER);                   
                    }
                }
            >
                {idUser!==null ? <IconUserSetting /> : <IconUser />}
            </button>
        </div>

      {/* Center Section    */}
      <h2 className="text-stone-800 text-3xl font-bold sm:flex sm:items-center">
      <span className="hidden sm:block">Ristorante</span>&nbsp;Solipsista</h2>

      {/* Right Section */}
      <button className="bg-zinc-200 text-green-600 font-bold px-6 py-2 rounded-xl shadow-xl hover:bg-green-800 hover:text-white cursor-pointer"
        onClick={() => {setActiveForm(PageForm.BOOKING);}}
      >
        Prenota
      </button>
    </nav>
  );
  
}
Navbar.propTypes = {
    activeForm: PropTypes.oneOf(Object.values(PageForm)), 
    setActiveForm: PropTypes.func.isRequired, 
    idUser: PropTypes.number, 
    userPrivileges: PropTypes.oneOf(Object.values(UserType)), 
  };


{/*  const IconLogout = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/><path d="M 11 19 A 2 2 90 0 1 9 21 H 5 a 2 2 90 0 1 -2 -2 V 5 a 2 2 90 0 1 2 -2 h 4 a 2 2 90 0 1 2 2"/>
      </svg>
    );  };

    &nbsp;&nbsp;
    <button className="hover:text-white hover:border-white hover:bg-green-800 rounded-lg border border-transparent">
        <IconLogout />
    </button>

            <button className="hover:text-white hover:border-white hover:bg-green-800 rounded-lg border border-transparent cursor-pointer">
                <IconUser />  
            </button>
            &nbsp;&nbsp;
            <button className="hover:text-white hover:border-white hover:bg-green-800 rounded-lg border border-transparent bg-green-600 text-white cursor-pointer">
                <IconUserSetting /> 
            </button>


*/}
