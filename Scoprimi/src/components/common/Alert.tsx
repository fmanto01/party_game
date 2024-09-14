import React, { useEffect, useState } from 'react';

interface AlertProps {
  text: string;
}

const Alert: React.FC<AlertProps> = ({ text }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Mantieni il testo visibile per 2 secondi
    const timer = setTimeout(() => {
      setVisible(false); // Nascondi il testo dopo 2 secondi
    }, 2000);

    return () => clearTimeout(timer); // Pulisci il timer
  }, []);

  return (
    <div className={`fade-text ${visible ? 'visible' : 'hidden'}`}>
      {text}
    </div>
  );
};

export default Alert;
