import { useState, useEffect } from "react";
import { connectionprefix } from "../globals";

export default function User() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`${connectionprefix}/user`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setEmail(data.email);
          setPhone(data.phone);
        } else {
          setMessage("Errore nel caricamento dei dati utente.");
        }
      } catch (error) {
        setMessage("Errore di connessione.");
      }
    }
    fetchUserData();
  }, []);

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`${connectionprefix}/user`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, phone }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Errore nell'aggiornamento del profilo.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== repeatPassword) {
      setMessage("Le nuove password non coincidono.");
      return;
    }
    try {
      const response = await fetch(`${connectionprefix}/user`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Errore nel cambio password.");
    }
  };

  return (
    <div className="h-screen w-screen bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center m-0">
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Modifica Profilo</h2>
    
      <label className="block mb-2">Nome</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <label className="block mb-2">Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <label className="block mb-2">Telefono</label>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <button onClick={handleUpdateUser} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-6">Aggiorna Dati</button>

      <h2 className="text-xl font-bold mb-4">Cambio Password</h2>
      <label className="block mb-2">Vecchia Password</label>
      <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <label className="block mb-2">Nuova Password</label>
      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <label className="block mb-2">Ripeti Nuova Password</label>
      <input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className="w-full p-2 border rounded mb-4" />

      <button onClick={handleChangePassword} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Cambia Password</button>
      
      {message && <p className="text-center mt-4 text-red-500">{message}</p>}
    </div>
</div>
  );
}