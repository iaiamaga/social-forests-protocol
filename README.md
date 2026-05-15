<div align="center">
  <img src="https://raw.githubusercontent.com/G0vermind/social-forests-protocol/main/apps/web/public/logo-placeholder.png" width="120" alt="Social Forest Logo" />

  # 🌳 Social Forest Protocol

  **Decentralized Infrastructure for Green RWA & Climate Finance on Stellar**

  *System Error: The destruction of nature is profitable. We are fixing this bug with Programmable Prosperity.*

  ---

  [![Network: Stellar Soroban](https://img.shields.io/badge/Network-Stellar%20Soroban-7B6FEE?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
  [![Contracts: Rust](https://img.shields.io/badge/Contracts-Rust-orange?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
  [![Payments: x402](https://img.shields.io/badge/Payments-x402%20Protocol-00C2FF?style=for-the-badge)](https://www.x402.org/)
  [![Frontend: Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg?style=for-the-badge)](LICENSE)

  > 🇺🇸 [English version above](#-social-forest-protocol)
  
  
</div>

---

## 🌍 The Mission: Programmable Prosperity

Most sustainability promises stop at marketing. We build the infrastructure that makes them verifiable.

**Social Forest democratizes sustainability** by connecting everyday consumption to real environmental regeneration. Every dollar spent at a partner brand becomes biological heritage — a fraction of a living African Mahogany tree (*Khaya senegalensis*), anchored on the Stellar blockchain, owned by the person who earned it.

We call this model **RWA as a Service (RWAaaS)**: companies don't invest in the asset — they use our infrastructure to distribute regenerative cashback to their customers. **The tree belongs to whoever redeems it.**

> **Unique competitive moat:** Full control of the physical supply chain — from Viveiro Maravilha (seedlings) to Sómogno (processing) — eliminates counterparty risk and guarantees the permanence of every on-chain asset.

---

## ⚙️ How It Works: The Core Loop

| Actor | Action & Value Proposition |
|-------|----------------------------|
| 🏢 **Company (B2B)** | Enters via x402 USDC payment, buys RWA fractions, and gains verifiable ESG impact. They configure rules to distribute "Green Cashback" to their clients. |
| 🛰️ **Oracle (PoF)** | AI and satellite data validate biomass and carbon levels in the physical world. This is the "Engine" that guarantees the asset is thriving (Proof of Flourishing). |
| 🌱 **Consumer (B2C)** | Earns Green Cashback (LEAF tokens and SBT achievements). They forge and evolve their ecological wealth in the Virtual Oasis, driving real-world reforestation. |

---

## 🏗 Architecture — Smart Contracts (Soroban)

Six modular Rust contracts deployed on Stellar Soroban (SDK v26.0.0):

| Contract | Role | Status |
|----------|------|--------|
| `leaf_token` | **$LEAF Token (SEP-41).** Fungible token with mint/burn/transfer. Capped at 1B supply. 2-step admin transfer. TTL-managed balances. | ✅ Testnet |
| `guardian_id` | **Consumer SBT.** Soulbound reputation token — XP, levels (1-50), 7 biological eras. Non-transferable. | ✅ Testnet |
| `company_id` | **Company SBT.** Institutional identity — C-Cred balance, C-Debt, ODS badges, Vereda verification. | ✅ Testnet |
| `collateral_vault` | **DeFi Marketplace.** Manages physical inventory (seedlings), C-Cred trading between companies, debt settlement. | ✅ Testnet |
| `forest_mythos_vault` | **dNFT Engine.** Dynamic NFTs representing real trees — mint, forge (merge), oracle growth reports, 90-day anti-flip lock, tier evolution. | ✅ Testnet |
| `journey_orchestrator` | **Maestro.** Orchestrates all contracts — B2B onboarding, B2C plant_tree, forge_mythos. Single entry point for complex flows. | ✅ Testnet |

### Contract Interaction Graph

```
                    ┌─────────────────────────┐
                    │  journey_orchestrator    │
                    │  (Maestro)              │
                    └──────┬──────┬──────┬────┘
                           │      │      │
              ┌────────────┘      │      └────────────┐
              ▼                   ▼                    ▼
     ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐
     │  leaf_token    │  │ guardian_id  │  │ forest_mythos   │
     │  ($LEAF)       │  │ (XP/SBT)    │  │ (dNFT Engine)   │
     └────────────────┘  └──────────────┘  └─────────────────┘
              ▲
              │
     ┌────────────────┐       ┌──────────────┐
     │collateral_vault│──────▶│  company_id  │
     │ (DeFi/C-Cred) │       │ (SBT Empresa)│
     └────────────────┘       └──────────────┘
```

---

## 🛡 Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Rust · soroban-sdk 26.0.0 · `#![forbid(unsafe_code)]` |
| Blockchain | Stellar Soroban (Testnet) |
| Payments | x402 Protocol (USDC on Stellar) via OpenZeppelin Facilitator |
| RWA Bridge | Etherfuse Stablebonds *(stub — in progress)* |
| Frontend | Next.js 16 · React 19 · TailwindCSS 4 · Framer Motion |
| Wallet | Freighter API v6 |
| CI/CD | GitHub Actions (cargo test, WASM build, gitleaks, Next.js build) |

---

## 🔐 Security Model

| Feature | Implementation |
|---------|---------------|
| Admin Transfer | 2-step `propose_admin` → `accept_admin` (leaf_token) |
| Supply Cap | MAX_SUPPLY = 1B LEAF (enforced on-chain) |
| Soulbound Enforcement | `transfer()` panics with `SoulboundToken` error (guardian_id) |
| Anti-Flip Lock | 90-day transfer lock on Phase 1 dNFTs (forest_mythos_vault) |
| Oracle Auth | API key header (`X-Oracle-Api-Key`) + server-side secret only |
| x402 Replay Guard | In-memory payment hash deduplication with TTL |
| Initialize Protection | All contracts panic on double-init + require_auth on admin |
| Secret Scanning | gitleaks in CI pipeline |
| Unsafe Code | `#![forbid(unsafe_code)]` on all 6 contracts |

---

## 💳 x402 Payment Flow

The protocol uses the [x402 protocol](https://www.x402.org/) for HTTP-native USDC payments on Stellar:

```
Client → GET/POST endpoint → 402 Payment Required (with price + payTo)
Client → Signs Soroban auth entry via Freighter
Client → Re-sends request with X-Payment-Signature header
Server → Facilitator verifies + settles on-chain
Server → Returns prepared Soroban transaction XDR
Client → Signs + submits the contract call
```

**Protected Endpoints:**

| Endpoint | Price | Action |
|----------|-------|--------|
| `POST /api/v1/x402/plant-tree` | $0.01 USDC | Burns LEAF → mints dNFT → awards XP |
| `POST /api/v1/x402/forge-mythos` | $0.05 USDC | Merges dNFTs into higher tier |
| `GET /api/v1/x402/rwa-data/[id]` | $0.001 USDC | Returns dNFT telemetry data |

---

## 🌐 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/x402/plant-tree` | POST | x402-protected tree planting |
| `/api/v1/x402/forge-mythos` | POST | x402-protected dNFT forging |
| `/api/v1/x402/rwa-data/[id]` | GET | x402-protected RWA telemetry |
| `/api/v1/oracle/report` | POST | Oracle injects biomass/carbon data (API key auth) |
| `/api/v1/distribute` | POST | Company creates cashback campaigns + QR codes |
| `/api/v1/etherfuse` | POST | Etherfuse RWA registration webhook *(stub)* |
| `/api/v1/resgate` | POST | Consumer redeems QR code for LEAF *(simulated)* |

---

## 🔑 Environment Variables

Create `.env.local` from `.env.example`:

| Variable | Scope | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_X402_PAY_TO` | Client | Stellar address receiving x402 USDC payments |
| `NEXT_PUBLIC_X402_FACILITATOR_URL` | Client | OpenZeppelin facilitator endpoint |
| `X402_FACILITATOR_API_KEY` | Server | API key for the x402 facilitator |
| `ORACLE_SECRET_KEY` | Server | Stellar secret key for oracle transactions |
| `ORACLE_API_KEY` | Server | API key for oracle endpoint authentication |
| `NEXT_PUBLIC_APP_URL` | Client | Base URL of the application |

---

## 📍 Contract Addresses (Testnet)

| Contract | Address |
|----------|---------|
| leaf_token | `CDJQLHVAZDENXOXUMIDKYVZSLMXDRL3UUTMRP3SCC4YQAH6YLN6UU42X` |
| guardian_id | `CBDHSG7DKVL3JUJALB5VKDQFYJLFKXXYM2WN2XE6GGXBQWSF7F5XGTSE` |
| company_id | `CCMWNVLPVJ5WSD5BEQBUMQLE7JMTQS2THTFVI4G2OQ3UZISSSYLGSVEQ` |
| collateral_vault | `CAW55PMUSPCJYG3U66M4O544XHDH62YTPDN2GIIFXBR7LRS5Q333X76K` |
| forest_mythos_vault | `CBCTY64FH4GJBWDRU6CHLUHESEXCKAC3WNQR43FEPM5UOPSMDARMOX24` |
| journey_orchestrator | `CDPDH4H4XYEW3DQHYFKR33HXDTOO472IQLO4FNWYA5QZFM6JT74RXH57` |

**Mainnet:** TBD — pending security audit completion.

---

## 🚀 Quick Start

```bash
# Prerequisites
rustup target add wasm32v1-none
cargo install stellar-cli

# Clone & install
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol

# Build all contracts
make build

# Run tests
make test

# Frontend
cd apps/web
cp .env.example .env.local  # Fill in your values
npm install
npm run dev  # → http://localhost:3000
```

---

## 🗺 Roadmap

| Phase | Status | Milestones |
|-------|--------|-----------|
| **Phase 1 — Seed** | 🔨 Building | 6 modular contracts on Testnet · x402 payment integration · Oracle API · B2C gamification (XP/Eras) · dNFT forging · Viveiro Maravilha "Client Zero" |
| **Phase 2 — Growth** | 🔜 Planned | AI Vision oracle on Mainnet · Etherfuse Stablebond integration · Account Abstraction (Google login) · $FLORA governance contract · Sómogno integration · Multi-sig admin |
| **Phase 3 — Scale** | 🔜 Planned | Secondary RWA marketplace · DAO transition · C-Cred AMM · Pecém Port export · Full institutional onboarding · Mainnet deployment |

---

## 🌱 SDG Alignment

| SDG | Contribution |
|-----|-------------|
| **1 & 2** | Rural income diversification (intercropped beekeeping); food security |
| **5** | Gender equality in asset management; autonomous Stellar wallets for rural women |
| **8** | Decent work in inland Ceará; DeFi infrastructure innovation |
| **9** | Digitization of natural assets; open NbS infrastructure |
| **12** | Regenerative Cashback model; responsible consumption and production |
| **13** | Carbon sequestration; Paris Agreement + Kunming-Montreal alignment |
| **15** | Forest management and biodiversity protection |

---

## 👥 Core Team — The Netweavers

- **Gustavo Gonçalves** · `Founder & Tech Lead` ([LinkedIn](https://www.linkedin.com/in/gustavo-gon%C3%A7alves-9a4a1523/) · [GitHub](https://github.com/G0vermind))
- **Vinicius Braz Rocha** · `ReFi Architect` ([LinkedIn](https://www.linkedin.com/in/vrselfmedia/) · [GitHub](https://github.com/glocalVR))
- **Clarkson Luiz Buriche** · `Environmental Dev & AI` ([LinkedIn](https://www.linkedin.com/in/clarkson-luiz-buriche-bartalini-80446a6b/) · [GitHub](https://github.com/catitodev))
- **Iara Magalhães** · `Web3 Developer` ([LinkedIn](https://www.linkedin.com/in/iaiakedemy) · [GitHub](https://github.com/iaiamaga))

### Advisors — Council of Guardians
- **Francisco das Chagas Rosa** · `Agronomic Advisor`
- **Patricia Lemos** · `Legal Advisor`

---

## ⚡ [RE]³ — ReReGeneradora: The First Decelerator

> **[RE]³ - ReReGeneradora** is the first known decelerator ⚡ connected to what is already changing the logic of the world we live in: AI & Web3.

- **Pedro Bruder** · `[RE]³ Advisor` ([LinkedIn](https://www.linkedin.com/in/pedrobruder) · [GitHub](https://github.com/BasedCaveman))
- **Vinícius Braz Rocha** · `[RE]³ Advisor & Protocol Co-initiator` ([LinkedIn](https://www.linkedin.com/in/vrselfmedia/) · [GitHub](https://github.com/glocalVR))
- **Enzo Garcia** · `[RE]³ Advisor` ([LinkedIn](https://www.linkedin.com/in/enzo-garcia-295066316) · [GitHub](https://github.com/F0rtyF0ur))

---

<div align="center">

*Converting Ecological Flourishing into Programmable Prosperity on Stellar.*

**[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)** · **[x402](https://www.x402.org/)** · **[Stellar37°](https://stellar37.nearx.com.br)**

📧 [gutogn@gmail.com](mailto:gutogn@gmail.com) · 📱 [+55 88 99643-7794](https://wa.me/5588996437794)

</div>

---
<br />
<br />
<br />

---

<div align="center">
  <img src="https://raw.githubusercontent.com/G0vermind/social-forests-protocol/main/apps/web/public/logo-placeholder.png" width="120" alt="Social Forest Logo" />

  # 🌳 Social Forest Protocol

  **Infraestrutura Descentralizada para Green RWA & Finanças Climáticas na Stellar**

  *System Error: A destruição da natureza é lucrativa. Nós estamos corrigindo esse bug com a Prosperidade Programável.*

  ---

  > 🇧🇷 [Versão em Português abaixo](#-social-forest-protocol-1)

</div>

---

## 🌍 A Missão: Prosperidade Programável

A maioria das promessas de sustentabilidade para na comunicação. Nós construímos a infraestrutura que as torna verificáveis.

**O Social Forest democratiza a sustentabilidade** conectando o consumo cotidiano à regeneração ambiental real. Cada Real gasto numa marca parceira vira patrimônio biológico — uma fração de um Mogno Africano (*Khaya senegalensis*) vivo, ancorado na blockchain Stellar, de propriedade de quem o ganhou.

Chamamos isso de **RWA as a Service (RWAaaS)**: as empresas não "investem" no ativo — elas usam nossa infraestrutura para distribuir cashback regenerativo aos clientes. **A árvore pertence a quem resgata.**

> **Vantagem competitiva única:** controle total da cadeia física — do Viveiro Maravilha (mudas) à Sómogno (beneficiamento) — elimina risco de contraparte e garante a permanência de cada ativo on-chain.

---

## ⚙️ Como Funciona: O Core Loop

| Ator | Ação e Proposta de Valor |
|------|--------------------------|
| 🏢 **Empresa (B2B)** | Entra via pagamento USDC (x402), compra frações de RWA e ganha impacto ESG comprovado. Configura o "Cashback Verde" pros seus clientes. |
| 🛰️ **Oráculo (PoF)** | IA e dados de satélite validam a biomassa e o carbono (O Motor). Garante que a árvore está crescendo. |
| 🌱 **Consumidor (B2C)** | Ganha Cashback Verde (LEAF e SBTs), construindo o seu patrimônio ecológico no Oásis. |

---

## 🔒 Mapa de Smart Contracts (Soroban)

Seis contratos modulares em Rust na rede Stellar Soroban (SDK v26.0.0):

| Contrato | Função | Status |
|----------|--------|--------|
| `leaf_token` | **Token $LEAF (SEP-41).** Mint/burn/transfer com supply máximo de 1B. Admin 2-step. TTL gerenciado. | ✅ Testnet |
| `guardian_id` | **SBT Consumidor.** Reputação soulbound — XP, níveis (1-50), 7 eras biológicas. Intransferível. | ✅ Testnet |
| `company_id` | **SBT Empresa.** Identidade institucional — C-Cred, C-Debt, selos ODS, verificação Vereda. | ✅ Testnet |
| `collateral_vault` | **Marketplace DeFi.** Gestão de inventário físico (mudas), trading de C-Cred entre empresas, compensação de dívida. | ✅ Testnet |
| `forest_mythos_vault` | **Motor dNFT.** NFTs dinâmicos representando árvores reais — mint, forja, relatórios do oráculo, lock anti-flip de 90 dias. | ✅ Testnet |
| `journey_orchestrator` | **Maestro.** Orquestra todos os contratos — onboarding B2B, plantio B2C, forja mítica. Ponto de entrada único. | ✅ Testnet |

---

## 💳 Fluxo de Pagamento x402

O protocolo usa o [protocolo x402](https://www.x402.org/) para pagamentos nativos em USDC via HTTP na Stellar:

| Endpoint | Preço | Ação |
|----------|-------|------|
| `POST /api/v1/x402/plant-tree` | $0.01 USDC | Queima LEAF → mint dNFT → credita XP |
| `POST /api/v1/x402/forge-mythos` | $0.05 USDC | Funde dNFTs em tier superior |
| `GET /api/v1/x402/rwa-data/[id]` | $0.001 USDC | Retorna telemetria do dNFT |

---

## 🚀 Início Rápido

```bash
# Pré-requisitos
rustup target add wasm32v1-none
cargo install stellar-cli

# Clone e instalação
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol

# Build de todos os contratos
make build

# Testes
make test

# Frontend
cd apps/web
cp .env.example .env.local  # Preencha seus valores
npm install
npm run dev  # → http://localhost:3000
```

---

## 🗺 Roadmap

| Fase | Status | Marcos |
|------|--------|--------|
| **Fase 1 — Seed** | 🔨 Construindo | 6 contratos modulares na Testnet · Integração x402 · API Oracle · Gamificação B2C (XP/Eras) · Forja dNFT · Viveiro Maravilha "Cliente Zero" |
| **Fase 2 — Crescimento** | 🔜 Planejado | IA Vision oracle na Mainnet · Integração Etherfuse Stablebonds · Account Abstraction (login Google) · Contrato de governança $FLORA · Integração Sómogno · Admin multi-sig |
| **Fase 3 — Escala** | 🔜 Planejado | Mercado secundário de RWA · Transição para DAO · AMM de C-Cred · Porto do Pecém exportação · Onboarding institucional completo · Deploy Mainnet |

---

## 🌱 Alinhamento com ODS

| ODS | Contribuição |
|-----|-------------|
| **1 & 2** | Diversificação de renda rural (apicultura consorciada); segurança alimentar |
| **5** | Igualdade de gênero na gestão de ativos; carteiras Stellar autônomas para mulheres rurais |
| **8** | Trabalho decente no interior do Ceará; inovação DeFi |
| **9** | Digitalização de ativos naturais; infraestrutura NbS aberta |
| **12** | Modelo Cashback Regenerativo; consumo e produção responsáveis |
| **13** | Sequestro de carbono; Acordo de Paris + Marco Kunming-Montreal |
| **15** | Manejo florestal e proteção da biodiversidade |

---

## 👥 Core Team — The Netweavers

- **Gustavo Gonçalves** · `Founder & Tech Lead` ([LinkedIn](https://www.linkedin.com/in/gustavo-gon%C3%A7alves-9a4a1523/) · [GitHub](https://github.com/G0vermind))
- **Vinicius Braz Rocha** · `Arquiteto ReFi` ([LinkedIn](https://www.linkedin.com/in/vrselfmedia/) · [GitHub](https://github.com/glocalVR))
- **Clarkson Luiz Buriche** · `Dev Ambiental & IA` ([LinkedIn](https://www.linkedin.com/in/clarkson-luiz-buriche-bartalini-80446a6b/) · [GitHub](https://github.com/catitodev))
- **Iara Magalhães** · `Web3 Developer` ([LinkedIn](https://www.linkedin.com/in/iaiakedemy) · [GitHub](https://github.com/iaiamaga))

### Advisors — Council of Guardians
- **Francisco das Chagas Rosa** · `Consultor Agronômico`
- **Patricia Lemos** · `Consultora Jurídica`

---

## ⚡ [RE]³ — ReReGeneradora: A Primeira Desaceleradora

> A **[RE]³ - ReReGeneradora** é a primeira desaceleradora que se tem notícia ⚡ e ligada ao que já está mudando a lógica do mundo que vivemos: IA & Web3.

- **Pedro Bruder** · `Conselheiro [RE]³` ([LinkedIn](https://www.linkedin.com/in/pedrobruder) · [GitHub](https://github.com/BasedCaveman))
- **Vinícius Braz Rocha** · `Conselheiro [RE]³ & Co-iniciador do Protocolo` ([LinkedIn](https://www.linkedin.com/in/vrselfmedia/) · [GitHub](https://github.com/glocalVR))
- **Enzo Garcia** · `Conselheiro [RE]³` ([LinkedIn](https://www.linkedin.com/in/enzo-garcia-295066316) · [GitHub](https://github.com/F0rtyF0ur))

---

<div align="center">

*Convertendo Florescimento Ecológico em Prosperidade Programável na Stellar.*

**[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)** · **[x402](https://www.x402.org/)** · **[Stellar37°](https://stellar37.nearx.com.br)**

📧 [gutogn@gmail.com](mailto:gutogn@gmail.com) · 📱 [+55 88 99643-7794](https://wa.me/5588996437794)

</div>
