import React, { useEffect } from 'react';

interface AlertProps {
  text: string;
  show: boolean;
  onHide: () => void;
}

const Alert: React.FC<AlertProps> = ({ text, show, onHide }) => {
  useEffect(() => {
    if (show) {
      // Nascondi l'alert dopo 2 secondi
      const timer = setTimeout(() => {
        onHide(); // Chiama la funzione per nascondere l'alert
      }, 2000);

      return () => clearTimeout(timer); // Pulisci il timer quando l'alert viene nascosto o il componente viene smontato
    }
  }, [show, onHide]);

  return (
    <div className={`fade-text ${show ? 'visible' : 'hidden'}`}>
      {text}
    </div>
  );
};

export default Alert;
