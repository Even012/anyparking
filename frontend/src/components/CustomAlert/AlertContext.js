// AlertContext.js
import React from 'react';

const AlertContext = React.createContext({
  customAlert: (msg) => console.log(msg), // Placeholder function
});

export default AlertContext;
