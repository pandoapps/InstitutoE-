import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Zap, 
  Factory, 
  TrendingUp, 
  Users, 
  Globe, 
  Sparkles, 
  Compass, 
  Search, 
  Send, 
  ArrowRight, 
  RefreshCw, 
  Award, 
  MapPin, 
  Info, 
  CheckCircle2, 
  Activity,
  Flame,
  Wind,
  Sun,
  Droplets,
  ChevronDown,
  ChevronUp,
  X,
  MessageSquare
} from "lucide-react";
import { statesList, NATIONAL_STATS, BRAZIL_REGIONS, INDUSTRIAL_SECTORS, StateData, StateYearData } from "./data/brazilData";
import { CNAE_100_LIST, CnaeItem } from "./data/cnaeList";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STATE_COORDINATES: { [key: string]: [number, number] } = {
  AC: [-9.0238, -70.8120],
  AL: [-9.5713, -36.7820],
  AP: [1.4170, -51.7700],
  AM: [-3.4168, -64.1830],
  BA: [-12.5797, -41.7007],
  CE: [-5.4984, -39.3206],
  DF: [-15.7998, -47.8645],
  ES: [-19.1834, -40.3089],
  GO: [-15.8270, -49.8378],
  MA: [-5.4160, -45.4190],
  MT: [-12.6819, -56.9211],
  MS: [-20.7206, -54.7007],
  MG: [-18.5122, -44.5550],
  PA: [-3.4168, -52.2798],
  PB: [-7.2400, -36.7820],
  PR: [-24.8922, -51.5200],
  PE: [-8.8137, -36.9541],
  PI: [-7.7140, -42.7280],
  RJ: [-22.4497, -42.9904],
  RN: [-5.7945, -36.5686],
  RS: [-30.0346, -51.2177],
  RO: [-11.5057, -63.5806],
  RR: [1.8219, -61.2706],
  SC: [-27.2423, -50.2189],
  SP: [-21.8973, -49.0822],
  SE: [-10.5741, -37.3853],
  TO: [-10.1753, -48.2982]
};

// Helper functions for Portuguese formatting: thousands with . and decimals with ,
const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return "0";
  return num.toLocaleString('pt-BR');
};

