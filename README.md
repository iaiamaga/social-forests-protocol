<div align="center">
  <img src="https://raw.githubusercontent.com/G0vermind/social-forests-protocol/main/apps/web/public/logo-placeholder.png" width="120" alt="Social Forest Logo" />

  # 🌳 Social Forest Protocol

  **Decentralized Infrastructure for Green RWA & Climate Finance on Stellar**

  *System Error: The destruction of nature is profitable. We are fixing this bug with Programmable Prosperity.*

  ---

  [![Frontend: Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Network: Stellar Soroban](https://img.shields.io/badge/Network-Stellar%20Soroban-7B6FEE?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
  [![Contracts: TypeScript & Rust](https://img.shields.io/badge/Contracts-TypeScript%20%2B%20Rust-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.rust-lang.org/)
  [![Payments: Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
  [![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg?style=for-the-badge)](LICENSE)

  > 🇧🇷 [Versão em Português abaixo](#-social-forest-protocol-1)

</div>

---

## 📸 Platform Sneak Peek

*Our B2C Virtual Oasis and B2B Dashboards bring the blockchain to life with beautiful, intuitive interfaces.*

**1. B2C Dashboard & Missions**
> Where users spend "Energy Drops" to earn LEAF tokens by regenerating the planet.
> ![B2C Dashboard & Missions](/docs/assets/b2c-missions.png)

**2. Virtual Oasis (SBT Gamification)**
> An isometric grid where achievements (SBTs) turn into biodiversity (water wells, animals) and NFTs grow into real trees.
> ![Virtual Oasis](/docs/assets/virtual-oasis.png)

**3. RWA Telemetry (Asset Details)**
> Data modal showing the real tree's height, sequestered carbon, and Stellar network hashes validating the *Proof of Flourishing* (PoF).
> ![RWA Telemetry](/docs/assets/rwa-telemetry.png)

**4. B2B Institutional Vision**
> The panel where partner companies monitor their "Carbon Debt" (C-DEBT) and manage RWAs via Stripe MPP.
> ![B2B Institutional Vision](/docs/assets/b2b-dashboard.png)

---

## 🌍 The Mission: Programmable Prosperity

Most sustainability promises stop at marketing. We build the infrastructure that makes them verifiable.

**Social Forest democratizes sustainability** by connecting everyday consumption to real environmental regeneration. Every dollar spent at a partner brand becomes biological heritage — a fraction of a living African Mahogany tree (*Khaya senegalensis*), anchored on the Stellar blockchain, owned by the person who earned it.

We call this model **RWA as a Service (RWAaaS)**: companies don't invest in the asset — they use our infrastructure to distribute regenerative cashback to their customers. **The tree belongs to whoever redeems it.**

> **Unique competitive moat:** Full control of the physical supply chain — from Viveiro Maravilha (seedlings) to Sómogno (processing) — eliminates counterparty risk and guarantees the permanence of every on-chain asset.

---

## ⚙️ How It Works: The Core Loop

The Social Forests ecosystem bridges the gap between Web2 commerce and Web3 ecological assets.

| Actor | Action & Value Proposition |
|-------|----------------------------|
| 🏢 **Company (B2B)** | Enters via Stripe (Fiat on-ramp), buys RWA fractions, and gains verifiable ESG impact. They configure rules to distribute "Green Cashback" to their clients. |
| 🛰️ **Oracle (PoF)** | AI and satellite data validate biomass and carbon levels in the physical world. This is the "Engine" that guarantees the asset is thriving (Proof of Flourishing). |
| 🌱 **Consumer (B2C)**| Earns Green Cashback (LEAF tokens and SBT achievements). They forge and evolve their ecological wealth in the Virtual Oasis, driving real-world reforestation. |

---

## 🔒 Smart Contracts (Soroban)

Our infrastructure relies on three core Rust smart contracts deployed on the Stellar Soroban network:

| Contract | Role | Status |
|----------|------|--------|
| `rwa_vault` | **SEP-41 Standard.** Manages the minting of LEAF tokens and the African Mahogany (RWA) NFTs. Only mints when the PoF oracle validates physical growth. | 🔨 Testnet |
| `sbt_reputation` | **Green Cashback & Soulbound Tokens.** Manages non-transferable impact points (SBTs/Farm Achievements) verifying user engagement. | 🔨 In Dev |
| `hero_journey` | **Evolution & Burning.** Handles the burning of LEAFs and the rarity evolution of the NFT (Common → Rare → Legendary). | 🔨 In Dev |

---

## 🚀 Quick Start

```bash
# Prerequisites
rustup target add wasm32-unknown-unknown
cargo install stellar-cli

# Clone & install
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol

# Build contracts
cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/rwa_vault/Cargo.toml
cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/sbt_reputation/Cargo.toml
cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/hero_journey/Cargo.toml

# Frontend (Florestas.Social)
cd apps/web && npm install && npm run dev  # → http://localhost:3000
```

---

## 🗺 Roadmap

| Phase | Status | Milestones |
|-------|--------|-----------|
| **Phase 1 — Seed** | 🔨 Building | `rwa_vault` + `sbt_reputation` + `hero_journey` on Testnet · Stripe MPP · First PoF registry · B2B pilot · Viveiro Maravilha "Client Zero" |
| **Phase 2 — Growth** | 🔜 Planned | AI Vision oracle on Mainnet · LEAF cashback live · NFT Mogno evolution · `vereda-core` cross-contract · $FLORA governance · Sómogno integration |
| **Phase 3 — Scale** | 🔜 Planned | `c_cred` + `c_debt` + `amm_impact` · Secondary RWA marketplace · DAO transition · Pecém Port export · Full institutional onboarding |

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

**[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)** · **[Stellar37°](https://stellar37.nearx.com.br)**

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

  > 🇺🇸 [English version above](#-social-forest-protocol)

</div>

---

## 📸 A Plataforma em Ação

*Nosso Oásis Virtual B2C e os Dashboards B2B dão vida à blockchain com interfaces lindas e intuitivas.*

**1. Dashboard B2C & Missões**
> Onde o usuário gasta "Gotas de Energia" para ganhar LEAFs regenerando o planeta.
> ![Dashboard B2C & Missões](/docs/assets/b2c-missions.png)

**2. Oásis Virtual (Gamificação SBT)**
> O grid isométrico onde as conquistas (SBTs) viram infraestrutura e biodiversidade (poços d'água, animais) e os NFTs viram árvores crescendo.
> ![Oásis Virtual](/docs/assets/virtual-oasis.png)

**3. Telemetria RWA (Detalhes do Ativo)**
> O modal de dados que mostra a altura real da árvore, carbono sequestrado e hashes da rede Stellar validando o *Proof of Flourishing* (PoF).
> ![Telemetria RWA](/docs/assets/rwa-telemetry.png)

**4. Visão Institucional B2B**
> O painel onde empresas parceiras monitoram o seu "Débito de Carbono" (C-DEBT) e gerem os RWAs via Stripe MPP.
> ![Visão Institucional B2B](/docs/assets/b2b-dashboard.png)

---

## 🌍 A Missão: Prosperidade Programável

A maioria das promessas de sustentabilidade para na comunicação. Nós construímos a infraestrutura que as torna verificáveis.

**O Social Forest democratiza a sustentabilidade** conectando o consumo cotidiano à regeneração ambiental real. Cada Real gasto numa marca parceira vira patrimônio biológico — uma fração de um Mogno Africano (*Khaya senegalensis*) vivo, ancorado na blockchain Stellar, de propriedade de quem o ganhou.

Chamamos isso de **RWA as a Service (RWAaaS)**: as empresas não "investem" no ativo — elas usam nossa infraestrutura para distribuir cashback regenerativo aos clientes. **A árvore pertence a quem resgata.**

> **Vantagem competitiva única:** controle total da cadeia física — do Viveiro Maravilha (mudas) à Sómogno (beneficiamento) — elimina risco de contraparte e garante a permanência de cada ativo on-chain.

---

## ⚙️ Como Funciona: O Core Loop

O ecossistema Social Forests preenche a lacuna entre o comércio Web2 e os ativos ecológicos Web3.

| Ator | Ação e Proposta de Valor |
|------|--------------------------|
| 🏢 **Empresa (B2B)** | Entra via Stripe (dinheiro fiat), compra frações de RWA e ganha impacto ESG comprovado. Elas configuram o "Cashback Verde" pros seus clientes. |
| 🛰️ **Oráculo (PoF)** | IA e dados de satélite validam a biomassa e o carbono (O Motor). Garante que a árvore está crescendo. |
| 🌱 **Consumidor (B2C)**| Ganha Cashback Verde (LEAF e SBTs), construindo o seu patrimônio ecológico no Oásis. |

---

## 🔒 Mapa de Smart Contracts (Soroban)

A nossa infraestrutura se apoia em três contratos principais em Rust na rede Stellar Soroban:

| Contrato | Função | Status |
|----------|--------|--------|
| `rwa_vault` | **Padrão SEP-41.** Gere o token LEAF e o Mint dos NFTs Mogno (RWAs). Só minera tokens quando o Oráculo PoF valida o crescimento físico. | 🔨 Testnet |
| `sbt_reputation` | **Green Cashback & SBTs.** Gere os pontos de impacto não-transferíveis (SBTs/Conquistas da Fazenda) que validam o engajamento. | 🔨 Em Dev |
| `hero_journey` | **Evolução e Queima.** Gere a queima de tokens LEAF e a evolução de raridade do NFT (Plantador → Lenda). | 🔨 Em Dev |

---

## 🚀 Início Rápido

```bash
# Pré-requisitos
rustup target add wasm32-unknown-unknown
cargo install stellar-cli

# Clone e instalação
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol

# Build dos contratos
cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/rwa_vault/Cargo.toml
cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/sbt_reputation/Cargo.toml
cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/hero_journey/Cargo.toml

# Frontend (Florestas.Social)
cd apps/web && npm install && npm run dev  # → http://localhost:3000
```

---

## 🗺 Roadmap

| Fase | Status | Marcos |
|------|--------|--------|
| **Fase 1 — Seed** | 🔨 Construindo | `rwa_vault` + `sbt_reputation` + `hero_journey` na Testnet · Stripe MPP · Primeiro registro PoF · Piloto B2B · Viveiro Maravilha "Cliente Zero" |
| **Fase 2 — Crescimento** | 🔜 Planejado | IA Vision oracle na Mainnet · LEAF cashback ativo · Sistema de evolução NFT Mogno · Cross-contract `vereda-core` · $FLORA governance · Integração Sómogno |
| **Fase 3 — Escala** | 🔜 Planejado | `c_cred` + `c_debt` + `amm_impact` · Mercado secundário de RWA · Transição para DAO · Porto do Pecém exportação · Integração institucional completa |

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
- **Clarkson Luiz Buriche** · `Dev Ambiental & IA` ([LinkedIn](https://www.linkedin.com/in/clarkson-luiz-buriche-bartalini-80446a6b/))
- **Iara Magalhães** · `Web3 Developer` ([LinkedIn](https://www.linkedin.com/in/iaiakedemy))

### Advisors — Council of Guardians
- **Francisco das Chagas Rosa** · `Consultor Agronômico`
- **Patricia Lemos** · `Consultora Jurídica`

---

## ⚡ [RE]³ — ReReGeneradora: A Primeira Desaceleradora

> A **[RE]³ - ReReGeneradora** é a primeira desaceleradora que se tem notícia ⚡ e ligada ao que já está mudando a lógica do mundo que vivemos: IA & Web3.

- **Pedro Bruder** · `Conselheiro [RE]³` ([LinkedIn](https://www.linkedin.com/in/pedrobruder))
- **Vinícius Braz Rocha** · `Conselheiro [RE]³ & Co-iniciador do Protocolo` ([LinkedIn](https://www.linkedin.com/in/vrselfmedia/))
- **Enzo Garcia** · `Conselheiro [RE]³` ([LinkedIn](https://www.linkedin.com/in/enzo-garcia-295066316))

---

<div align="center">

*Convertendo Florescimento Ecológico em Prosperidade Programável na Stellar.*

**[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)** · **[Stellar37°](https://stellar37.nearx.com.br)**

📧 [gutogn@gmail.com](mailto:gutogn@gmail.com) · 📱 [+55 88 99643-7794](https://wa.me/5588996437794)

</div>
