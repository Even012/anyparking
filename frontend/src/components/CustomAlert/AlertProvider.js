// AlertProvider.js
import React, { useState, useCallback } from "react";
import AlertContext from "./AlertContext";
import CustomAlertDialog from "./CustomAlertDialog";

const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitleMessage, setAlertTitleMessage] = useState("");

  const customAlert = useCallback((msg, title = "Warning") => {
    setAlertMessage(msg);
    setIsAlertOpen(true);
    setAlertTitleMessage(title);
  }, []);

  const closeAlert = useCallback(() => {
    setIsAlertOpen(false);
  }, []);

  return (
    <AlertContext.Provider value={{ customAlert }}>
      {children}
      <CustomAlertDialog
        open={isAlertOpen}
        message={alertMessage}
        handleClose={closeAlert}
        alertTitle={alertTitleMessage}
      />
    </AlertContext.Provider>
  );
};

export default AlertProvider;