const formatDecimal = (num: number | undefined | null, decimals: number = 1): string => {
  if (num === undefined || num === null) return "0";
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export default function App() {
  // State for Filters
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedRegion, setSelectedRegion] = useState<string>("Todos");
  const [selectedSector, setSelectedSector] = useState<string>("Todos");
  const [selectedStateIds, setSelectedStateIds] = useState<string[]>([]); // empty = Brasil (Visão Nacional)
  const [heatmapMetric, setHeatmapMetric] = useState<"energy" | "cnae">("cnae");
  const [selectedCnaes, setSelectedCnaes] = useState<CnaeItem[]>([CNAE_100_LIST[0]]);
  const [cnaeSearchQuery, setCnaeSearchQuery] = useState<string>("");
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cnaeListExpanded, setCnaeListExpanded] = useState<boolean>(false);
  const [statesListExpanded, setStatesListExpanded] = useState<boolean>(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o **Assistente de Inteligência Industrial**. Estou conectado ao Data Lake de energia e indústria do Brasil com séries históricas consolidadas (2021 a 2024).\n\nPosso fazer análise preditiva, comparações de PIB Industrial, avaliar a expansão de energias renováveis e correlacionar consumos. Pergunte-me qualquer coisa sobre os dados atuais do portal!",
      timestamp: new Date()
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  // Helper values for maximums to calibrate map nodes sizes comparatively
  const maxEnergy = Math.max(...statesList.map(s => s.history[selectedYear]?.energyConsumption || 1));
  const maxGdp = Math.max(...statesList.map(s => s.history[selectedYear]?.gdpIndustrial || 1));

  // Helper weight for CNAE
  const getCnaeWeight = (stateData: StateYearData, cnaeSector: string) => {
    const hasSector = stateData.mainSectors?.includes(cnaeSector);
    return (hasSector ? 1.4 : 0.2) * (stateData.industrialCompaniesCount || 1000);
  };

  const maxCnaeCompanies = useMemo(() => {
    return Math.max(...statesList.map(s => {
      const stats = s.history[selectedYear];
      if (!stats) return 1;
      if (selectedCnaes.length === 0) {
        return stats.industrialCompaniesCount;
      }
      return selectedCnaes.reduce((acc, cnae) => {
        const specializing = stats.mainSectors?.includes(cnae.sector);
        const estComp = Math.max(1, Math.round((specializing ? 0.025 : 0.003) * stats.industrialCompaniesCount));
        return acc + estComp;
      }, 0);
    }));
  }, [selectedCnaes, selectedYear]);

  // Find currently active state (exactly 1 if selected, otherwise null)
  const activeState = selectedStateIds.length === 1 ? statesList.find(s => s.id === selectedStateIds[0]) : null;

  // Active Year Data (Aggregated for multiple selections)
  const currentStats: StateYearData = useMemo(() => {
    let baseline: StateYearData;

    if (selectedStateIds.length === 0) {
      baseline = {
        ...NATIONAL_STATS[selectedYear],
        mainSectors: ["Alimentos e Bebidas", "Metalurgia e Máquinas", "Têxtil e Vestuário", "Produtos Químicos"]
      };
    } else {
      const selectedHistory = selectedStateIds.map(id => {
        const s = statesList.find(st => st.id === id);
        return s?.history[selectedYear];
      }).filter(Boolean) as StateYearData[];

      if (selectedHistory.length === 0) {
        baseline = {
          ...NATIONAL_STATS[selectedYear],
          mainSectors: ["Alimentos e Bebidas", "Metalurgia e Máquinas", "Têxtil e Vestuário", "Produtos Químicos"]
        };
      } else {
        const totalGdpShare = selectedHistory.reduce((acc, curr) => acc + curr.gdpShare, 0);
        const totalGdpIndustrial = selectedHistory.reduce((acc, curr) => acc + curr.gdpIndustrial, 0);
        const totalEnergyConsumption = selectedHistory.reduce((acc, curr) => acc + curr.energyConsumption, 0);
        const totalIndustrialCompaniesCount = selectedHistory.reduce((acc, curr) => acc + curr.industrialCompaniesCount, 0);
        const totalEmployeeCount = selectedHistory.reduce((acc, curr) => acc + curr.employeeCount, 0);

        // Weighted average for Energy Matrix
        let sumHydro = 0, sumWind = 0, sumSolar = 0, sumThermal = 0, sumOther = 0;
        let totalEnergyForWeight = 0;

        selectedHistory.forEach(s => {
          const energy = s.energyConsumption || 1;
          totalEnergyForWeight += energy;
          sumHydro += energy * (s.energyMatrix?.hydroelectric || 0);
          sumWind += energy * (s.energyMatrix?.wind || 0);
          sumSolar += energy * (s.energyMatrix?.solar || 0);
          sumThermal += energy * (s.energyMatrix?.thermal || 0);
          sumOther += energy * (s.energyMatrix?.biomassOrOther || 0);
        });

        const divider = totalEnergyForWeight || 1;

        // Gather unique main sectors sorted by occurrence
        const sectorCount: { [key: string]: number } = {};
        selectedHistory.forEach(s => {
          s.mainSectors?.forEach(sec => {
            sectorCount[sec] = (sectorCount[sec] || 0) + 1;
          });
        });
        const sortedSectors = Object.entries(sectorCount)
          .sort((a, b) => b[1] - a[1])
          .map(entry => entry[0]);

        baseline = {
          gdpIndustrial: parseFloat(totalGdpIndustrial.toFixed(1)),
          gdpShare: parseFloat(totalGdpShare.toFixed(1)),
          energyConsumption: totalEnergyConsumption,
          industrialCompaniesCount: totalIndustrialCompaniesCount,
          employeeCount: totalEmployeeCount,
          energyMatrix: {
            hydroelectric: Math.round(sumHydro / divider),
            wind: Math.round(sumWind / divider),
            solar: Math.round(sumSolar / divider),
            thermal: Math.round(sumThermal / divider),
            biomassOrOther: Math.round(sumOther / divider),
          },
          mainSectors: sortedSectors.slice(0, 4), // Top 4 sectors
        };
      }
    }

    if (selectedCnaes.length > 0) {
      // Calculate CNAE-dependent factors
      let totalGdpFactor = 0;
      let totalEnergyFactor = 0;
      let totalEmployeesFactor = 0;

      selectedCnaes.forEach(cnae => {
        const isSpecializing = baseline.mainSectors ? baseline.mainSectors.includes(cnae.sector) : false;
        
        // Use a hash of the CNAE code for realistic variation
        const codeNum = parseInt(cnae.code.replace(/\D/g, "")) || 45;
        const hashVar = (codeNum % 10) / 100; // a small variation between 0.0 and 0.09
        
        const gdpBase = isSpecializing ? 0.024 : 0.004;
        const energyBase = isSpecializing ? 0.022 : 0.003;
        const employeesBase = isSpecializing ? 0.023 : 0.0035;

        totalGdpFactor += gdpBase + hashVar * 0.005;
        totalEnergyFactor += energyBase + hashVar * 0.006;
        totalEmployeesFactor += employeesBase + hashVar * 0.004;
      });

      const cap = (factor: number) => Math.min(1.0, Math.max(0.001, factor));

      const finalGdpFactor = cap(totalGdpFactor);
      const finalEnergyFactor = cap(totalEnergyFactor);
      const finalEmployeesFactor = cap(totalEmployeesFactor);

      const adjustedGdpIndustrial = Math.max(0.1, baseline.gdpIndustrial * finalGdpFactor);
      const adjustedGdpShare = Math.max(0.01, baseline.gdpShare * finalGdpFactor);
      const adjustedEnergyConsumption = Math.max(1, Math.round(baseline.energyConsumption * finalEnergyFactor));
      
      let adjustedCompanies = 0;
      selectedCnaes.forEach(cnae => {
        const specializing = baseline.mainSectors ? baseline.mainSectors.includes(cnae.sector) : false;
        const estComp = Math.max(1, Math.round((specializing ? 0.025 : 0.003) * baseline.industrialCompaniesCount));
        adjustedCompanies += estComp;
      });
      adjustedCompanies = Math.min(baseline.industrialCompaniesCount, adjustedCompanies);

      const adjustedEmployeeCount = Math.max(1, Math.round(baseline.employeeCount * finalEmployeesFactor));

      let thermShift = 0;
      let solarShift = 0;
      let windShift = 0;
      selectedCnaes.forEach(c => {
        if (c.sector.includes("Metal") || c.sector.includes("Quím") || c.sector.includes("Minerais")) {
          thermShift += 2;
        } else if (c.sector.includes("Aliment") || c.sector.includes("Têxtil")) {
          solarShift += 1.5;
          windShift += 1;
        }
      });

      let updatedHydro = baseline.energyMatrix.hydroelectric;
      let updatedWind = Math.min(100, baseline.energyMatrix.wind + Math.round(windShift));
      let updatedSolar = Math.min(100, baseline.energyMatrix.solar + Math.round(solarShift));
      let updatedThermal = Math.min(100, baseline.energyMatrix.thermal + Math.round(thermShift));
      let updatedBiomass = baseline.energyMatrix.biomassOrOther;

      const matrixSum = updatedHydro + updatedWind + updatedSolar + updatedThermal + updatedBiomass;
      if (matrixSum > 0) {
        updatedHydro = Math.round((updatedHydro / matrixSum) * 100);
        updatedWind = Math.round((updatedWind / matrixSum) * 100);
        updatedSolar = Math.round((updatedSolar / matrixSum) * 100);
        updatedThermal = Math.round((updatedThermal / matrixSum) * 100);
        updatedBiomass = 100 - (updatedHydro + updatedWind + updatedSolar + updatedThermal);
      }

      return {
        ...baseline,
        gdpIndustrial: parseFloat(adjustedGdpIndustrial.toFixed(1)),
        gdpShare: parseFloat(adjustedGdpShare.toFixed(1)),
        energyConsumption: adjustedEnergyConsumption,
        industrialCompaniesCount: adjustedCompanies,
        employeeCount: adjustedEmployeeCount,
        energyMatrix: {
          hydroelectric: updatedHydro,
          wind: updatedWind,
          solar: updatedSolar,
          thermal: updatedThermal,
          biomassOrOther: updatedBiomass,
        }
      };
    }

    return baseline;
  }, [selectedStateIds, selectedYear, selectedCnaes]);



  // Filtering the 100 CNAEs by search query
  const filteredCnaes = CNAE_100_LIST.filter(c => 
    c.code.includes(cnaeSearchQuery) || 
    c.description.toLowerCase().includes(cnaeSearchQuery.toLowerCase()) ||
    c.sector.toLowerCase().includes(cnaeSearchQuery.toLowerCase())
  );

  // Handle Chat Submit
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);
    setChatInput("");

    try {
      const chatHistoryForAPI = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatHistoryForAPI,
          currentStateId: selectedStateIds.length > 0 ? selectedStateIds.join(", ") : "Nacional",
          currentYear: selectedYear,
          currentSector: selectedSector,
          currentCnae: selectedCnaes.length > 0 ? selectedCnaes.map(c => `${c.code} - ${c.description}`).join("; ") : undefined
        })
      });

      if (!response.ok) {
        throw new Error("Erro na comunicação com o assistente inteligente.");
      }

      const data = await response.json();
      
      const botMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.text || "Desculpe, não consegui obter uma resposta satisfatória para sua dúvida.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: `⚠️ **Aviso de Conexão**: Não foi possível acessar o modelo de IA no momento. 

**Informação sobre o contexto atual:**
- **Local:** ${selectedStateIds.length > 0 ? (selectedStateIds.length === 1 ? (activeState?.name || selectedStateIds[0]) : `${selectedStateIds.length} estados selecionados`) : "Brasil (Nacional)"} (${selectedYear})
- **PIB Industrial:** R$ {formatDecimal(currentStats.gdpIndustrial, 1)} Bilhões
- **Consumo de Energia:** {formatNumber(currentStats.energyConsumption)} GWh
- **Indústrias:** {formatNumber(currentStats.industrialCompaniesCount)} empresas ativos

