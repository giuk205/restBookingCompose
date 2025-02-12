import {IconInstagram, IconFacebook, IconTwitt} from "../components/Icons";

  export default function Footer() {
    return (
        <footer className="bg-white text-black py-6 mt-10 pl-5 pr-5 w-full items-center">
        <div className="bg-white flex flex-col md:flex-row justify-between items-start px-6 w-full">
           
            {/* Logo */}
            <div className="w-32 flex justify-center items-center self-center">
             <img src="/logo11.png" alt="Logo" className="w-32 h-auto" />
            </div>


          {/* Contatti */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold">Contatti</h2>
            <p className="flex items-center text-lg"><span className="mr-2">📧</span> email@solipsista.com</p>
            <p className="flex items-center text-lg"><span className="mr-2">📞</span> +39 123 456 7890</p>
            <p className="flex items-center text-lg"><span className="mr-2">📍</span> Via Roma 1, Milano, Italia</p>
          
          </div>
          
          <nav className="flex flex-wrap space-x-4 mt-10 md:mt-15 justify-center">
            <a href="#Solipsista" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="hover:text-gray-400 text-xl">Solipsista</a>
            <a href="#ChiSiamo" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="hover:text-gray-400 text-xl">Chi siamo</a>
            <a href="#specialita" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="hover:text-gray-400 text-xl">Specialità</a>
            <a href="#Menu" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="hover:text-gray-400 text-xl">Menù</a>
            <a href="#pizza" onClick={() => {setActionOnUser(null);setActiveForm(PageForm.HOME); toggleMenu(); }} className="hover:text-gray-400 text-xl">Pizza</a>
            </nav>


          
        <div className="flex flex-col space-y-4 mt-10 md:mt-4 justify-center">
        <a href="#" className="hover:text-gray-400 flex items-center">
        <span className="bg-blue-500 text-white p-2 rounded-full mr-2  hover:bg-blue-700">
         <IconTwitt />
        </span>
            Twitter
        </a>
        <a href="#" className="hover:text-gray-400 flex items-center">
        <span className="bg-blue-800 text-white p-2 rounded-full mr-2 hover:bg-blue-900">
         <IconFacebook />
        </span>
            Facebook
        </a>
        <a href="#" className="hover:text-gray-400 flex items-center">
        <span className="bg-gradient-to-r from-pink-500 to-amber-600 text-white p-2 rounded-full mr-2 transition-all hover:from-pink-700 hover:to-amber-800">
        <IconInstagram />
        </span>
            Instagram
        </a>


        </div>

          <p className="mt-10 md:mt-30 justify-centermt text-lg hover:text-gray-400 cursor-pointer">Privacy Policy</p>
        </div>
      </footer>
    );
  }
  