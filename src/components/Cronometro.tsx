import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const Cronometro: React.FC = () => {
  // Carregar valores do localStorage ou inicializar com zero
  const [minutos, setMinutos] = useState<number>(
    parseInt(localStorage.getItem("minutos") || "0")
  );
  const [segundos, setSegundos] = useState<number>(
    parseInt(localStorage.getItem("segundos") || "0")
  );
  const [ativo, setAtivo] = useState<boolean>(false);
  const [intervalo, setIntervalo] = useState<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Quando a página for recarregada, carrega o valor salvo, mas cronômetro fica pausado
    if (localStorage.getItem("ativo") === "true") {
      setAtivo(true);
    } else {
      setAtivo(false);
    }
    return () => {
      if (intervalo) clearInterval(intervalo); // Limpar o intervalo quando o componente for desmontado
    };
  }, []);

  useEffect(() => {
    // Salva o valor do cronômetro e o estado ativo
    localStorage.setItem("minutos", minutos.toString());
    localStorage.setItem("segundos", segundos.toString());
    localStorage.setItem("ativo", JSON.stringify(ativo));
  }, [minutos, segundos, ativo]);

  // Iniciar cronômetro
  const iniciarCronometro = () => {
    if (intervalo) return; // Impede que múltiplos intervalos sejam criados
    setAtivo(true);
    const novoIntervalo = setInterval(() => {
      setSegundos((prev) => {
        if (prev === 59) {
          setMinutos((m) => m + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    setIntervalo(novoIntervalo);
  };

  // Parar cronômetro
  const pararCronometro = () => {
    if (intervalo) clearInterval(intervalo);
    setAtivo(false);
  };

  // Resetar cronômetro
  const resetarCronometro = () => {
    // Exportar gols antes de resetar
    if (JSON.parse(localStorage.getItem("gols") || "[]").length > 0) {
      exportarGolsParaXLS();
    }

    // Resetar cronômetro
    setAtivo(false);
    setMinutos(0);
    setSegundos(0);
    localStorage.setItem("minutos", "0");
    localStorage.setItem("segundos", "0");
    localStorage.setItem("ativo", "false");

    // Limpar lista de gols no localStorage
    localStorage.removeItem("gols");
  };

  // Exportar gols para XLS
  const exportarGolsParaXLS = () => {
    const gols = JSON.parse(localStorage.getItem("gols") || "[]");
    if (gols.length === 0) return;

    const wsData = [["Data", "Hora"], ...gols.map((gol: { data: string; hora: string }) => [gol.data, gol.hora])];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gols");

    const agora = new Date();
    agora.setHours(agora.getHours() - 3); // Ajuste de fuso horário
    const nomeArquivo = `gols_${agora.getFullYear()}-${(agora.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${agora.getDate().toString().padStart(2, "0")}_${agora
      .getHours()
      .toString()
      .padStart(2, "0")}-${agora.getMinutes().toString().padStart(2, "0")}.xlsx`;
    XLSX.writeFile(wb, nomeArquivo);

    localStorage.removeItem("gols");
  };

  const gols = JSON.parse(localStorage.getItem("gols") || "[]");

  return (
    <div>
      <h1>
        {String(minutos).padStart(2, "0")}:{String(segundos).padStart(2, "0")}
      </h1>
      <button onClick={ativo ? pararCronometro : iniciarCronometro}>
        {ativo ? "Parar" : "Iniciar"}
      </button>
      <button onClick={resetarCronometro}>Resetar</button>
      <ul>
        {gols.map((gol: { data: string; hora: string }, index: number) => (
          <li key={index}>{`${gol.data} - ${gol.hora}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default Cronometro;
