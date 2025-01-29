import { useState } from 'react';


export default function Register({message = "Ciao" }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    code: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendCode = () => {
    alert('Codice inviato al numero: ' + formData.phone);
  };

  const handleRegister = () => {
    alert('Registrazione completata!');
  };
//<div className="w-full h-screen bg-cover bg-center flex items-center justify-center" >
      //<div className="w-full h-full fixed top-0 left-0 min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${sfondo})` }}></div>
  return (
    <div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center">
    <div className="p-8 bg-white shadow-2xl rounded-2xl w-full max-w-md">
      <div className="flex flex-col items-center mb-6">
        <img src="/profilo5.png" alt="Profilo" className="mx-auto w-32 mb-4" />
        <h2 className="text-2xl font-bold text-center">Registrazione utente</h2>
      </div>
         <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Nome"
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Telefono"
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center space-x-2 mt-8">
              <button
                onClick={handleSendCode}
                 className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center w-24 h-10"
                style={{ width: '405px', height: '40px' }}
              >
                Codice sms
              </button>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="123"
                maxLength="3"
                className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        
          <div className="mt-10">
            <button
              onClick={handleRegister}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Registrati
            </button>
          </div>
          {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
        </div>
      </div>

  )
}