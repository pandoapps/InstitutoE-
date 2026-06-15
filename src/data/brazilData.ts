export interface StateYearData {
  gdpIndustrial: number; // em Bilhões de Reais
  gdpShare: number; // % do PIB industrial nacional
  energyConsumption: number; // em GWh (Consumo Industrial de Energia)
  industrialCompaniesCount: number; // quantidade de indústrias ativas
  employeeCount: number; // número de empregados em milhares
  energyMatrix: {
    hydroelectric: number; // %
    wind: number; // %
    solar: number; // %
    thermal: number; // %
    biomassOrOther: number; // %
  };
  mainSectors: string[];
}

export interface StateData {
  id: string; // Sigla (ex: "SP")
  name: string; // Nome Completo (ex: "São Paulo")
  region: "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
  capital: string;
  // Coordenadas aproximadas para renderização SVG (Proporção do mapa do Brasil)
  // Baseado em um canvas 800x800
  mapCoords: { x: number; y: number };
  // Caminho simplificado do contorno do estado para o mapa SVG interativo
  svgPath?: string; 
  history: {
    [year: string]: StateYearData;
  };
}

export const BRAZIL_REGIONS = ["Todos", "Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;

export const INDUSTRIAL_SECTORS = [
  "Todos",
  "Alimentos e Bebidas",
  "Automotivo",
  "Química e Petroquímica",
  "Metalurgia e Siderurgia",
  "Têxtil e Calçados",
  "Celulose e Papel",
  "Eletroeletrônicos",
  "Mineração (Extrativa)",
  "Construção Civil"
] as const;

export const brazilStatesData: StateData[] = [
  {
    id: "SP",
    name: "São Paulo",
    region: "Sudeste",
    capital: "São Paulo",
    mapCoords: { x: 500, y: 560 },
    history: {
      "2024": {
        gdpIndustrial: 195.4,
        gdpShare: 29.5,
        energyConsumption: 42100,
        industrialCompaniesCount: 52100,
        employeeCount: 1650,
        energyMatrix: { hydroelectric: 45, wind: 5, solar: 15, thermal: 15, biomassOrOther: 20 },
        mainSectors: ["Automotivo", "Química e Petroquímica", "Alimentos e Bebidas", "Eletroeletrônicos"]
      },
      "2023": {
        gdpIndustrial: 188.2,
        gdpShare: 29.8,
        energyConsumption: 41200,
        industrialCompaniesCount: 51200,
        employeeCount: 1610,
        energyMatrix: { hydroelectric: 48, wind: 4, solar: 12, thermal: 16, biomassOrOther: 20 },
        mainSectors: ["Automotivo", "Química e Petroquímica", "Alimentos e Bebidas"]
      },
      "2022": {
        gdpIndustrial: 179.5,
        gdpShare: 30.1,
        energyConsumption: 40500,
        industrialCompaniesCount: 50400,
        employeeCount: 1580,
        energyMatrix: { hydroelectric: 52, wind: 3, solar: 8, thermal: 17, biomassOrOther: 20 },
        mainSectors: ["Automotivo", "Química e Petroquímica", "Alimentos e Bebidas"]
      },
      "2021": {
        gdpIndustrial: 168.0,
        gdpShare: 30.5,
        energyConsumption: 39800,
        industrialCompaniesCount: 49800,
        employeeCount: 1540,
        energyMatrix: { hydroelectric: 55, wind: 2, solar: 5, thermal: 18, biomassOrOther: 20 },
        mainSectors: ["Automotivo", "Química e Petroquímica", "Alimentos e Bebidas"]
      }
    }
  },
  {
    id: "MG",
    name: "Minas Gerais",
    region: "Sudeste",
    capital: "Belo Horizonte",
    mapCoords: { x: 530, y: 460 },
    history: {
      "2024": {
        gdpIndustrial: 78.6,
        gdpShare: 11.8,
        energyConsumption: 24500,
        industrialCompaniesCount: 24500,
        employeeCount: 780,
        energyMatrix: { hydroelectric: 65, wind: 2, solar: 20, thermal: 5, biomassOrOther: 8 },
        mainSectors: ["Mineração (Extrativa)", "Metalurgia e Siderurgia", "Alimentos e Bebidas", "Automotivo"]
      },
      "2023": {
        gdpIndustrial: 74.8,
        gdpShare: 11.9,
        energyConsumption: 23800,
        industrialCompaniesCount: 23900,
        employeeCount: 760,
        energyMatrix: { hydroelectric: 68, wind: 2, solar: 16, thermal: 6, biomassOrOther: 8 },
        mainSectors: ["Mineração (Extrativa)", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      },
      "2022": {
        gdpIndustrial: 71.2,
        gdpShare: 12.0,
        energyConsumption: 23100,
        industrialCompaniesCount: 23300,
        employeeCount: 740,
        energyMatrix: { hydroelectric: 72, wind: 1, solar: 12, thermal: 7, biomassOrOther: 8 },
        mainSectors: ["Mineração (Extrativa)", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      },
      "2021": {
        gdpIndustrial: 65.5,
        gdpShare: 11.9,
        energyConsumption: 22600,
        industrialCompaniesCount: 22800,
        employeeCount: 710,
        energyMatrix: { hydroelectric: 76, wind: 1, solar: 8, thermal: 7, biomassOrOther: 8 },
        mainSectors: ["Mineração (Extrativa)", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      }
    }
  },
  {
    id: "RJ",
    name: "Rio de Janeiro",
    region: "Sudeste",
    capital: "Rio de Janeiro",
    mapCoords: { x: 580, y: 520 },
    history: {
      "2024": {
        gdpIndustrial: 61.2,
        gdpShare: 9.2,
        energyConsumption: 14200,
        industrialCompaniesCount: 16100,
        employeeCount: 410,
        energyMatrix: { hydroelectric: 15, wind: 1, solar: 4, thermal: 70, biomassOrOther: 10 },
        mainSectors: ["Química e Petroquímica", "Metalurgia e Siderurgia", "Mineração (Extrativa)", "Construção Civil"]
      },
      "2023": {
        gdpIndustrial: 58.4,
        gdpShare: 9.3,
        energyConsumption: 13900,
        industrialCompaniesCount: 15800,
        employeeCount: 395,
        energyMatrix: { hydroelectric: 18, wind: 1, solar: 3, thermal: 68, biomassOrOther: 10 },
        mainSectors: ["Química e Petroquímica", "Metalurgia e Siderurgia", "Mineração (Extrativa)"]
      },
      "2022": {
        gdpIndustrial: 55.1,
        gdpShare: 9.2,
        energyConsumption: 13500,
        industrialCompaniesCount: 15400,
        employeeCount: 380,
        energyMatrix: { hydroelectric: 20, wind: 1, solar: 2, thermal: 67, biomassOrOther: 10 },
        mainSectors: ["Química e Petroquímica", "Metalurgia e Siderurgia", "Mineração (Extrativa)"]
      },
      "2021": {
        gdpIndustrial: 49.8,
        gdpShare: 9.0,
        energyConsumption: 13100,
        industrialCompaniesCount: 14900,
        employeeCount: 360,
        energyMatrix: { hydroelectric: 22, wind: 1, solar: 1, thermal: 66, biomassOrOther: 10 },
        mainSectors: ["Química e Petroquímica", "Metalurgia e Siderurgia", "Mineração (Extrativa)"]
      }
    }
  },
  {
    id: "PR",
    name: "Paraná",
    region: "Sul",
    capital: "Curitiba",
    mapCoords: { x: 450, y: 610 },
    history: {
      "2024": {
        gdpIndustrial: 53.8,
        gdpShare: 8.1,
        energyConsumption: 11900,
        industrialCompaniesCount: 21900,
        employeeCount: 490,
        energyMatrix: { hydroelectric: 70, wind: 2, solar: 10, thermal: 8, biomassOrOther: 10 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Celulose e Papel", "Química e Petroquímica"]
      },
      "2023": {
        gdpIndustrial: 51.2,
        gdpShare: 8.1,
        energyConsumption: 11500,
        industrialCompaniesCount: 21400,
        employeeCount: 475,
        energyMatrix: { hydroelectric: 73, wind: 2, solar: 8, thermal: 7, biomassOrOther: 10 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Celulose e Papel"]
      },
      "2022": {
        gdpIndustrial: 48.9,
        gdpShare: 8.2,
        energyConsumption: 11200,
        industrialCompaniesCount: 20900,
        employeeCount: 460,
        energyMatrix: { hydroelectric: 76, wind: 1, solar: 5, thermal: 8, biomassOrOther: 10 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Celulose e Papel"]
      },
      "2021": {
        gdpIndustrial: 44.5,
        gdpShare: 8.0,
        energyConsumption: 10800,
        industrialCompaniesCount: 20300,
        employeeCount: 440,
        energyMatrix: { hydroelectric: 78, wind: 1, solar: 3, thermal: 8, biomassOrOther: 10 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Celulose e Papel"]
      }
    }
  },
  {
    id: "RS",
    name: "Rio Grande do Sul",
    region: "Sul",
    capital: "Porto Alegre",
    mapCoords: { x: 410, y: 700 },
    history: {
      "2024": {
        gdpIndustrial: 51.1,
        gdpShare: 7.7,
        energyConsumption: 10900,
        industrialCompaniesCount: 22100,
        employeeCount: 482,
        energyMatrix: { hydroelectric: 60, wind: 18, solar: 10, thermal: 4, biomassOrOther: 8 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Metalurgia e Siderurgia", "Química e Petroquímica"]
      },
      "2023": {
        gdpIndustrial: 49.3,
        gdpShare: 7.8,
        energyConsumption: 10700,
        industrialCompaniesCount: 21800,
        employeeCount: 470,
        energyMatrix: { hydroelectric: 62, wind: 16, solar: 8, thermal: 5, biomassOrOther: 9 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Metalurgia e Siderurgia"]
      },
      "2022": {
        gdpIndustrial: 47.1,
        gdpShare: 7.9,
        energyConsumption: 10400,
        industrialCompaniesCount: 21300,
        employeeCount: 455,
        energyMatrix: { hydroelectric: 65, wind: 15, solar: 5, thermal: 6, biomassOrOther: 9 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Metalurgia e Siderurgia"]
      },
      "2021": {
        gdpIndustrial: 43.8,
        gdpShare: 7.9,
        energyConsumption: 10100,
        industrialCompaniesCount: 20800,
        employeeCount: 435,
        energyMatrix: { hydroelectric: 68, wind: 13, solar: 3, thermal: 7, biomassOrOther: 9 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Metalurgia e Siderurgia"]
      }
    }
  },
  {
    id: "SC",
    name: "Santa Catarina",
    region: "Sul",
    capital: "Florianópolis",
    mapCoords: { x: 470, y: 650 },
    history: {
      "2024": {
        gdpIndustrial: 44.2,
        gdpShare: 6.7,
        energyConsumption: 11400,
        industrialCompaniesCount: 20800,
        employeeCount: 460,
        energyMatrix: { hydroelectric: 68, wind: 4, solar: 8, thermal: 12, biomassOrOther: 8 },
        mainSectors: ["Têxtil e Calçados", "Alimentos e Bebidas", "Metalurgia e Siderurgia", "Celulose e Papel"]
      },
      "2023": {
        gdpIndustrial: 42.1,
        gdpShare: 6.7,
        energyConsumption: 11000,
        industrialCompaniesCount: 20300,
        employeeCount: 445,
        energyMatrix: { hydroelectric: 70, wind: 4, solar: 6, thermal: 12, biomassOrOther: 8 },
        mainSectors: ["Têxtil e Calçados", "Alimentos e Bebidas", "Metalurgia e Siderurgia"]
      },
      "2022": {
        gdpIndustrial: 39.8,
        gdpShare: 6.7,
        energyConsumption: 10700,
        industrialCompaniesCount: 19800,
        employeeCount: 430,
        energyMatrix: { hydroelectric: 72, wind: 3, solar: 4, thermal: 13, biomassOrOther: 8 },
        mainSectors: ["Têxtil e Calçados", "Alimentos e Bebidas", "Metalurgia e Siderurgia"]
      },
      "2021": {
        gdpIndustrial: 36.5,
        gdpShare: 6.6,
        energyConsumption: 10300,
        industrialCompaniesCount: 19300,
        employeeCount: 410,
        energyMatrix: { hydroelectric: 74, wind: 3, solar: 2, thermal: 13, biomassOrOther: 8 },
        mainSectors: ["Têxtil e Calçados", "Alimentos e Bebidas", "Metalurgia e Siderurgia"]
      }
    }
  },
  {
    id: "BA",
    name: "Bahia",
    region: "Nordeste",
    capital: "Salvador",
    mapCoords: { x: 590, y: 320 },
    history: {
      "2024": {
        gdpIndustrial: 32.5,
        gdpShare: 4.9,
        energyConsumption: 9100,
        industrialCompaniesCount: 9600,
        employeeCount: 215,
        energyMatrix: { hydroelectric: 10, wind: 60, solar: 20, thermal: 5, biomassOrOther: 5 },
        mainSectors: ["Química e Petroquímica", "Metalurgia e Siderurgia", "Alimentos e Bebidas", "Celulose e Papel"]
      },
      "2023": {
        gdpIndustrial: 30.9,
        gdpShare: 4.9,
        energyConsumption: 8800,
        industrialCompaniesCount: 9400,
        employeeCount: 208,
        energyMatrix: { hydroelectric: 12, wind: 58, solar: 18, thermal: 7, biomassOrOther: 5 },
        mainSectors: ["Química e Petroquímica", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      },
      "2022": {
        gdpIndustrial: 29.5,
        gdpShare: 5.0,
        energyConsumption: 8600,
        industrialCompaniesCount: 9150,
        employeeCount: 200,
        energyMatrix: { hydroelectric: 15, wind: 55, solar: 15, thermal: 10, biomassOrOther: 5 },
        mainSectors: ["Química e Petroquímica", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      },
      "2021": {
        gdpIndustrial: 27.2,
        gdpShare: 4.9,
        energyConsumption: 8300,
        industrialCompaniesCount: 8900,
        employeeCount: 190,
        energyMatrix: { hydroelectric: 20, wind: 50, solar: 12, thermal: 13, biomassOrOther: 5 },
        mainSectors: ["Química e Petroquímica", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      }
    }
  },
  {
    id: "GO",
    name: "Goiás",
    region: "Centro-Oeste",
    capital: "Goiânia",
    mapCoords: { x: 470, y: 440 },
    history: {
      "2024": {
        gdpIndustrial: 24.8,
        gdpShare: 3.7,
        energyConsumption: 6200,
        industrialCompaniesCount: 11200,
        employeeCount: 210,
        energyMatrix: { hydroelectric: 55, wind: 1, solar: 14, thermal: 5, biomassOrOther: 25 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Automotivo", "Mineração (Extrativa)"]
      },
      "2023": {
        gdpIndustrial: 23.5,
        gdpShare: 3.7,
        energyConsumption: 6000,
        industrialCompaniesCount: 11000,
        employeeCount: 203,
        energyMatrix: { hydroelectric: 58, wind: 1, solar: 11, thermal: 5, biomassOrOther: 25 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Automotivo"]
      },
      "2022": {
        gdpIndustrial: 22.1,
        gdpShare: 3.7,
        energyConsumption: 5850,
        industrialCompaniesCount: 10600,
        employeeCount: 195,
        energyMatrix: { hydroelectric: 62, wind: 1, solar: 8, thermal: 4, biomassOrOther: 25 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Automotivo"]
      },
      "2021": {
        gdpIndustrial: 20.3,
        gdpShare: 3.6,
        energyConsumption: 5600,
        industrialCompaniesCount: 10200,
        employeeCount: 185,
        energyMatrix: { hydroelectric: 66, wind: 1, solar: 5, thermal: 3, biomassOrOther: 25 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Automotivo"]
      }
    }
  },
  {
    id: "PE",
    name: "Pernambuco",
    region: "Nordeste",
    capital: "Recife",
    mapCoords: { x: 670, y: 250 },
    history: {
      "2024": {
        gdpIndustrial: 21.0,
        gdpShare: 3.2,
        energyConsumption: 5100,
        industrialCompaniesCount: 8800,
        employeeCount: 165,
        energyMatrix: { hydroelectric: 15, wind: 35, solar: 35, thermal: 10, biomassOrOther: 5 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Metalurgia e Siderurgia", "Química e Petroquímica"]
      },
      "2023": {
        gdpIndustrial: 19.8,
        gdpShare: 3.1,
        energyConsumption: 4950,
        industrialCompaniesCount: 8600,
        employeeCount: 158,
        energyMatrix: { hydroelectric: 18, wind: 34, solar: 30, thermal: 13, biomassOrOther: 5 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Metalurgia e Siderurgia"]
      },
      "2022": {
        gdpIndustrial: 18.9,
        gdpShare: 3.2,
        energyConsumption: 4800,
        industrialCompaniesCount: 8300,
        employeeCount: 152,
        energyMatrix: { hydroelectric: 20, wind: 33, solar: 25, thermal: 17, biomassOrOther: 5 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Metalurgia e Siderurgia"]
      },
      "2021": {
        gdpIndustrial: 17.5,
        gdpShare: 3.1,
        energyConsumption: 4600,
        industrialCompaniesCount: 8000,
        employeeCount: 145,
        energyMatrix: { hydroelectric: 25, wind: 30, solar: 18, thermal: 22, biomassOrOther: 5 },
        mainSectors: ["Alimentos e Bebidas", "Automotivo", "Metalurgia e Siderurgia"]
      }
    }
  },
  {
    id: "CE",
    name: "Ceará",
    region: "Nordeste",
    capital: "Fortaleza",
    mapCoords: { x: 630, y: 190 },
    history: {
      "2024": {
        gdpIndustrial: 18.5,
        gdpShare: 2.8,
        energyConsumption: 4400,
        industrialCompaniesCount: 7900,
        employeeCount: 142,
        energyMatrix: { hydroelectric: 5, wind: 48, solar: 35, thermal: 10, biomassOrOther: 2 },
        mainSectors: ["Têxtil e Calçados", "Metalurgia e Siderurgia", "Alimentos e Bebidas", "Química e Petroquímica"]
      },
      "2023": {
        gdpIndustrial: 17.4,
        gdpShare: 2.8,
        energyConsumption: 4250,
        industrialCompaniesCount: 7700,
        employeeCount: 138,
        energyMatrix: { hydroelectric: 6, wind: 48, solar: 30, thermal: 14, biomassOrOther: 2 },
        mainSectors: ["Têxtil e Calçados", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      },
      "2022": {
        gdpIndustrial: 16.5,
        gdpShare: 2.8,
        energyConsumption: 4100,
        industrialCompaniesCount: 7400,
        employeeCount: 133,
        energyMatrix: { hydroelectric: 8, wind: 47, solar: 22, thermal: 21, biomassOrOther: 2 },
        mainSectors: ["Têxtil e Calçados", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      },
      "2021": {
        gdpIndustrial: 15.1,
        gdpShare: 2.7,
        energyConsumption: 3950,
        industrialCompaniesCount: 7100,
        employeeCount: 125,
        energyMatrix: { hydroelectric: 10, wind: 45, solar: 15, thermal: 28, biomassOrOther: 2 },
        mainSectors: ["Têxtil e Calçados", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      }
    }
  },
  {
    id: "ES",
    name: "Espírito Santo",
    region: "Sudeste",
    capital: "Vitória",
    mapCoords: { x: 590, y: 470 },
    history: {
      "2024": {
        gdpIndustrial: 18.2,
        gdpShare: 2.7,
        energyConsumption: 4500,
        industrialCompaniesCount: 5800,
        employeeCount: 110,
        energyMatrix: { hydroelectric: 40, wind: 1, solar: 15, thermal: 34, biomassOrOther: 10 },
        mainSectors: ["Metalurgia e Siderurgia", "Mineração (Extrativa)", "Celulose e Papel", "Construção Civil"]
      },
      "2023": {
        gdpIndustrial: 17.3,
        gdpShare: 2.7,
        energyConsumption: 4380,
        industrialCompaniesCount: 5650,
        employeeCount: 106,
        energyMatrix: { hydroelectric: 44, wind: 1, solar: 11, thermal: 34, biomassOrOther: 10 },
        mainSectors: ["Metalurgia e Siderurgia", "Mineração (Extrativa)", "Celulose e Papel"]
      },
      "2022": {
        gdpIndustrial: 16.5,
        gdpShare: 2.8,
        energyConsumption: 4250,
        industrialCompaniesCount: 5500,
        employeeCount: 102,
        energyMatrix: { hydroelectric: 48, wind: 0, solar: 8, thermal: 34, biomassOrOther: 10 },
        mainSectors: ["Metalurgia e Siderurgia", "Mineração (Extrativa)", "Celulose e Papel"]
      },
      "2021": {
        gdpIndustrial: 15.2,
        gdpShare: 2.8,
        energyConsumption: 4100,
        industrialCompaniesCount: 5300,
        employeeCount: 97,
        energyMatrix: { hydroelectric: 52, wind: 0, solar: 5, thermal: 33, biomassOrOther: 10 },
        mainSectors: ["Metalurgia e Siderurgia", "Mineração (Extrativa)", "Celulose e Papel"]
      }
    }
  },
  {
    id: "PA",
    name: "Pará",
    region: "Norte",
    capital: "Belém",
    mapCoords: { x: 460, y: 200 },
    history: {
      "2024": {
        gdpIndustrial: 34.2,
        gdpShare: 5.2,
        energyConsumption: 12500,
        industrialCompaniesCount: 4800,
        employeeCount: 150,
        energyMatrix: { hydroelectric: 88, wind: 0, solar: 4, thermal: 5, biomassOrOther: 3 },
        mainSectors: ["Mineração (Extrativa)", "Metalurgia e Siderurgia", "Alimentos e Bebidas", "Celulose e Papel"]
      },
      "2023": {
        gdpIndustrial: 32.5,
        gdpShare: 5.1,
        energyConsumption: 12100,
        industrialCompaniesCount: 4650,
        employeeCount: 145,
        energyMatrix: { hydroelectric: 90, wind: 0, solar: 3, thermal: 4, biomassOrOther: 3 },
        mainSectors: ["Mineração (Extrativa)", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      },
      "2022": {
        gdpIndustrial: 30.8,
        gdpShare: 5.2,
        energyConsumption: 11800,
        industrialCompaniesCount: 4500,
        employeeCount: 140,
        energyMatrix: { hydroelectric: 92, wind: 0, solar: 2, thermal: 3, biomassOrOther: 3 },
        mainSectors: ["Mineração (Extrativa)", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      },
      "2021": {
        gdpIndustrial: 28.5,
        gdpShare: 5.1,
        energyConsumption: 11400,
        industrialCompaniesCount: 4300,
        employeeCount: 132,
        energyMatrix: { hydroelectric: 93, wind: 0, solar: 1, thermal: 3, biomassOrOther: 3 },
        mainSectors: ["Mineração (Extrativa)", "Metalurgia e Siderurgia", "Alimentos e Bebidas"]
      }
    }
  },
  {
    id: "AM",
    name: "Amazonas",
    region: "Norte",
    capital: "Manaus",
    mapCoords: { x: 260, y: 180 },
    history: {
      "2024": {
        gdpIndustrial: 29.8,
        gdpShare: 4.5,
        energyConsumption: 5800,
        industrialCompaniesCount: 3900,
        employeeCount: 128,
        energyMatrix: { hydroelectric: 10, wind: 0, solar: 3, thermal: 85, biomassOrOther: 2 },
        mainSectors: ["Eletroeletrônicos", "Automotivo", "Química e Petroquímica", "Alimentos e Bebidas"]
      },
      "2023": {
        gdpIndustrial: 28.2,
        gdpShare: 4.5,
        energyConsumption: 5600,
        industrialCompaniesCount: 3800,
        employeeCount: 124,
        energyMatrix: { hydroelectric: 12, wind: 0, solar: 2, thermal: 84, biomassOrOther: 2 },
        mainSectors: ["Eletroeletrônicos", "Automotivo", "Química e Petroquímica"]
      },
      "2022": {
        gdpIndustrial: 26.5,
        gdpShare: 4.4,
        energyConsumption: 5450,
        industrialCompaniesCount: 3650,
        employeeCount: 118,
        energyMatrix: { hydroelectric: 15, wind: 0, solar: 1, thermal: 82, biomassOrOther: 2 },
        mainSectors: ["Eletroeletrônicos", "Automotivo", "Química e Petroquímica"]
      },
      "2021": {
        gdpIndustrial: 24.1,
        gdpShare: 4.3,
        energyConsumption: 5200,
        industrialCompaniesCount: 3500,
        employeeCount: 112,
        energyMatrix: { hydroelectric: 15, wind: 0, solar: 1, thermal: 82, biomassOrOther: 2 },
        mainSectors: ["Eletroeletrônicos", "Automotivo", "Química e Petroquímica"]
      }
    }
  },
  {
    id: "MT",
    name: "Mato Grosso",
    region: "Centro-Oeste",
    capital: "Cuiabá",
    mapCoords: { x: 370, y: 360 },
    history: {
      "2024": {
        gdpIndustrial: 19.5,
        gdpShare: 2.9,
        energyConsumption: 3900,
        industrialCompaniesCount: 6500,
        employeeCount: 130,
        energyMatrix: { hydroelectric: 60, wind: 0, solar: 15, thermal: 5, biomassOrOther: 20 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Biocombustíveis", "Química e Petroquímica"]
      },
      "2023": {
        gdpIndustrial: 18.2,
        gdpShare: 2.9,
        energyConsumption: 3750,
        industrialCompaniesCount: 6300,
        employeeCount: 124,
        energyMatrix: { hydroelectric: 62, wind: 0, solar: 12, thermal: 6, biomassOrOther: 20 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Biocombustíveis"]
      },
      "2022": {
        gdpIndustrial: 16.9,
        gdpShare: 2.8,
        energyConsumption: 3600,
        industrialCompaniesCount: 6100,
        employeeCount: 117,
        energyMatrix: { hydroelectric: 65, wind: 0, solar: 8, thermal: 7, biomassOrOther: 20 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Biocombustíveis"]
      },
      "2021": {
        gdpIndustrial: 15.2,
        gdpShare: 2.7,
        energyConsumption: 3400,
        industrialCompaniesCount: 5800,
        employeeCount: 108,
        energyMatrix: { hydroelectric: 68, wind: 0, solar: 5, thermal: 7, biomassOrOther: 20 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Biocombustíveis"]
      }
    }
  },
  {
    id: "MS",
    name: "Mato Grosso do Sul",
    region: "Centro-Oeste",
    capital: "Campo Grande",
    mapCoords: { x: 390, y: 510 },
    history: {
      "2024": {
        gdpIndustrial: 16.2,
        gdpShare: 2.4,
        energyConsumption: 3500,
        industrialCompaniesCount: 4900,
        employeeCount: 88,
        energyMatrix: { hydroelectric: 35, wind: 0, solar: 10, thermal: 5, biomassOrOther: 50 },
        mainSectors: ["Celulose e Papel", "Alimentos e Bebidas", "Mineração (Extrativa)", "Química e Petroquímica"]
      },
      "2023": {
        gdpIndustrial: 15.1,
        gdpShare: 2.4,
        energyConsumption: 3380,
        industrialCompaniesCount: 4750,
        employeeCount: 84,
        energyMatrix: { hydroelectric: 38, wind: 0, solar: 8, thermal: 4, biomassOrOther: 50 },
        mainSectors: ["Celulose e Papel", "Alimentos e Bebidas", "Mineração (Extrativa)"]
      },
      "2022": {
        gdpIndustrial: 14.1,
        gdpShare: 2.4,
        energyConsumption: 3250,
        industrialCompaniesCount: 4600,
        employeeCount: 80,
        energyMatrix: { hydroelectric: 40, wind: 0, solar: 5, thermal: 5, biomassOrOther: 50 },
        mainSectors: ["Celulose e Papel", "Alimentos e Bebidas", "Mineração (Extrativa)"]
      },
      "2021": {
        gdpIndustrial: 12.8,
        gdpShare: 2.3,
        energyConsumption: 3100,
        industrialCompaniesCount: 4400,
        employeeCount: 75,
        energyMatrix: { hydroelectric: 43, wind: 0, solar: 2, thermal: 5, biomassOrOther: 50 },
        mainSectors: ["Celulose e Papel", "Alimentos e Bebidas", "Mineração (Extrativa)"]
      }
    }
  },
  {
    id: "MA",
    name: "Maranhão",
    region: "Nordeste",
    capital: "São Luís",
    mapCoords: { x: 500, y: 180 },
    history: {
      "2024": {
        gdpIndustrial: 12.8,
        gdpShare: 1.9,
        energyConsumption: 4600,
        industrialCompaniesCount: 3900,
        employeeCount: 62,
        energyMatrix: { hydroelectric: 40, wind: 40, solar: 10, thermal: 5, biomassOrOther: 5 },
        mainSectors: ["Metalurgia e Siderurgia", "Alimentos e Bebidas", "Celulose e Papel", "Mineração (Extrativa)"]
      },
      "2023": {
        gdpIndustrial: 12.1,
        gdpShare: 1.9,
        energyConsumption: 4450,
        industrialCompaniesCount: 3800,
        employeeCount: 59,
        energyMatrix: { hydroelectric: 42, wind: 38, solar: 8, thermal: 7, biomassOrOther: 5 },
        mainSectors: ["Metalurgia e Siderurgia", "Alimentos e Bebidas", "Celulose e Papel"]
      },
      "2022": {
        gdpIndustrial: 11.4,
        gdpShare: 1.9,
        energyConsumption: 4300,
        industrialCompaniesCount: 3650,
        employeeCount: 56,
        energyMatrix: { hydroelectric: 45, wind: 35, solar: 5, thermal: 10, biomassOrOther: 5 },
        mainSectors: ["Metalurgia e Siderurgia", "Alimentos e Bebidas", "Celulose e Papel"]
      },
      "2021": {
        gdpIndustrial: 10.2,
        gdpShare: 1.8,
        energyConsumption: 4100,
        industrialCompaniesCount: 3500,
        employeeCount: 52,
        energyMatrix: { hydroelectric: 50, wind: 30, solar: 3, thermal: 12, biomassOrOther: 5 },
        mainSectors: ["Metalurgia e Siderurgia", "Alimentos e Bebidas", "Celulose e Papel"]
      }
    }
  },
  {
    id: "RN",
    name: "Rio Grande do Norte",
    region: "Nordeste",
    capital: "Natal",
    mapCoords: { x: 670, y: 200 },
    history: {
      "2024": {
        gdpIndustrial: 8.5,
        gdpShare: 1.3,
        energyConsumption: 2100,
        industrialCompaniesCount: 3400,
        employeeCount: 48,
        energyMatrix: { hydroelectric: 2, wind: 82, solar: 12, thermal: 2, biomassOrOther: 2 },
        mainSectors: ["Mineração (Extrativa)", "Alimentos e Bebidas", "Têxtil e Calçados", "Química e Petroquímica"]
      },
      "2023": {
        gdpIndustrial: 8.0,
        gdpShare: 1.3,
        energyConsumption: 2020,
        industrialCompaniesCount: 3300,
        employeeCount: 46,
        energyMatrix: { hydroelectric: 2, wind: 80, solar: 10, thermal: 6, biomassOrOther: 2 },
        mainSectors: ["Mineração (Extrativa)", "Alimentos e Bebidas", "Têxtil e Calçados"]
      },
      "2022": {
        gdpIndustrial: 7.5,
        gdpShare: 1.3,
        energyConsumption: 1950,
        industrialCompaniesCount: 3150,
        employeeCount: 44,
        energyMatrix: { hydroelectric: 3, wind: 78, solar: 8, thermal: 9, biomassOrOther: 2 },
        mainSectors: ["Mineração (Extrativa)", "Alimentos e Bebidas", "Têxtil e Calçados"]
      },
      "2021": {
        gdpIndustrial: 6.9,
        gdpShare: 1.2,
        energyConsumption: 1880,
        industrialCompaniesCount: 3000,
        employeeCount: 41,
        energyMatrix: { hydroelectric: 5, wind: 75, solar: 5, thermal: 13, biomassOrOther: 2 },
        mainSectors: ["Mineração (Extrativa)", "Alimentos e Bebidas", "Têxtil e Calçados"]
      }
    }
  },
  {
    id: "AL",
    name: "Alagoas",
    region: "Nordeste",
    capital: "Maceió",
    mapCoords: { x: 660, y: 280 },
    history: {
      "2024": {
        gdpIndustrial: 6.8,
        gdpShare: 1.0,
        energyConsumption: 1600,
        industrialCompaniesCount: 2200,
        employeeCount: 35,
        energyMatrix: { hydroelectric: 10, wind: 15, solar: 15, thermal: 10, biomassOrOther: 50 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Construção Civil", "Têxtil e Calçados"]
      },
      "2023": {
        gdpIndustrial: 6.4,
        gdpShare: 1.0,
        energyConsumption: 1550,
        industrialCompaniesCount: 2150,
        employeeCount: 33,
        energyMatrix: { hydroelectric: 12, wind: 14, solar: 12, thermal: 12, biomassOrOther: 50 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Construção Civil"]
      },
      "2022": {
        gdpIndustrial: 6.0,
        gdpShare: 1.0,
        energyConsumption: 1500,
        industrialCompaniesCount: 2050,
        employeeCount: 31,
        energyMatrix: { hydroelectric: 15, wind: 12, solar: 10, thermal: 13, biomassOrOther: 50 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Construção Civil"]
      },
      "2021": {
        gdpIndustrial: 5.5,
        gdpShare: 1.0,
        energyConsumption: 1450,
        industrialCompaniesCount: 1950,
        employeeCount: 29,
        energyMatrix: { hydroelectric: 18, wind: 10, solar: 8, thermal: 14, biomassOrOther: 50 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Construção Civil"]
      }
    }
  },
  {
    id: "PB",
    name: "Paraíba",
    region: "Nordeste",
    capital: "João Pessoa",
    mapCoords: { x: 670, y: 220 },
    history: {
      "2024": {
        gdpIndustrial: 7.2,
        gdpShare: 1.1,
        energyConsumption: 1750,
        industrialCompaniesCount: 3800,
        employeeCount: 44,
        energyMatrix: { hydroelectric: 5, wind: 50, solar: 30, thermal: 10, biomassOrOther: 5 },
        mainSectors: ["Têxtil e Calçados", "Alimentos e Bebidas", "Construção Civil", "Eletroeletrônicos"]
      },
      "2023": {
        gdpIndustrial: 6.8,
        gdpShare: 1.1,
        energyConsumption: 1690,
        industrialCompaniesCount: 3700,
        employeeCount: 42,
        energyMatrix: { hydroelectric: 6, wind: 48, solar: 28, thermal: 13, biomassOrOther: 5 },
        mainSectors: ["Têxtil e Calçados", "Alimentos e Bebidas", "Construção Civil"]
      },
      "2022": {
        gdpIndustrial: 6.4,
        gdpShare: 1.1,
        energyConsumption: 1620,
        industrialCompaniesCount: 3550,
        employeeCount: 40,
        energyMatrix: { hydroelectric: 8, wind: 45, solar: 22, thermal: 20, biomassOrOther: 5 },
        mainSectors: ["Têxtil e Calçados", "Alimentos e Bebidas", "Construção Civil"]
      },
      "2021": {
        gdpIndustrial: 5.9,
        gdpShare: 1.1,
        energyConsumption: 1550,
        industrialCompaniesCount: 3400,
        employeeCount: 37,
        energyMatrix: { hydroelectric: 10, wind: 42, solar: 15, thermal: 28, biomassOrOther: 5 },
        mainSectors: ["Têxtil e Calçados", "Alimentos e Bebidas", "Construção Civil"]
      }
    }
  },
  {
    id: "SE",
    name: "Sergipe",
    region: "Nordeste",
    capital: "Aracaju",
    mapCoords: { x: 640, y: 300 },
    history: {
      "2024": {
        gdpIndustrial: 5.4,
        gdpShare: 0.8,
        energyConsumption: 1350,
        industrialCompaniesCount: 1600,
        employeeCount: 26,
        energyMatrix: { hydroelectric: 15, wind: 25, solar: 10, thermal: 48, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Construção Civil", "Mineração (Extrativa)"]
      },
      "2023": {
        gdpIndustrial: 5.1,
        gdpShare: 0.8,
        energyConsumption: 1300,
        industrialCompaniesCount: 1550,
        employeeCount: 24,
        energyMatrix: { hydroelectric: 17, wind: 24, solar: 8, thermal: 49, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Construção Civil"]
      },
      "2022": {
        gdpIndustrial: 4.8,
        gdpShare: 0.8,
        energyConsumption: 1250,
        industrialCompaniesCount: 1480,
        employeeCount: 23,
        energyMatrix: { hydroelectric: 20, wind: 22, solar: 5, thermal: 51, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Construção Civil"]
      },
      "2021": {
        gdpIndustrial: 4.4,
        gdpShare: 0.8,
        energyConsumption: 1190,
        industrialCompaniesCount: 1400,
        employeeCount: 21,
        energyMatrix: { hydroelectric: 25, wind: 20, solar: 3, thermal: 50, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Química e Petroquímica", "Construção Civil"]
      }
    }
  },
  {
    id: "PI",
    name: "Piauí",
    region: "Nordeste",
    capital: "Teresina",
    mapCoords: { x: 550, y: 220 },
    history: {
      "2024": {
        gdpIndustrial: 5.1,
        gdpShare: 0.8,
        energyConsumption: 1100,
        industrialCompaniesCount: 2100,
        employeeCount: 28,
        energyMatrix: { hydroelectric: 10, wind: 55, solar: 30, thermal: 3, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Têxtil e Calçados", "Química e Petroquímica"]
      },
      "2023": {
        gdpIndustrial: 4.8,
        gdpShare: 0.8,
        energyConsumption: 1050,
        industrialCompaniesCount: 2050,
        employeeCount: 26,
        energyMatrix: { hydroelectric: 12, wind: 54, solar: 26, thermal: 6, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Têxtil e Calçados"]
      },
      "2022": {
        gdpIndustrial: 4.4,
        gdpShare: 0.7,
        energyConsumption: 1010,
        industrialCompaniesCount: 1980,
        employeeCount: 25,
        energyMatrix: { hydroelectric: 15, wind: 51, solar: 20, thermal: 12, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Têxtil e Calçados"]
      },
      "2021": {
        gdpIndustrial: 3.9,
        gdpShare: 0.7,
        energyConsumption: 950,
        industrialCompaniesCount: 1900,
        employeeCount: 23,
        energyMatrix: { hydroelectric: 18, wind: 48, solar: 15, thermal: 17, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Têxtil e Calçados"]
      }
    }
  },
  {
    id: "DF",
    name: "Distrito Federal",
    region: "Centro-Oeste",
    capital: "Brasília",
    mapCoords: { x: 500, y: 410 },
    history: {
      "2024": {
        gdpIndustrial: 9.8,
        gdpShare: 1.5,
        energyConsumption: 1800,
        industrialCompaniesCount: 3100,
        employeeCount: 52,
        energyMatrix: { hydroelectric: 80, wind: 0, solar: 15, thermal: 3, biomassOrOther: 2 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Eletroeletrônicos", "Gráfico"]
      },
      "2023": {
        gdpIndustrial: 9.3,
        gdpShare: 1.5,
        energyConsumption: 1740,
        industrialCompaniesCount: 3000,
        employeeCount: 50,
        energyMatrix: { hydroelectric: 82, wind: 0, solar: 12, thermal: 4, biomassOrOther: 2 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Gráfico"]
      },
      "2022": {
        gdpIndustrial: 8.8,
        gdpShare: 1.5,
        energyConsumption: 1680,
        industrialCompaniesCount: 2900,
        employeeCount: 47,
        energyMatrix: { hydroelectric: 85, wind: 0, solar: 8, thermal: 5, biomassOrOther: 2 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Gráfico"]
      },
      "2021": {
        gdpIndustrial: 8.2,
        gdpShare: 1.5,
        energyConsumption: 1610,
        industrialCompaniesCount: 2800,
        employeeCount: 44,
        energyMatrix: { hydroelectric: 87, wind: 0, solar: 5, thermal: 6, biomassOrOther: 2 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Gráfico"]
      }
    }
  },
  {
    id: "TO",
    name: "Tocantins",
    region: "Norte",
    capital: "Palmas",
    mapCoords: { x: 490, y: 310 },
    history: {
      "2024": {
        gdpIndustrial: 4.8,
        gdpShare: 0.7,
        energyConsumption: 1050,
        industrialCompaniesCount: 1900,
        employeeCount: 25,
        energyMatrix: { hydroelectric: 80, wind: 0, solar: 10, thermal: 2, biomassOrOther: 8 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Calcário e Cimento", "Biocombustíveis"]
      },
      "2023": {
        gdpIndustrial: 4.5,
        gdpShare: 0.7,
        energyConsumption: 1010,
        industrialCompaniesCount: 1840,
        employeeCount: 23,
        energyMatrix: { hydroelectric: 82, wind: 0, solar: 8, thermal: 2, biomassOrOther: 8 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Calcário e Cimento"]
      },
      "2022": {
        gdpIndustrial: 4.1,
        gdpShare: 0.7,
        energyConsumption: 960,
        industrialCompaniesCount: 1750,
        employeeCount: 21,
        energyMatrix: { hydroelectric: 85, wind: 0, solar: 5, thermal: 2, biomassOrOther: 8 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Calcário e Cimento"]
      },
      "2021": {
        gdpIndustrial: 3.6,
        gdpShare: 0.6,
        energyConsumption: 900,
        industrialCompaniesCount: 1650,
        employeeCount: 19,
        energyMatrix: { hydroelectric: 88, wind: 0, solar: 2, thermal: 2, biomassOrOther: 8 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Calcário e Cimento"]
      }
    }
  },
  {
    id: "RO",
    name: "Rondônia",
    region: "Norte",
    capital: "Porto Velho",
    mapCoords: { x: 280, y: 300 },
    history: {
      "2024": {
        gdpIndustrial: 5.6,
        gdpShare: 0.8,
        energyConsumption: 1450,
        industrialCompaniesCount: 2300,
        employeeCount: 32,
        energyMatrix: { hydroelectric: 92, wind: 0, solar: 4, thermal: 2, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Madeira e Mobiliário", "Mineração (Extrativa)"]
      },
      "2023": {
        gdpIndustrial: 5.3,
        gdpShare: 0.8,
        energyConsumption: 1390,
        industrialCompaniesCount: 2210,
        employeeCount: 30,
        energyMatrix: { hydroelectric: 93, wind: 0, solar: 3, thermal: 2, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Madeira e Mobiliário"]
      },
      "2022": {
        gdpIndustrial: 4.9,
        gdpShare: 0.8,
        energyConsumption: 1330,
        industrialCompaniesCount: 2100,
        employeeCount: 28,
        energyMatrix: { hydroelectric: 95, wind: 0, solar: 2, thermal: 1, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Madeira e Mobiliário"]
      },
      "2021": {
        gdpIndustrial: 4.3,
        gdpShare: 0.8,
        energyConsumption: 1250,
        industrialCompaniesCount: 1980,
        employeeCount: 25,
        energyMatrix: { hydroelectric: 95, wind: 0, solar: 1, thermal: 2, biomassOrOther: 2 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Madeira e Mobiliário"]
      }
    }
  },
  {
    id: "RR",
    name: "Roraima",
    region: "Norte",
    capital: "Boa Vista",
    mapCoords: { x: 270, y: 100 },
    history: {
      "2024": {
        gdpIndustrial: 1.5,
        gdpShare: 0.2,
        energyConsumption: 350,
        industrialCompaniesCount: 850,
        employeeCount: 8,
        energyMatrix: { hydroelectric: 10, wind: 0, solar: 5, thermal: 80, biomassOrOther: 5 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Madeira", "Gráfico"]
      },
      "2023": {
        gdpIndustrial: 1.4,
        gdpShare: 0.2,
        energyConsumption: 330,
        industrialCompaniesCount: 810,
        employeeCount: 7,
        energyMatrix: { hydroelectric: 10, wind: 0, solar: 4, thermal: 81, biomassOrOther: 5 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Madeira"]
      },
      "2022": {
        gdpIndustrial: 1.3,
        gdpShare: 0.2,
        energyConsumption: 310,
        industrialCompaniesCount: 770,
        employeeCount: 7,
        energyMatrix: { hydroelectric: 12, wind: 0, solar: 3, thermal: 80, biomassOrOther: 5 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Madeira"]
      },
      "2021": {
        gdpIndustrial: 1.1,
        gdpShare: 0.2,
        energyConsumption: 290,
        industrialCompaniesCount: 720,
        employeeCount: 6,
        energyMatrix: { hydroelectric: 12, wind: 0, solar: 2, thermal: 81, biomassOrOther: 5 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Madeira"]
      }
    }
  },
  {
    id: "AP",
    name: "Amapá",
    region: "Norte",
    capital: "Macapá",
    mapCoords: { x: 440, y: 120 },
    history: {
      "2024": {
        gdpIndustrial: 1.8,
        gdpShare: 0.3,
        energyConsumption: 455,
        industrialCompaniesCount: 950,
        employeeCount: 11,
        energyMatrix: { hydroelectric: 65, wind: 0, solar: 3, thermal: 30, biomassOrOther: 2 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Madeira e Celulose", "Mineração (Extrativa)"]
      },
      "2023": {
        gdpIndustrial: 1.7,
        gdpShare: 0.3,
        energyConsumption: 430,
        industrialCompaniesCount: 910,
        employeeCount: 10,
        energyMatrix: { hydroelectric: 68, wind: 0, solar: 2, thermal: 28, biomassOrOther: 2 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Madeira e Celulose"]
      },
      "2022": {
        gdpIndustrial: 1.6,
        gdpShare: 0.3,
        energyConsumption: 410,
        industrialCompaniesCount: 870,
        employeeCount: 9,
        energyMatrix: { hydroelectric: 70, wind: 0, solar: 1, thermal: 27, biomassOrOther: 2 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Madeira e Celulose"]
      },
      "2021": {
        gdpIndustrial: 1.4,
        gdpShare: 0.3,
        energyConsumption: 390,
        industrialCompaniesCount: 830,
        employeeCount: 9,
        energyMatrix: { hydroelectric: 72, wind: 0, solar: 1, thermal: 25, biomassOrOther: 2 },
        mainSectors: ["Construção Civil", "Alimentos e Bebidas", "Madeira e Celulose"]
      }
    }
  },
  {
    id: "AC",
    name: "Acre",
    region: "Norte",
    capital: "Rio Branco",
    mapCoords: { x: 140, y: 250 },
    history: {
      "2024": {
        gdpIndustrial: 1.6,
        gdpShare: 0.2,
        energyConsumption: 390,
        industrialCompaniesCount: 1050,
        employeeCount: 12,
        energyMatrix: { hydroelectric: 5, wind: 0, solar: 5, thermal: 85, biomassOrOther: 5 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Madeira e Mobiliário", "Gráfico"]
      },
      "2023": {
        gdpIndustrial: 1.5,
        gdpShare: 0.2,
        energyConsumption: 370,
        industrialCompaniesCount: 1000,
        employeeCount: 11,
        energyMatrix: { hydroelectric: 5, wind: 0, solar: 4, thermal: 86, biomassOrOther: 5 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Madeira e Mobiliário"]
      },
      "2022": {
        gdpIndustrial: 1.4,
        gdpShare: 0.2,
        energyConsumption: 350,
        industrialCompaniesCount: 960,
        employeeCount: 11,
        energyMatrix: { hydroelectric: 6, wind: 0, solar: 3, thermal: 86, biomassOrOther: 5 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Madeira e Mobiliário"]
      },
      "2021": {
        gdpIndustrial: 1.2,
        gdpShare: 0.2,
        energyConsumption: 330,
        industrialCompaniesCount: 910,
        employeeCount: 10,
        energyMatrix: { hydroelectric: 8, wind: 0, solar: 2, thermal: 85, biomassOrOther: 5 },
        mainSectors: ["Alimentos e Bebidas", "Construção Civil", "Madeira e Mobiliário"]
      }
    }
  },
  {
    id: "Other",
    name: "Outros Estados",
    region: "Norte",
    capital: "N/A",
    mapCoords: { x: 0, y: 0 },
    history: {}
  }
];

// Clean items out of last placeholder item which is just for safety
const filteredStates = brazilStatesData.filter(s => s.id !== "Other");
export const statesList = filteredStates;

// Total nacional por ano
export const NATIONAL_STATS: { [year: string]: StateYearData } = {
  "2024": {
    gdpIndustrial: 662.3,
    gdpShare: 100,
    energyConsumption: 169545,
    industrialCompaniesCount: 236800,
    employeeCount: 6678,
    energyMatrix: { hydroelectric: 53.2, wind: 19.5, solar: 12.8, thermal: 8.5, biomassOrOther: 6.0 },
    mainSectors: ["Alimentos e Bebidas", "Automotivo", "Mineração (Extrativa)", "Metalurgia e Siderurgia", "Química e Petroquímica"]
  },
  "2023": {
    gdpIndustrial: 638.1,
    gdpShare: 100,
    energyConsumption: 165380,
    industrialCompaniesCount: 232230,
    employeeCount: 6511,
    energyMatrix: { hydroelectric: 55.4, wind: 18.2, solar: 10.4, thermal: 10.2, biomassOrOther: 5.8 },
    mainSectors: ["Alimentos e Bebidas", "Automotivo", "Mineração (Extrativa)", "Metalurgia e Siderurgia", "Química e Petroquímica"]
  },
  "2022": {
    gdpIndustrial: 610.4,
    gdpShare: 100,
    energyConsumption: 161830,
    industrialCompaniesCount: 226900,
    employeeCount: 6363,
    energyMatrix: { hydroelectric: 58.1, wind: 16.5, solar: 8.2, thermal: 11.2, biomassOrOther: 6.0 },
    mainSectors: ["Alimentos e Bebidas", "Automotivo", "Mineração (Extrativa)", "Metalurgia e Siderurgia", "Química e Petroquímica"]
  },
  "2021": {
    gdpIndustrial: 569.3,
    gdpShare: 100,
    energyConsumption: 157950,
    industrialCompaniesCount: 222160,
    employeeCount: 6161,
    energyMatrix: { hydroelectric: 61.2, wind: 14.8, solar: 5.6, thermal: 12.4, biomassOrOther: 6.0 },
    mainSectors: ["Alimentos e Bebidas", "Automotivo", "Mineração (Extrativa)", "Metalurgia e Siderurgia", "Química e Petroquímica"]
  }
};