_Dica: Verifique se sua chave GEMINI_API_KEY está configurada no painel de Secrets da plataforma._`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Preset Questions
  const PRESET_QUESTIONS = [
    { label: "Matriz Sustentável", text: "Quais estados lideram na geração de energia eólica e solar de acordo com os dados apresentados?" },
    { label: "PIB SP vs MG", text: "Faça um comparativo estatístico detalhado entre São Paulo e Minas Gerais com relação a consumo de energia e PIB Industrial." },
    { label: "Perfil de Roraima", text: "Explique a dinâmica energética de Roraima (RR) e o motivo de sua alta porcentagem térmica." },
    { label: "Crescimento Geral", text: "Como evoluiu o PIB industrial do Brasil e o consumo energético nacional entre 2021 e 2024?" }
  ];

  // Map Filter matching states
  const filteredStatesList = statesList.filter(state => {
    const matchesRegion = selectedRegion === "Todos" || state.region === selectedRegion;
    const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          state.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          state.capital.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // Neighbor Mesh Connections for National Interconnected System (SIN)
  const SIN_CONNECTIONS = [
    { from: "AM", to: "PA" },
    { from: "PA", to: "TO" },
    { from: "AM", to: "RO" },
    { from: "AC", to: "RO" },
    { from: "MA", to: "PI" },
    { from: "PI", to: "CE" },
    { from: "CE", to: "RN" },
    { from: "RN", to: "PB" },
    { from: "PB", to: "PE" },
    { from: "PE", to: "AL" },
    { from: "AL", to: "SE" },
    { from: "SE", to: "BA" },
    { from: "BA", to: "PI" },
    { from: "BA", to: "MG" },
    { from: "MT", to: "MS" },
    { from: "MT", to: "GO" },
    { from: "GO", to: "DF" },
    { from: "GO", to: "MG" },
    { from: "MS", to: "SP" },
    { from: "MG", to: "ES" },
    { from: "MG", to: "RJ" },
    { from: "MG", to: "SP" },
    { from: "SP", to: "RJ" },
    { from: "SP", to: "PR" },
    { from: "PR", to: "SC" },
    { from: "SC", to: "RS" }
  ];

  return (
    <div id="portal-root" className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-x-hidden antialiased select-none selection:bg-orange-600 selection:text-zinc-950">
      
      {/* HEADER */}
      <header id="portal-header" className="h-16 border-b border-zinc-900 bg-zinc-900/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/20">
            <Zap className="w-5 h-5 text-zinc-950" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              PID E+ <span className="text-orange-400 font-light italic normal-case tracking-normal">Portal Industrial & Energético</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-tight uppercase">Plataforma Avançada de Telemetria e IA</p>
          </div>
        </div>

        {/* Global Live Stats Banners */}
        <div className="hidden lg:flex gap-6 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          <div className="flex flex-col border-r border-zinc-800 pr-5">
            <span className="text-[9px] text-zinc-600 font-mono">PIB IND. BRASIL ({selectedYear})</span>
            <span className="text-zinc-200 font-bold">R$ {formatDecimal(NATIONAL_STATS[selectedYear].gdpIndustrial, 1)}B <span className="text-orange-500 text-[10px] font-mono font-normal">+{formatDecimal(((NATIONAL_STATS["2024"].gdpIndustrial - NATIONAL_STATS["2021"].gdpIndustrial)/NATIONAL_STATS["2021"].gdpIndustrial * 100), 1)}%</span></span>
          </div>
          <div className="flex flex-col border-r border-zinc-800 pr-5">
            <span className="text-[9px] text-zinc-600 font-mono">CONSUMO SIN ({selectedYear})</span>
            <span className="text-zinc-200 font-bold">{formatNumber(NATIONAL_STATS[selectedYear].energyConsumption)} GWh</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-600 font-mono">MATRIZ BRASILEIRA</span>
            <span className="text-orange-400 font-bold">85.5% Renovável</span>
          </div>
        </div>

        {/* System Node Counter */}
        <div className="flex items-center gap-3 bg-zinc-950/60 px-3 py-1.5 rounded-full border border-zinc-800 text-[10px] font-mono text-zinc-400">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span>SIN OPERAÇÃO NORMAL</span>
        </div>
      </header>

      {/* CORE FRAME LAYOUT */}
      <div id="portal-body" className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT COLUMN: FILTERS AND STATES DIRECTORY */}
        <aside id="left-sidebar" className="w-full lg:w-72 bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-900 p-5 flex flex-col gap-6 shrink-0 z-20">
          
          {/* Section: Temporal Selection */}
          <section id="section-temporal" className="space-y-3">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-orange-500" />
              DIMENSÃO TEMPORAL
            </h2>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-900/60 rounded-lg border border-zinc-800">
              {["2024", "2023", "2022", "2021"].map((year) => (
                <button
                  key={year}
                  id={`btn-year-${year}`}
                  onClick={() => setSelectedYear(year)}
                  className={`py-1.5 px-1 text-center text-xs font-semibold rounded-md transition-all ${
                    selectedYear === year 
                      ? "bg-orange-600 text-zinc-950 shadow-md font-bold" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </section>

          {/* Section: Geographical Region */}
          <section id="section-region" className="space-y-3">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              REGIÃO DO BRASIL
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {BRAZIL_REGIONS.map((region) => (
                <button
                  key={region}
                  id={`btn-region-${region}`}
                  onClick={() => {
                    setSelectedRegion(region);
                    // Filter out states not belonging to the selected region
                    if (region !== "Todos") {
                      setSelectedStateIds(prev => prev.filter(stId => {
                        const stObj = statesList.find(s => s.id === stId);
                        return stObj && stObj.region === region;
                      }));
                    }
                  }}
                  className={`px-3 py-1 text-[11px] font-medium rounded-full border transition-all ${
                    selectedRegion === region
                      ? "bg-orange-950/40 text-orange-400 border-orange-500/50"
                      : "bg-zinc-900/20 text-zinc-400 border-zinc-900 hover:border-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </section>

          {/* Section: Industrial Sector Select */}
          <section id="section-sector" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                FOCO SETORIAL
              </h2>
              {selectedSector !== "Todos" && (
                <button 
                  id="btn-reset-sector"
                  onClick={() => setSelectedSector("Todos")}
                  className="text-[9px] text-orange-400 font-mono hover:underline"
                >
                  Limpar
                </button>
              )}
            </div>
            <div className="relative group">
              <select
                id="select-industrial-sector"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 cursor-pointer appearance-none"
              >
                {INDUSTRIAL_SECTORS.map((sector) => (
                  <option key={sector} value={sector} className="bg-zinc-950">
                    {sector}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500 group-hover:text-zinc-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </section>

          {/* Section: Heatmap Metric Focus Map */}
          <section id="section-heatmap-focus" className={`flex flex-col min-h-0 overflow-hidden transition-all duration-200 ${cnaeListExpanded ? "flex-1 min-h-[220px]" : "h-10 grow-0 shrink-0 mb-1"}`}>
            <div 
              id="cnae-collapse-header"
              onClick={() => setCnaeListExpanded(!cnaeListExpanded)}
              className="flex items-center justify-between shrink-0 cursor-pointer group hover:bg-zinc-900/20 p-1.5 rounded-lg select-none border border-transparent hover:border-zinc-900"
            >
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-zinc-300 transition-colors">
                <Factory className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>CNAEs Industriais ({filteredCnaes.length})</span>
                {cnaeListExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                )}
              </h2>
              <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5">
                {selectedCnaes.length > 0 && (
                  <button
                    id="btn-clear-cnae-select"
                    onClick={() => setSelectedCnaes([])}
                    className="text-[9px] text-orange-400 font-mono hover:underline uppercase"
                  >
                    Limpar Foco
                  </button>
                )}
              </div>
            </div>

            {cnaeListExpanded && (
              <div className="space-y-3 flex flex-col flex-1 min-h-0 pt-1 animate-fade-in">
                {/* Filter by search query */}
                <div className="relative shrink-0">
                  <input
                    id="search-cnae-input"
                    type="text"
                    placeholder="Filtrar por código ou descrição..."
                    value={cnaeSearchQuery}
                    onChange={(e) => setCnaeSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-8 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/40"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                  {cnaeSearchQuery && (
                    <button 
                      onClick={() => setCnaeSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-[10px] text-zinc-500 hover:text-zinc-300 font-mono focus:outline-none"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Scrollable list of CNAEs */}
                <div 
                  id="cnaes-flow-list" 
                  className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent border border-zinc-900 rounded-lg p-1.5 bg-zinc-950/40 min-h-[140px]"
                >
                  {filteredCnaes.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-600 font-mono">
                      Nenhuma atividade localizada.
                    </div>
                  ) : (
                    filteredCnaes.map((item) => {
                      const isSelected = selectedCnaes.some(c => c.code === item.code);
                      return (
                        <button
                          key={item.code}
                          id={`btn-cnae-item-${item.code.replace(".", "-").replace("/", "-")}`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCnaes(prev => prev.filter(c => c.code !== item.code));
                            } else {
                              setSelectedCnaes(prev => [...prev, item]);
                            }
                          }}
                          className={`w-full text-left p-2 rounded-md flex flex-col gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-zinc-900 border-l-2 border-orange-500 text-orange-400 font-bold"
                              : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="flex items-center gap-1.5">
                              <span className={`font-mono text-xs ${isSelected ? "text-orange-400 font-bold" : "text-zinc-500 font-medium"}`}>
                                CNAE {item.code}
                              </span>
                            </span>
                            <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono uppercase tracking-tight ${
                              isSelected ? "bg-orange-500/15 text-orange-300 border border-orange-500/20" : "bg-zinc-900 text-zinc-500 border border-zinc-900"
                            }`}>
                              {item.sector}
                            </span>
                          </div>
                          <p className={`text-[11px] leading-relaxed ${isSelected ? "text-zinc-200" : "text-zinc-400 font-light"}`}>
                            {item.description}
                          </p>
                        </button>
                      );
                    })
                  )}
                </div>

                {selectedCnaes.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-900 text-[11px] text-zinc-400 space-y-1.5 shrink-0">
                    <div className="font-mono text-orange-400 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-orange-400" />
                        CNAEs em Foco ({selectedCnaes.length})
                      </span>
                      <button 
                        onClick={() => setSelectedCnaes([])}
                        className="text-[9px] text-zinc-500 hover:text-orange-400 transition"
                      >
                        Limpar Todos
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pt-1">
                      {selectedCnaes.map(cnae => (
                        <span 
                          key={cnae.code} 
                          onClick={() => setSelectedCnaes(prev => prev.filter(c => c.code !== cnae.code))}
                          className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded cursor-pointer hover:bg-orange-500/20 flex items-center gap-1.5 transition"
                        >
                          <span>{cnae.code}</span>
                          <span className="text-[8px] opacity-70">✕</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Directory Search & State Lists */}
          <section id="section-directory" className={`flex flex-col min-h-0 overflow-hidden transition-all duration-200 ${statesListExpanded ? "flex-1 min-h-[160px]" : "h-10 grow-0 shrink-0"}`}>
            <div 
              id="states-collapse-header"
              onClick={() => setStatesListExpanded(!statesListExpanded)}
              className="flex items-center justify-between shrink-0 cursor-pointer group hover:bg-zinc-900/20 p-1.5 rounded-lg select-none border border-transparent hover:border-zinc-900"
            >
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-zinc-300 transition-colors">
                <Globe className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>ESTADOS ({filteredStatesList.length})</span>
                {statesListExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                )}
              </h2>
              <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5">
                {selectedStateIds.length > 0 && (
                  <button
                    id="btn-clear-state-select"
                    onClick={() => setSelectedStateIds([])}
                    className="text-[9px] text-orange-400 font-mono hover:underline uppercase"
                  >
                    Nacional
                  </button>
                )}
              </div>
            </div>

            {statesListExpanded && (
              <div className="space-y-3 flex flex-col flex-1 min-h-0 pt-1 animate-fade-in">
                {/* Find State Search */}
                <div className="relative shrink-0">
                  <input
                    id="search-state-input"
                    type="text"
                    placeholder="Filtrar por nome do estado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/40"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                </div>

                {/* Scrollable list of States */}
                <div id="states-flow-list" className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {/* National Vision option */}
                  <button
                    id="btn-state-national"
                    onClick={() => setSelectedStateIds([])}
                    className={`w-full text-left p-2 rounded-md flex items-center justify-between text-xs transition-all ${
                      selectedStateIds.length === 0
                        ? "bg-orange-500/10 border-l-2 border-orange-500 text-orange-400 font-black"
                        : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-orange-400" />
                      <span>VISÃO NACIONAL (BRASIL)</span>
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">BR</span>
                  </button>

                  {filteredStatesList.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-600 font-mono">
                      Nenhum estado localizado.
                    </div>
                  ) : (
                    filteredStatesList
                      .sort((a, b) => {
                        const aStats = a.history[selectedYear];
                        const bStats = b.history[selectedYear];
                        if (!aStats || !bStats) return 0;

                        if (heatmapMetric === "energy") {
                          return bStats.energyConsumption - aStats.energyConsumption;
                        } else if (heatmapMetric === "cnae") {
                          if (selectedCnaes.length > 0) {
                            const aWeight = selectedCnaes.reduce((acc, cnae) => acc + getCnaeWeight(aStats, cnae.sector), 0);
                            const bWeight = selectedCnaes.reduce((acc, cnae) => acc + getCnaeWeight(bStats, cnae.sector), 0);
                            return bWeight - aWeight;
                          } else {
                            return bStats.industrialCompaniesCount - aStats.industrialCompaniesCount;
                          }
                        } else {
                          return bStats.gdpIndustrial - aStats.gdpIndustrial;
                        }
                      })
                      .map((state) => {
                        const localYStats = state.history[selectedYear];
                        let val = "";
                        if (heatmapMetric === "energy") {
                          val = localYStats ? `${formatNumber(localYStats.energyConsumption)} GWh` : "0 GWh";
                        } else if (heatmapMetric === "cnae") {
                          if (selectedCnaes.length > 0) {
                            const estComp = selectedCnaes.reduce((acc, cnae) => {
                              const specializing = localYStats?.mainSectors.includes(cnae.sector);
                              const est = Math.max(1, Math.round((specializing ? 0.025 : 0.003) * (localYStats?.industrialCompaniesCount || 100)));
                              return acc + est;
                            }, 0);
                            val = `${formatNumber(estComp)} indústrias`;
                          } else {
                            val = localYStats ? `${formatNumber(localYStats.industrialCompaniesCount)} indústrias` : "0 indústrias";
                          }
                        } else {
                          val = localYStats ? `R$ ${formatDecimal(localYStats.gdpIndustrial, 1)}B` : "R$ 0B";
                        }

                        const isSelected = selectedStateIds.includes(state.id);

                        return (
                          <button
                            key={state.id}
                            id={`btn-state-list-${state.id}`}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedStateIds(prev => prev.filter(id => id !== state.id));
                              } else {
                                setSelectedStateIds(prev => [...prev, state.id]);
                              }
                            }}
                            onMouseEnter={() => setHoveredStateId(state.id)}
                            onMouseLeave={() => setHoveredStateId(null)}
                            className={`w-full text-left p-2 rounded-md flex items-center justify-between text-xs transition-all ${
                              isSelected
                                ? "bg-zinc-900 border-l-2 border-orange-500 text-orange-400 font-bold"
                                : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isSelected 
                                  ? "bg-orange-400" 
                                  : state.region === "Nordeste" ? "bg-cyan-500"
                                  : state.region === "Sul" ? "bg-fuchsia-500"
                                  : state.region === "Sudeste" ? "bg-teal-500"
                                  : state.region === "Norte" ? "bg-blue-400"
                                  : "bg-amber-500"
                              }`} />
                              <span className="truncate">{state.name}</span>
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-mono text-zinc-500">{val}</span>
                              <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-zinc-900 text-zinc-400 select-none">
                                {state.id}
                              </span>
                            </div>
                          </button>
                        );
                      })
                  )}
                </div>
              </div>
            )}
          </section>
        </aside>

        {/* CONTAINER 2: CENTER AREA (MAP & CHARTS) */}
        <main id="center-main-panel" className="flex-1 bg-zinc-950 p-4 lg:p-6 flex flex-col gap-6 overflow-y-auto overflow-x-hidden z-10 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          
          {/* Section header & search telemetry status */}
          <div id="telemetry-info-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
            <div>
              <div className="text-xs text-zinc-500 font-mono tracking-wider uppercase flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-zinc-500" />
                Telemetria Regional / Visualização de Fluxo
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-1 flex items-center gap-2 text-zinc-100">
                {activeState ? (
                  <>
                    <MapPin className="w-5 h-5 text-orange-400" />
                    {activeState.name} ({activeState.id})
                    <span className="text-xs font-mono font-normal uppercase text-zinc-500 italic bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                      Região {activeState.region} • Capital {activeState.capital}
                    </span>
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5 text-orange-400 animate-spin-slow" />
                    Brasil — Consolidação Nacional
                    <span className="text-xs font-mono font-normal uppercase text-zinc-500 italic bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                      Conexão SIN • 26 Estados + DF
                    </span>
                  </>
                )}
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-900 text-xs">
              <span className="text-zinc-500 font-mono italic">Escalonado por:</span>
              <span className="font-mono font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                {heatmapMetric === "energy" 
                  ? "Consumo Energético" 
                  : heatmapMetric === "cnae"
                  ? (selectedCnaes.length > 0 ? (selectedCnaes.length === 1 ? `CNAE ${selectedCnaes[0].code}` : `${selectedCnaes.length} CNAEs Focados`) : "Todos os CNAEs")
                  : "PIB Industrial"}
              </span>
            </div>
          </div>

          {/* TELEMETRY CARDS PANEL */}
          <div id="telemetry-widgets-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Widget 1: GDP */}
            <div id="widget-card-pib" className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-4 relative overflow-hidden transition-all hover:border-zinc-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-450/5 via-transparent to-transparent pointer-events-none" />
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">PIB Industrial</span>
                <TrendingUp className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono tracking-tight text-zinc-100">
                  R$ {formatDecimal(currentStats?.gdpIndustrial, 1)}
                </span>
                <span className="text-sm font-semibold text-zinc-400 font-mono">Bilhões</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Parc. Nacional</span>
                <span className="text-orange-400 font-mono font-bold bg-orange-500/10 px-1.5 py-0.2 rounded">
                  {formatDecimal(currentStats?.gdpShare, 1)}%
                </span>
              </div>
            </div>

            {/* Widget 2: Energy Consumption */}
            <div id="widget-card-energy" className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-4 relative overflow-hidden transition-all hover:border-zinc-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-600/5 via-transparent to-transparent pointer-events-none" />
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono font-bold">Consumo de Energia</span>
                <Zap className="w-4 h-4 text-orange-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono tracking-tight text-orange-500">
                  {formatNumber(currentStats?.energyConsumption)}
                </span>
                <span className="text-sm font-semibold text-zinc-500 font-mono">GWh</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500 font-mono">Setores Industriais</span>
                <span className="text-orange-400 text-[10px] font-semibold bg-orange-500/10 px-1.5 py-0.2 rounded italic">
                  Foco: {selectedSector}
                </span>
              </div>
            </div>

            {/* Widget 3: Active Industries */}
            <div id="widget-card-industries" className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-4 relative overflow-hidden transition-all hover:border-zinc-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Indústrias Ativas</span>
                <Factory className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono tracking-tight text-zinc-100">
                  {formatNumber(currentStats?.industrialCompaniesCount)}
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 font-mono uppercase">Unidades</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Média setorial</span>
                <span className="text-zinc-300 font-mono">Estável</span>
              </div>
            </div>

            {/* Widget 4: Employees Count */}
            <div id="widget-card-employees" className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-4 relative overflow-hidden transition-all hover:border-zinc-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Empregos Industriais</span>
                <Users className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono tracking-tight text-zinc-100">
                  {formatNumber(currentStats?.employeeCount)}
                </span>
                <span className="text-xs font-semibold text-zinc-400 font-mono">mil</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Média geral</span>
                <span className="text-fuchsia-400 font-mono font-bold bg-fuchsia-500/10 px-1.5 py-0.2 rounded">
                  {formatNumber(Math.round(((currentStats?.employeeCount || 1) / (currentStats?.industrialCompaniesCount || 1) * 1000)))} emp/ind
                </span>
              </div>
            </div>

          </div>

          {/* TELEMETRY MAP STAGE CONTAINER */}
          <div id="telemetry-stage-wrapper" className="flex-1 min-h-[460px] lg:min-h-[500px] rounded-2xl bg-zinc-900/40 border border-zinc-900 flex flex-col relative overflow-hidden">
            
            {/* Top Bar overlays */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
              <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-lg backdrop-blur-sm pointer-events-auto">
                <Compass className="w-3.5 h-3.5 text-orange-400 animate-spin-slow" />
                <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-tight">
                  {selectedRegion === "Todos" ? "Todo o Brasil" : `Região ${selectedRegion}`} selecionada
                </span>
              </div>

              {/* Legend of Intensity */}
              <div className="hidden sm:flex items-center gap-3 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-lg backdrop-blur-sm pointer-events-auto">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight">Densidade:</span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-zinc-600 font-mono">Mín</span>
                  <div className="w-16 h-2 rounded bg-gradient-to-right from-zinc-800 to-orange-500" />
                  <span className="text-[9px] text-zinc-300 font-mono">Máx</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE GEOGRAPHIC SVG CANVAS */}
            <div className="flex-1 w-full relative flex items-start justify-center p-4 min-h-[460px]">
              <svg 
                id="interactive-brazil-map-svg"
                viewBox="0 0 800 800" 
                className="w-full h-full max-w-[550px] max-h-[550px] transform transition-all duration-500 relative z-10"
              >
                {/* 1. REGIONAL AMBIENT GLOW BACKDROPS */}
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="30" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <radialGradient id="region-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Sub regional glow spots mapped contextually */}
                <circle cx="500" cy="560" r="140" fill="url(#region-glow)" opacity="0.65" pointerEvents="none" /> {/* Sudeste */}
                <circle cx="600" cy="280" r="130" fill="url(#region-glow)" opacity="0.4" pointerEvents="none" />  {/* Nordeste */}
                <circle cx="280" cy="180" r="180" fill="url(#region-glow)" opacity="0.25" pointerEvents="none" /> {/* Norte */}

                {/* 2. SIN SYSTEM INTERCONNECTION PATHS MESH */}
                <g id="sin-connection-lines">
                  {SIN_CONNECTIONS.map((conn, idx) => {
                    const sFrom = statesList.find(s => s.id === conn.from);
                    const sTo = statesList.find(s => s.id === conn.to);
                    if (!sFrom || !sTo) return null;

                    // Compute node highlighting or connectivity status
                    const isFromSelected = selectedStateIds.includes(conn.from);
                    const isToSelected = selectedStateIds.includes(conn.to);
                    const isFromHovered = hoveredStateId === conn.from;
                    const isToHovered = hoveredStateId === conn.to;
                    
                    const isHighlighted = isFromSelected || isToSelected;
                    const isHovered = isFromHovered || isToHovered;

                    return (
                      <line
                        key={`line-${idx}`}
                        x1={sFrom.mapCoords.x}
                        y1={sFrom.mapCoords.y}
                        x2={sTo.mapCoords.x}
                        y2={sTo.mapCoords.y}
                        className={`transition-all duration-300 stroke-zinc-800 ${
                          isHovered 
                            ? "stroke-orange-400 stroke-[2] opacity-80" 
                            : isHighlighted 
                            ? "stroke-orange-500 stroke-[1.8] opacity-60" 
                            : "stroke-[1] opacity-20 pointer-events-none"
                        }`}
                        strokeWidth={isHovered ? 2 : isHighlighted ? 1.5 : 1}
                        strokeDasharray={isHovered ? "5, 5" : "none"}
                      />
                    );
                  })}
                </g>

                {/* 3. ACTIVE GEOGRAPHICAL NODES */}
                <g id="states-map-nodes">
                  {statesList.map((state) => {
                    const localYStats = state.history[selectedYear];
                    if (!localYStats) return null;

                    // Filter rendering based on user highlighted region
                    const isWithinFilteredRegion = selectedRegion === "Todos" || state.region === selectedRegion;
                    
                    // Determine radius relative to proportional share
                    let evaluationFactor = 0;
                    if (heatmapMetric === "energy") {
                      evaluationFactor = localYStats.energyConsumption / maxEnergy;
                    } else if (heatmapMetric === "cnae") {
                      if (selectedCnaes.length > 0) {
                        const estComp = selectedCnaes.reduce((acc, cnae) => {
                          const specializing = localYStats.mainSectors?.includes(cnae.sector);
                          const est = Math.max(1, Math.round((specializing ? 0.025 : 0.003) * localYStats.industrialCompaniesCount));
                          return acc + est;
                        }, 0);
                        evaluationFactor = estComp / maxCnaeCompanies;
                      } else {
                        const maxCompaniesCount = Math.max(...statesList.map(s => s.history[selectedYear]?.industrialCompaniesCount || 1));
                        evaluationFactor = localYStats.industrialCompaniesCount / maxCompaniesCount;
                      }
                    } else {
                      evaluationFactor = localYStats.gdpIndustrial / maxGdp;
                    }

                    // Min size 12px, Max 46px
                    const nodeRadius = 12 + (evaluationFactor * 34);

                    // Energy Matrix check to configure color core
                    const renewRatio = (localYStats.energyMatrix.hydroelectric + localYStats.energyMatrix.wind + localYStats.energyMatrix.solar) / 100;
                    
                    const isSelected = selectedStateIds.includes(state.id);
                    const isHovered = hoveredStateId === state.id;

                    // Color selection based on environmental matrices
                    const nodeColorClass = renewRatio > 0.8
                      ? "fill-orange-600" 
                      : renewRatio > 0.6
                      ? "fill-orange-500"
                      : "fill-orange-400"; // Hydro/Solar/Wind-focused vs balanced thermal

                    return (
                      <g 
                        key={state.id}
                        id={`map-node-group-${state.id}`}
                        onClick={() => {
                          setSelectedStateIds(prev => {
                            if (prev.includes(state.id)) {
                              return prev.filter(id => id !== state.id);
                            } else {
                              return [...prev, state.id];
                            }
                          });
                        }}
                        onMouseEnter={() => setHoveredStateId(state.id)}
                        onMouseLeave={() => setHoveredStateId(null)}
                        className={`cursor-pointer transition-all duration-300 ${
                          !isWithinFilteredRegion ? "opacity-15 pointer-events-none" : "opacity-100"
                        }`}
                        transform={`translate(${state.mapCoords.x}, ${state.mapCoords.y})`}
                      >
                        {/* Outer interactive halo */}
                        <circle
                          r={nodeRadius + 18}
                          className="fill-transparent stroke-transparent"
                        />

                        {/* Pulsing ring during selection or hovering */}
                        {(isSelected || isHovered) && (
                          <circle
                            r={nodeRadius + 8}
                            className={`fill-none stroke-orange-500/40 stroke-2 animate-pulse-slow`}
                          />
                        )}

                        {/* Highlight Ring for GDP/Energy scaling */}
                        <circle
                          r={nodeRadius}
                          className={`fill-zinc-900 border transition-all duration-300 ${
                            isSelected 
                              ? "stroke-orange-400 stroke-2 shadow-[0_0_15px_rgba(249,115,22,0.5)]" 
                              : isHovered
                              ? "stroke-zinc-300 stroke-[1.5]"
                              : "stroke-zinc-700/60 stroke-[1]"
                          }`}
                        />

                        {/* Density core indicator */}
                        <circle
                          r={isSelected || isHovered ? Math.max(nodeRadius * 0.45, 6) : Math.max(nodeRadius * 0.3, 4)}
                          className={`transition-all duration-300 ${nodeColorClass} drop-shadow-[0_0_5px_rgba(249,115,22,0.3)]`}
                        />

                        {/* Label */}
                        <text
                          y={nodeRadius + 14}
                          className={`text-[10px] font-mono select-none font-semibold text-center uppercase tracking-tight text-zinc-300 transition-all ${
                            isSelected 
                              ? "fill-orange-400 font-bold scale-110" 
                              : isHovered 
                              ? "fill-zinc-100" 
                              : "fill-zinc-500"
                          }`}
                          textAnchor="middle"
                        >
                          {state.id}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Floating State Telemetry Box on Map */}
              <div 
                id="floating-overlay-widget"
                className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-4 bg-zinc-950/90 border border-zinc-900 rounded-xl backdrop-blur-md shadow-2xl z-20 transition-all duration-300"
              >
                {hoveredStateId || selectedStateIds.length > 0 ? (
                  (() => {
                    const activeOverlayStateId = hoveredStateId || (selectedStateIds.length === 1 ? selectedStateIds[0] : null);

                    if (activeOverlayStateId) {
                      const stateObj = statesList.find(s => s.id === activeOverlayStateId);
                      if (!stateObj) return null;
                      const data = stateObj.history[selectedYear];
                      if (!data) return null;
                      const renewRatio = (data.energyMatrix.hydroelectric + data.energyMatrix.wind + data.energyMatrix.solar).toFixed(0);

                      return (
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Telemetria em Tempo Real</span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                              Number(renewRatio) > 80 ? "bg-orange-600/10 text-orange-500" : "bg-orange-400/10 text-orange-400"
                            }`}>
                              {renewRatio}% Renovável
                            </span>
                          </div>
                          <div className="mt-1 flex items-baseline gap-2">
                            <h4 className="text-sm font-black text-zinc-100">{stateObj.name}</h4>
                            <span className="text-xs text-zinc-500 font-mono">({stateObj.id})</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Capital: {stateObj.capital} | Região {stateObj.region}</p>
                          
                          <div className="border-t border-zinc-900 mt-2 pt-2 grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-[9px] text-zinc-500 block italic font-normal">PIB Industrial</span>
                              <span className="font-mono font-bold text-zinc-100">R$ {formatDecimal(data.gdpIndustrial, 1)}B</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 block italic font-normal">Consumo de Energia</span>
                              <span className="font-mono font-bold text-orange-400">{formatNumber(data.energyConsumption)} GWh</span>
                            </div>
                          </div>

                          {heatmapMetric === "cnae" && selectedCnaes.length > 0 && (
                            <div className="border-t border-zinc-900 mt-2 pt-2 text-[11px] space-y-1">
                              <span className="text-[9px] text-zinc-500 block italic leading-tight">Atividade CNAEs ({selectedCnaes.length}):</span>
                              <div className="max-h-20 overflow-y-auto space-y-1">
                                {selectedCnaes.map(cnae => {
                                  const hasSector = data.mainSectors?.includes(cnae.sector);
                                  const count = Math.max(1, Math.round((hasSector ? 0.025 : 0.003) * data.industrialCompaniesCount));
                                  return (
                                    <div key={cnae.code} className="flex items-center justify-between gap-1 text-[10px]">
                                      <span className="font-mono text-zinc-440 truncate max-w-[140px]" title={cnae.description}>{cnae.code} - {cnae.description}</span>
                                      <span className="font-mono text-orange-400 font-semibold">{formatNumber(count)} ind.</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="mt-2 text-[9px] text-zinc-500 italic bg-zinc-900/60 p-1.5 rounded flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            <span>Clique para {selectedStateIds.includes(stateObj.id) ? "remover" : "adicionar"} este estado do foco.</span>
                          </div>
                        </div>
                      );
                    } else {
                      const renewRatio = (currentStats.energyMatrix.hydroelectric + currentStats.energyMatrix.wind + currentStats.energyMatrix.solar).toFixed(0);
                      return (
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Foco Multi-Estados</span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-orange-500/10 text-orange-400">
                              {renewRatio}% Renovável (Méd)
                            </span>
                          </div>
                          <div className="mt-1">
                            <h4 className="text-sm font-black text-zinc-100">{selectedStateIds.length} Estados Selecionados</h4>
                            <div className="flex flex-wrap gap-1 mt-1.5 max-h-16 overflow-y-auto">
                              {selectedStateIds.map(stId => (
                                <span 
                                  key={stId} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStateIds(prev => prev.filter(id => id !== stId));
                                  }}
                                  className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-sm text-[9px] font-mono cursor-pointer hover:bg-orange-500/25 flex items-center gap-1"
                                >
                                  {stId} ✕
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border-t border-zinc-900 mt-2 pt-2 grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-[9px] text-zinc-500 block italic">PIB Acumulado</span>
                              <span className="font-mono font-bold text-zinc-100 font-bold">R$ {formatDecimal(currentStats.gdpIndustrial, 1)}B</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 block italic font-normal">Consumo Total</span>
                              <span className="font-mono font-bold text-orange-400">{formatNumber(currentStats.energyConsumption)} GWh</span>
                            </div>
                          </div>

                          {heatmapMetric === "cnae" && selectedCnaes.length > 0 && (
                            <div className="border-t border-zinc-900 mt-2 pt-2 text-[11px] space-y-1">
                              <span className="text-[9px] text-zinc-500 block italic leading-tight font-normal">Empresas por CNAE estimadas:</span>
                              <div className="max-h-20 overflow-y-auto space-y-1">
                                {selectedCnaes.map(cnae => {
                                  const totalEst = selectedStateIds.reduce((acc, stId) => {
                                    const stObj = statesList.find(s => s.id === stId);
                                    const stats = stObj?.history[selectedYear];
                                    if (!stats) return acc;
                                    const specializes = stats.mainSectors?.includes(cnae.sector);
                                    const est = Math.max(1, Math.round((specializes ? 0.025 : 0.003) * stats.industrialCompaniesCount));
                                    return acc + est;
                                  }, 0);
                                  return (
                                    <div key={cnae.code} className="flex items-center justify-between gap-1 text-[10px]">
                                      <span className="font-mono text-zinc-400 truncate max-w-[140px]">{cnae.code} - {cnae.description}</span>
                                      <span className="font-mono text-orange-400 font-semibold">{formatNumber(totalEst)} ind.</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })()
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Análise Consolidada</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-orange-500/10 text-orange-400">
                        85.5% Limpa
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-100 mt-1">Brasil (Consolidado SIN)</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">Regeneração e Redirecionamento Integrado</p>
                    
                    <div className="border-t border-zinc-900 mt-2 pt-2 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[9px] text-zinc-500 block">PIB Industrial Tot.</span>
                        <span className="font-mono font-bold text-zinc-100">R$ {formatDecimal(NATIONAL_STATS[selectedYear].gdpIndustrial, 1)}B</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block">Consumo SIN Tot.</span>
                        <span className="font-mono font-bold text-orange-400">{formatNumber(NATIONAL_STATS[selectedYear].energyConsumption)} GWh</span>
                      </div>
                    </div>

                    {heatmapMetric === "cnae" && selectedCnaes.length > 0 && (
                      <div className="border-t border-zinc-900 mt-2 pt-2 text-[11px] space-y-1">
                        <span className="text-[9px] text-zinc-500 block italic leading-tight">CNAEs em Foco ({selectedCnaes.length}):</span>
                        <p className="text-[10px] text-orange-400 leading-relaxed font-mono font-bold bg-orange-500/5 p-1 rounded border border-orange-500/10 max-h-16 overflow-y-auto">
                          {selectedCnaes.map(c => `${c.code}`).join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* LOWER ANALYSIS DETAILS PANEL: ENERGY MATRIX COMPOSITION & SECTORS */}
          <div id="matrix-detailed-tabs" className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/10 border border-zinc-900 p-5 rounded-2xl relative overflow-hidden">
            
            {/* Column A: Energy Matrix analysis */}
            <div id="energy-matrix-breakdown" className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center justify-between">
                <span>Composição da Matriz Elétrica ({selectedYear})</span>
                <span className="text-[10px] font-mono text-orange-400 font-normal">Foco: {activeState ? activeState.name : "Nacional"}</span>
              </h3>

              <div className="space-y-3">
                {/* 1. Hydroelectric */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                      <Droplets className="w-3.5 h-3.5 text-orange-300" />
                      Energia Hidrelétrica
                    </span>
                    <span className="font-mono font-bold text-orange-300">{currentStats?.energyMatrix?.hydroelectric}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full w-full overflow-hidden">
                    <div 
                      className="bg-orange-400 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${currentStats?.energyMatrix?.hydroelectric}%` }} 
                    />
                  </div>
                </div>

                {/* 2. Wind */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" />
                      Energia Eólica
                    </span>
                    <span className="font-mono font-bold text-cyan-400">{currentStats?.energyMatrix?.wind}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full w-full overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${currentStats?.energyMatrix?.wind}%` }} 
                    />
                  </div>
                </div>

                {/* 3. Solar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                      <Sun className="w-3.5 h-3.5 text-yellow-400" />
                      Energia Solar Fotovoltaica
                    </span>
                    <span className="font-mono font-bold text-yellow-500">{currentStats?.energyMatrix?.solar}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full w-full overflow-hidden">
                    <div 
                      className="bg-yellow-400 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${currentStats?.energyMatrix?.solar}%` }} 
                    />
                  </div>
                </div>

                {/* 4. Thermal */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      Térmica (Fósseis / Gás)
                    </span>
                    <span className="font-mono font-bold text-orange-400">{currentStats?.energyMatrix?.thermal}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full w-full overflow-hidden">
                    <div 
                      className="bg-orange-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${currentStats?.energyMatrix?.thermal}%` }} 
                    />
                  </div>
                </div>

                {/* 5. Biomass */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                      <Globe className="w-3.5 h-3.5 text-orange-500" />
                      Biomassa, Co-geração e Agroindústria
                    </span>
                    <span className="font-mono font-bold text-orange-500">{currentStats?.energyMatrix?.biomassOrOther}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full w-full overflow-hidden">
                    <div 
                      className="bg-orange-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${currentStats?.energyMatrix?.biomassOrOther}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Column B: Sectors and regional details */}
            <div id="sectors-and-regional-breakdown" className="space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  Principais Segmentos do Polo Industrial ({selectedYear})
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Sectores de relevância econômica em maior ritmo de consumo ou investimentos:
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {currentStats?.mainSectors?.map((s) => (
                    <span 
                      key={s} 
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        selectedSector === s 
                          ? "bg-orange-500/15 text-orange-400 border-orange-500/40" 
                          : "bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                  {currentStats?.mainSectors?.length === 0 && (
                    <div className="text-xs text-zinc-600 font-mono italic">
                      Nenhum setor registrado.
                    </div>
                  )}
                </div>
              </div>

              {/* Action insight box */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                  <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                  Insight de Transição Energética
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {activeState 
                    ? `O polo de ${activeState.name} apresenta uma taxa de energia renovável integrada (Limpa: hidrelétrica, eólica e solar fotovoltaica) de ${
                        formatDecimal((currentStats?.energyMatrix?.hydroelectric + currentStats?.energyMatrix?.wind + currentStats?.energyMatrix?.solar), 1)
                      }%.` 
                    : "No plano nacional, a participação combinada das plantas eolianas de grande porte e parques solares já configura mais de 30% da energia consumida nos polos industriais brasileiros, reduzindo drasticas emissões indiretas."}
                </p>
              </div>
            </div>

          </div>

        </main>

        {/* CONTAINER 3: RIGHT PANEL (CONVERSATIONAL AI CHATBOT) */}
        <aside 
          id="right-sidebar" 
          className={`fixed right-4 top-4 bottom-4 left-4 sm:left-auto sm:w-[400px] bg-zinc-950/95 border border-zinc-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col shrink-0 z-[90] transition-all duration-300 transform backdrop-blur-md ${
            isChatOpen 
              ? "translate-x-0 opacity-100 scale-100" 
              : "translate-x-12 opacity-0 scale-95 pointer-events-none"
          }`}
        >
          
          {/* Conversational Assistant Header */}
          <div className="p-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/10">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-200">
                  Assistente IA de Dados
                </h3>
                <p className="text-[9px] text-zinc-500 font-mono">Conexão Estrita com Banco Local</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 1 && (
                <button
                  id="btn-clear-chat"
                  onClick={() => setMessages([
                    {
                      id: "welcome",
                      role: "assistant",
                      content: "Histórico redefinido. Como posso analisar os dados industriais e energéticos do Brasil agora?",
                      timestamp: new Date()
                    }
                  ])}
                  className="text-[9px] text-zinc-500 hover:text-zinc-300 font-mono flex items-center gap-1 hover:underline mr-1"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Limpar
                </button>
              )}
              {/* COMPRESS BUTTON */}
              <button 
                id="btn-close-chat-sidebar"
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-800 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                title="Comprimir chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ACTIVE FILTER ADVISORY BANNER FOR AI */}
          <div className="px-5 py-2.5 bg-zinc-900/40 border-b border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-orange-400" />
              Estado em foco no Chat:
            </span>
            <span className="font-bold text-zinc-200">
              {activeState ? `${activeState.id} (${selectedYear})` : `Nacional (${selectedYear})`}
            </span>
          </div>

          {/* CHAT MESSAGES PANEL */}
          <div id="chat-messages-scroll-area" className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div className="text-[9px] font-mono tracking-tight text-zinc-600 flex items-center gap-1">
                  {msg.role === "assistant" ? (
                    <>
                      <Sparkles className="w-2.5 h-2.5 text-orange-500" />
                      <span>INTEL_BOT</span>
                    </>
                  ) : (
                    <span>ANALISTA_USUÁRIO</span>
                  )}
                  <span>• {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div 
                  className={`max-w-[90%] text-xs p-3.5 rounded-xl leading-relaxed whitespace-pre-line border ${
                    msg.role === "user"
                      ? "bg-orange-950/20 border-orange-900/40 text-zinc-200 rounded-tr-none"
                      : "bg-zinc-900/40 border-zinc-900 text-zinc-300 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing dynamic loading spacer */}
            {isChatLoading && (
              <div className="flex flex-col gap-1 items-start">
                <div className="text-[9px] font-mono text-zinc-600 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-orange-400 animate-spin" />
                  <span>INTEL_BOT PROCESSANDO...</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl rounded-tl-none p-3.5 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* CHAT INPUT AREA */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex flex-col gap-3 shrink-0">
            {/* Quick helper buttons */}
            <div id="quick-preset-questions" className="flex flex-wrap gap-1.5">
              {PRESET_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  id={`preset-question-${idx}`}
                  onClick={() => handleSendMessage(q.text)}
                  className="text-[9px] bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 px-2 py-1 rounded text-zinc-400 hover:text-zinc-200 cursor-pointer transition-all uppercase font-mono tracking-tight"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Main user input field wrapper */}
            <div className="space-y-1.5">
              <label htmlFor="chatbot-main-input" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <span>Sua conversa com o assistente:</span>
              </label>
              <form 
                id="chatbot-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (chatInput.trim() && !isChatLoading) {
                    handleSendMessage(chatInput);
                  }
                }}
                className="relative flex items-end gap-2 bg-zinc-900 border border-zinc-800 focus-within:border-orange-500/55 rounded-xl p-1.5 transition-all"
              >
                <textarea
                  id="chatbot-main-input"
                  placeholder="Pergunte sobre os dados do portal ou converse com a IA..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (chatInput.trim() && !isChatLoading) {
                        handleSendMessage(chatInput);
                      }
                    }
                  }}
                  disabled={isChatLoading}
                  rows={2}
                  className="flex-1 bg-transparent py-1.5 pl-2.5 pr-10 text-xs text-zinc-200 focus:outline-none placeholder-zinc-500 disabled:opacity-50 resize-none min-h-[48px] max-h-[160px] leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800"
                />
                <button 
                  id="chatbot-submit-button"
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  title="Enviar mensagem"
                  className="absolute right-2 bottom-2 p-1.5 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-zinc-950 rounded-lg disabled:opacity-20 transition-all cursor-pointer flex items-center justify-center w-8 h-8 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </aside>

        {/* BIG FAB TRIGGER BUTTON */}
        <button
          id="btn-toggle-chat"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full shadow-[0_10px_35px_rgba(249,115,22,0.35)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border ${
            isChatOpen 
              ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-850 hover:text-white" 
              : "bg-orange-500 text-zinc-950 border-orange-400 hover:bg-orange-400"
          }`}
          title={isChatOpen ? "Fechar Assistente IA" : "Falar com Assistente IA"}
        >
          {isChatOpen ? (
            <X className="w-5.5 h-5.5" strokeWidth={2.5} />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-5.5 h-5.5" strokeWidth={2.2} />
              {/* Pulsing indicator badge */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400"></span>
              </span>
            </div>
          )}
        </button>

      </div>

      {/* FOOTER SYSTEM STATUS */}
      <footer id="portal-footer" className="h-8 border-t border-zinc-900 bg-zinc-950 px-6 shrink-0 flex items-center justify-between text-[9px] uppercase tracking-widest text-zinc-600">
        <div className="flex items-center gap-4">
          <span>FONTE: ONS / IBGE / MINISTÉRIO DE MINAS E ENERGIA</span>
          <span className="hidden md:inline font-mono">ÚLTIMA ATUALIZAÇÃO SÉRIE: JUNHO 2024</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-500">
          <CheckCircle2 className="w-3 h-3 text-orange-400" />
          <span>Sincronizado via Backend SEGURO com Gemini 3.5-flash</span>
        </div>
      </footer>

    </div>
  );
}
