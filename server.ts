import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { statesList, NATIONAL_STATS } from "./src/data/brazilData";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK securely on the server
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("[Warning] GEMINI_API_KEY is not defined. AI Chatbot functionality will be mocked or display warnings.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System instructions containing the entire static database for precise AI insights
const buildSystemInstruction = (stateId?: string, year?: string, sector?: string, cnae?: string) => {
  let contextInfo = `Você é o "Assistente de Inteligência Industrial" do PID E+ (Portal de Análise Industrial e Energética do Brasil).
Você é um especialista em matrizes energéticas (hidrelétrica, eólica, solar, térmica, biomassa), PIB industrial, quantidade de empresas indústrias, atividades econômicas (CNAEs) e empregos associados por estado brasileiro.

Para responder às dúvidas do usuário, utilize estritamente o banco de dados oficial que disponibilizamos abaixo. Nunca invente dados. Seja sempre elegante, profissional, claro em suas respostas, oferecendo comparações ricas baseadas nestas informações. Use markdown com tabelas, bullet points, e negrito de maneira muito agradável para o usuário.

Filtros atuais selecionados pelo usuário na interface gráfica:
- Estado atual visualizado: ${stateId && stateId !== "Todos" ? `Estado ${stateId}` : "Todos os Estados (Visão Nacional)"}
- Ano selecionado: ${year || "2024"}
- Setor industrial enfocado no filtro: ${sector || "Todos os setores"}
${cnae ? `- CNAE Industrial em destaque no filtro do mapa: ${cnae}` : ""}

Abaixo está o Banco de Dados oficial que você DEVE consultar obrigatoriamente:

=== BANCO DE DADOS NACIONAL (MÉDIAS/TOTAIS DO BRASIL) ===
${JSON.stringify(NATIONAL_STATS, null, 2)}

=== BANCO DE DADOS DETALHADO POR ESTADO BRASILEIRO ===
${JSON.stringify(
  statesList.map((state) => ({
    id: state.id,
    name: state.name,
    region: state.region,
    capital: state.capital,
    history: state.history,
  })),
  null,
  2
)}

Regras de comportamento:
1. Responda em Português Brasileiro (PT-BR).
2. Se o usuário perguntar sobre o estado selecionado atual (${stateId || "Nacional"}), dê ênfase a ele, informando sobre o PIB industrial, consumo de energia em GWh, quantidade de indústrias e matriz energética do estado no ano especificado (${year || "2024"}).
3. Se houver uma CNAE focada selecionada (${cnae || "Nenhuma específica"}), comente de forma amigável e especializada sobre este segmento industrial (CNAE).
4. Use tabelas em markdown ou pequenas listas estruturadas quando o usuário pedir comparações (ex: "Compare São Paulo e Minas Gerais" ou "Qual estado tem o maior PIB?").
5. Se o usuário pedir algo completamente fora do tema de indústria brasileira, consumo de energia, bioenergia ou economia industrial, responda educadamente explicando que sua especialidade reside estritamente na análise de dados industriais e de consumo energético do Brasil e reconduza-o amigavelmente ao assunto do portal.
6. Se o GEMINI_API_KEY estiver ausente, o servidor vai simular uma resposta estática baseada nas regras locais.
`;
  return contextInfo;
};

// API Endpoint for Chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentStateId, currentYear, currentSector, currentCnae } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "O campo 'messages' é obrigatório e deve ser um array." });
    }

    const ai = getAiClient();
    if (!ai) {
      // Mock fallbacks in case API key is missing during development transitions
      const lastMessage = messages[messages.length - 1]?.content || "";
      let mockReply = `Olá! Sou o Assistente de Inteligência Industrial. O servidor está rodando em modo de desenvolvimento sem uma chave de API do Gemini configurada temporariamente.

No entanto, posso lhe informar usando meus dados locais sobre o estado selecionado: **${currentStateId || "Todos"}** no ano de **${currentYear || "2024"}**.

- O PIB Industrial nacional estimado em 2024 é de R$ 662.3 Bilhões com consumo industrial de energia de 169.545 GWh.
  - A matriz elétrica brasileira é forte em **Hidrelétrica (53.2%)**, **Eólica (19.5%)** e **Solar (12.8%)** neste ano. 
- Por favor, adicione sua chave de API nos Segredos para habilitar o poder completo da inteligência artificial!`;

      // Simple keyword matching for mock responses
      const lowMsg = lastMessage.toLowerCase();
      if (lowMsg.includes("sp") || lowMsg.includes("são paulo") || lowMsg.includes("sao paulo")) {
        mockReply = `**Análise sobre São Paulo (SP) em ${currentYear || "2024"} (Simulação Local):**
- **PIB Industrial:** R$ 195.4 Bilhões (líder nacional com 29.5% de participação).
- **Consumo de Energia:** 42.100 GWh.
- **Indústrias Ativas:** 52.100 empresas.
- **Principais Setores:** Automotivo, Química e Petroquímica, Alimentos e Bebidas.
- **Matriz Energética:** Hidrelétrica (45%), Biomassa/Outros (20%), Solar (15%), Térmica (15%), Eólica (5%).`;
      } else if (lowMsg.includes("mg") || lowMsg.includes("minas")) {
        mockReply = `**Análise sobre Minas Gerais (MG) em ${currentYear || "2024"} (Simulação Local):**
- **PIB Industrial:** R$ 78.6 Bilhões (11.8% de participação nacional).
- **Consumo de Energia:** 24.500 GWh.
- **Principais Setores:** Mineração (Extrativa), Metalurgia e Siderurgia, Alimentos e Bebidas.
- **Matriz Elétrica Estadual:** Hidrelétrica (65%), Solar (20%), Biomassa (8%), Térmica (5%), Eólica (2%).`;
      } else if (lowMsg.includes("matriz") || lowMsg.includes("energia") || lowMsg.includes("sustentável")) {
        mockReply = `**Matriz Energética Industrial Brasileira (Simulação Local):**
Em 2024, o Brasil apresenta uma das matrizes mais limpas do planeta de forma integrada:
1. **Hidrelétrica:** 53.2% (Consolidação histórica)
2. **Eólica:** 19.5% (Crescimento massivo no Nordeste, especialmente Bahia com 60% e RN com 82%)
3. **Solar:** 12.8% (Crescimento exponencial em Minas Gerais e Ceará)
4. **Térmica / Biomassa & Outros:** 14.5%`;
      }

      return res.json({ text: mockReply });
    }

    // Prepare system instruction and get final prompt
    const systemInstruction = buildSystemInstruction(currentStateId, currentYear, currentSector, currentCnae);

    // Format the messages for @google/genai chat/generateContent API
    // The model recommeded in guidelines is "gemini-3.5-flash"
    const modelToUse = "gemini-3.5-flash";

    // Format history structure for Gemini 3.5 API
    // Transform incoming conversation to contents format
    const contents = messages.map(m => {
      return {
        role: m.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: m.content }]
      };
    });

    // Call Gemini API securely
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Erro interno ao processar a inteligência artificial." });
  }
});

// Serve frontend assets
if (process.env.NODE_ENV !== "production") {
  // Mount Vite middleware in development
  import("vite").then(async (viteModule) => {
    const vite = await viteModule.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  });
} else {
  // Serve static files from compiled dist folder in production
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Full-Stack App] Server booting. Running on http://0.0.0.0:${PORT}`);
});
