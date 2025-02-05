import React from "react";

const Gol: React.FC = () => {
  const registrarGol = () => {
    const golsSalvos = JSON.parse(localStorage.getItem("gols") || "[]");
    const novoGol = {
      data: new Date().toISOString(),
    };
    localStorage.setItem("gols", JSON.stringify([...golsSalvos, novoGol]));
  };

  return <button onClick={registrarGol}>Gol</button>;
};

export default Gol;
