import PropTypes from "prop-types";
import './Icons.css'

export const IconExit = ({ className = "" }) => {
    return (
      <svg className={`w-6 h-6 ${className}`} xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </svg>
    );  };

export const IconMoveLeft = ({ className = "" }) => {
    return (
      <svg className={`w-6 h-6 ${className}`} xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
        <path d="M6 8L2 12L6 16"/><path d="M2 12H22"/>
      </svg>
    );  };

export const IconMenuList = ({ className = "" }) => {
    return (
        <svg className={`w-6 h-6 ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"  strokeLinejoin="round" >
        <path d="M3 12h18"/>        <path d="M3 18h18"/>        <path d="M3 6h18"/>
        </svg>
    ); };

export const IconSetting = ({ className = "" }) => {
    return (
        <svg className={`w-6 h-6 ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"  strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>      
        </svg>
    );  };

export const IconUser = ({ className = "" }) => {
    return (
        <svg className={`w-6 h-6 ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
        </svg>
    );  };

export const IconUserSetting = ({ className = "" }) => {
    return (
        <svg className={`w-6 h-6 ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 21a8 8 0 0 1 10.434-7.62"/><circle cx="10" cy="8" r="5"/><circle cx="18" cy="18" r="3"/><path d="m19.5 14.3-.4.9"/><path d="m16.9 20.8-.4.9"/><path d="m21.7 19.5-.9-.4"/><path d="m15.2 16.9-.9-.4"/><path d="m21.7 16.5-.9.4"/><path d="m15.2 19.1-.9.4"/><path d="m19.5 21.7-.4-.9"/><path d="m16.9 15.2-.4-.9"/>
        </svg>
    );  };

export const IconLogout = ({ className = "" }) => {
        return (
        <svg className={`w-6 h-6 ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/><path d="M 11 19 A 2 2 90 0 1 9 21 H 5 a 2 2 90 0 1 -2 -2 V 5 a 2 2 90 0 1 2 -2 h 4 a 2 2 90 0 1 2 2"/>
        </svg>
        );  };


IconExit.propTypes,
IconMoveLeft.propTypes,
IconMenuList.propTypes,
IconSetting.propTypes,
IconUser.propTypes,
IconUserSetting.propTypes,
IconUser.propTypes, 
IconLogout.propTypes = {
    className: PropTypes.string, // Definisce className come stringa opzionale
    };