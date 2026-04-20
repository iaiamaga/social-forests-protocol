<div align="center">

# 🌳 Social Forest Protocol

**Decentralized Infrastructure for Green RWA & Climate Finance on Stellar**

*Converting Ecological Flourishing into Programmable Prosperity*

---

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg?style=for-the-badge)](LICENSE)
[![Network: Stellar Soroban](https://img.shields.io/badge/Network-Stellar%20Soroban-7B6FEE?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Contracts: Rust](https://img.shields.io/badge/Contracts-Rust%20%2B%20Soroban-orange?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Standard: SEP-41](https://img.shields.io/badge/Standard-SEP--41-blue?style=for-the-badge)](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md)
[![Payments: x402 + MPP](https://img.shields.io/badge/Payments-x402%20%2B%20MPP-brightgreen?style=for-the-badge)](https://developers.stellar.org/docs/build/agentic-payments)
[![Frontend: Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

> 🇧🇷 [Versão em Português abaixo](#-social-forest-protocol-1)

</div>

---

## The Problem

Today's carbon credit market operates on self-reported data, centralized verification, and issuance cycles that stretch up to 18 months. Companies seeking to offset real emissions face technical barriers that block direct access to verified forest assets.

**The result:** greenwashing at scale, trapped climate capital, and forests that don't receive the financing they need.

---

## The Solution

Social Forest converts the **ecological flourishing** of African Mahogany (*Khaya senegalensis*) in the Brazilian semi-arid region into programmable on-chain collateral on the Stellar network — transforming trees into autonomous economic agents generating environmental and financial dividends.

Unlike static carbon credit models, we introduce **Proof of Flourishing (PoF)**: a dynamic, AI-audited proof of biome health enabling a circular **B2B2C** economy where every minted token is backed by a verified, living tree.

> **Unique competitive advantage:** full control of the physical supply chain — from Viveiro Maravilha (seedlings) to Sómogno (processing) — guaranteeing asset permanence against climate risk and eliminating counterparty risk.

---

## Protocol Tokenomics

| Token | Type | Role |
|-------|------|------|
| **RWA** `MOGNO` | Real World Asset | Real tree fraction. Grants land tenure, ownership, and harvest profit rights. Backed by live African Mahogany biomass. |
| **C-CRED** | Carbon Credit | Ex-post ecocredit based on verified real CO₂ capture. Follows rigorous scientific methodologies (GRI, SASB, SBTi). |
| **S-CRED** | Stewardship (PES) | Payment for Environmental Services. Rewards conservation and biodiversity — independent of carbon sequestration. |
| **C-DEBT** | Carbon Debt Ledger | On-chain registry for companies to declare carbon footprints (Scopes 1, 2 & 3) and prove Net Zero compliance. |
| **$FLORA** | Governance | Protocol voting utility token. Acts as Credit Class Admin — curating new areas and methodologies. |

---

## Technical Architecture

### Smart Contracts — Soroban & Rust

```
contracts/
├── rwa_vault/          ← SEP-41 Token MOGNO (LIVE on Testnet)
├── sbt_reputation/     ← Green Cashback Engine + SBT (LIVE on Testnet)
├── governance/         ← $FLORA weighted voting via PoF (roadmap)
├── c_cred/             ← Ex-post carbon credit issuance (roadmap)
├── c_debt/             ← Corporate carbon audit ledger (roadmap)
└── amm_impact/         ← Non-speculative DeFi settlement AMM (roadmap)
```

**`rwa_vault`** — SEP-41 RWA Token (`MOGNO`)
- `admin_mint` gated behind the PoF oracle — tokens minted only when flourishing is cryptographically proven
- Full SEP-41: `transfer`, `transfer_from`, `approve`, `allowance`, `balance`
- Storage: `instance()` for admin · `persistent()` for balances and allowances

**`sbt_reputation`** — Green Cashback Engine + Soulbound Reputation
- `distribute_green_cashback(company, user, amount)` — Verified Companies push RWA fractions to consumers
- Impact Points are **non-transferable by design** — `transfer_reputation()` always panics (`SoulboundNonTransferable`)
- `get_user_impact(user) -> i128` — read endpoint consumed by the Next.js frontend

### Proof of Flourishing — x402 + MPP + AI Vision

```
Physical Data (DAP / Height)
    │  Collected via IoT / Human Monitor / WhatsApp AI
    ▼
Regen Data Stream ──── immutable on-chain anchoring
    │
    ▼
AI Vision Layer ──── multispectral validation (satellite + drone)
    │  PoF threshold reached
    ▼
x402 Payment Required ──── validation micropayment via Coinbase
    │  economic event fired
    ▼
admin_mint() ──── rwa_vault mints token backed by living tree
    │
    ▼
distribute_green_cashback() ──── sbt_reputation sends fraction to consumer
```

> Social Forest runs **both** official Stellar agentic payment protocols:
> `x402` (Coinbase) for validation event micropayments ·
> `MPP` (Stripe) for institutional B2B on-ramp flows

### Institutional On-ramp — Stripe MPP

Companies acquire RWA fractions via BRL/USD corporate cards — **zero crypto custody at entry**. Stripe Checkout approval automatically triggers `mint` and token transfer via Soroban, simultaneously generating a Web2 invoice + on-chain record for ESG auditing.

---

## The B2B2C Model

> **Capital flows in from B2B. Impact flows out to B2C. The planet is the beneficiary.**

```
Admin (Social Forest)
  └─ registers Verified Companies + approves PoF thresholds
        │
        ▼
B2B Anchor (Partner Company)
  └─ buys RWA lots via Stripe MPP (fiat, no crypto custody)
     configures Green Cashback rules per SKU/service
     accesses ESG Analytics + Greenshouting dashboard
        │  distribute_green_cashback() via x402
        ▼
B2C User (Consumer)
  └─ receives RWA micro-fraction + Impact Points (SBT)
     collects Common / Rare / Legendary Leaves
     forges real tree certificate when threshold reached
        │  get_user_impact()
        ▼
Frontend (Florestas.Social — Next.js)
  └─ Digital Nursery · Impact History · SDG Dashboard
     governance voice in Green Treasury DAO ($FLORA)
```

### Gamification Mechanics

- **SKU Missions:** Unique QR codes on physical packaging — impact attributed to the specific product, not just the brand
- **Service Missions:** Post-delivery validation (consulting, freight, beauty) — incentivizes feedback and recurrence
- **Rarity Levels:** Legendary Leaves (limited editions or large purchases) accelerate harvest or unlock future benefits

---

## SDG Alignment

| SDG | Contribution |
|-----|-------------|
| **1 & 2** | Rural income diversification (intercropped beekeeping); food security |
| **5** | Gender equality in asset management; women-led nursery teams; autonomous Stellar wallets for rural women |
| **6** | Ecosystem restoration protecting watersheds |
| **8** | Decent work in inland Ceará; DeFi infrastructure innovation |
| **9** | Digitization of natural assets; open NbS infrastructure |
| **10** | Stellar enables vulnerable populations to access global markets without traditional financial intermediaries |
| **12** | Green Cashback model; responsible consumption and production |
| **13** | Carbon sequestration; Paris Agreement + Kunming-Montreal alignment |
| **15** | Forest management and biodiversity protection |
| **16 & 17** | DAO governance; global B2B2C partnerships; Agenda 2030 implementation |

*Aligned with GEO-7, UNEA-7, and the Adaptation Gap Report (up to USD 365 billion/year needed for developing nations).*

---

## Repository Structure

```
social-forests-protocol/
│
├── apps/
│   └── web/                    # Next.js frontend — Florestas.Social ✅
│       ├── src/app/            # B2B2C dashboard + B2B corporate panel
│       ├── public/             # Static assets
│       ├── next.config.ts
│       └── package.json
│
├── contracts/                  # Rust workspace — Soroban smart contracts
│   ├── rwa_vault/              # SEP-41 RWA Token MOGNO ✅ em desenvolvimento
│   ├── sbt_reputation/         # Green Cashback + SBT ✅ em desenvolvimento
│   ├── hero_journey/           # Leaves economy + NFT forge ✅ em desenvolvimento
│   ├── governance/             # $FLORA voting (roadmap)
│   ├── c_cred/                 # Ex-post carbon credit issuance (roadmap)
│   ├── c_debt/                 # Corporate carbon ledger (roadmap)
│   └── amm_impact/             # Non-speculative AMM (roadmap)
│
├── services/
│   ├── stripe_gateway/         # Fiat on-ramp via Stripe MPP 🔨
│   └── pof_oracle/             # AI Vision + x402/MPP PoF engine (n8n) 🔨
│
├── docs/
│   ├── ARCHITECTURE.md         # Trust model + storage schema ✅
│   ├── SECURITY.md             # Security policy + audit tools ✅
│   └── architecture/           # SEPs + Wallet strategy docs
│
├── .well-known/
│   └── stellar.toml            # SEP-1: asset definitions + metadata
│
├── Cargo.toml                  # Rust workspace root
├── docs/whitepaper/            # LIGHTPAPER, AGENTS, CONTRIBUTING, CLAUDE
└── README.md
```

---

## Quick Start

```bash
# Prerequisites
rustup target add wasm32-unknown-unknown
cargo install stellar-cli

# Clone & install
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol

# Build contracts
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/rwa_vault/Cargo.toml
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/sbt_reputation/Cargo.toml
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/hero_journey/Cargo.toml

# Test all contracts
cargo test --manifest-path contracts/rwa_vault/Cargo.toml
cargo test --manifest-path contracts/sbt_reputation/Cargo.toml
cargo test --manifest-path contracts/hero_journey/Cargo.toml

# Frontend
cd apps/web && npm install && npm run dev  # → http://localhost:3000
```

---

## Roadmap

| Phase | Status | Milestones |
|-------|--------|-----------|
| **Phase 1 — Seed** | 🔨 Building | `rwa_vault` + `sbt_reputation` + `hero_journey` · Stripe MPP · First PoF registry · B2B pilot · Viveiro Maravilha "Client Zero" |
| **Phase 2 — Growth** | 🔜 Planned | AI Vision oracle on Mainnet · Green Cashback activation · `vereda-core` cross-contract · $FLORA governance · Sómogno integration |
| **Phase 3 — Scale** | 🔜 Planned | `c_cred` + `c_debt` + `amm_impact` · Secondary RWA marketplace · DAO transition · Pecém Port export · Full institutional onboarding |

---

## Core Team — The Netweavers

**Gustavo Gonçalves** · `Founder & Tech Lead`
Silviculturist and entrepreneur in high-value hardwoods since the late 90s. Stellar Network Ambassador for Brazil/Ceará. Builder of the Green RWA tech-stack and strategic node within the ABC+ Ceará low-carbon agriculture and bioeconomy ecosystem.
[LinkedIn](https://www.linkedin.com/in/gustavo-gon%C3%A7alves-9a4a1523/)

**Vinicius Brás Rocha** · `ReFi Architect`
P2P glocal explorer and netweaver co-creating regenerative cyberculture in Web3 through ReRe (Regenerative Resources). Whitehat hacker from the 1990s cypherpunk movement with roots in the pre-launch Bitcoin ecosystem.
[LinkedIn](https://www.linkedin.com/in/vrselfmedia/)

**Clarkson Luiz Buriche** · `Environmental Dev & AI`
Impact-driven developer and senior environmental engineer. Specialist in translating socio-environmental complexity into scalable digital systems. Rust and AI architect building secure tech-stacks for climate regeneration and natural resource governance.
[LinkedIn](https://www.linkedin.com/in/clarkson-luiz-buriche-bartalini-80446a6b/)

**Iara Magalhães** · `Web3 Developer`
Web3 developer and blockchain enthusiast mastering Rust and decentralized systems. Explorer of secure smart contract architectures within the Soroban ecosystem and contributor to Social Forest's technical development.
[LinkedIn](https://www.linkedin.com/in/iaiakedemy)

---

## Advisors — Council of Guardians

**Francisco das Chagas Rosa** · `Agronomic Advisor`
Agronomist engineer and senior technical consultant in tropical silviculture. Specialist in high-yield African Mahogany management and forest restoration. Bridge between biological complexity and agronomic data validation for the PoF oracle.

**Patricia Lemos** · `Legal Advisor`
Law degree from UNICAP. Web3 legal architect specialized in environmental law and regulatory compliance. Strategist in forest asset jurisprudence and DOF-exempt exotic species legislation. Guardian of the protocol's legal framework bridging legacy law to programmable decentralized finance.

---

## ⚡ [RE]³ — ReReGeneradora: The First Decelerator

> **[RE]³ - ReReGeneradora** is the first known decelerator ⚡ and it is connected to what is already changing the logic of the world we live in: AI & Web3.
>
> For in an increasingly accelerated reality where new ideas & projects are captured by the gravitational pull of *trends* & *hypes*, decision-making becomes more an act of survival than of effective critical vision...
>
> Because today, right at this exact moment, more than ever, it is necessary to decelerate not only to eco-localize oneself, but also to become the master of your own acceleration.

**Pedro Bruder** · `[RE]³ Advisor`
Entrepreneurial-minded individual with a passion for changing the world through innovative education, self-learning tools, regenerative finance, Web3 and DeFi mechanics. Skilled in token economy, governance minting, blockchain, marketing strategy, and crafting learning culture.
[LinkedIn](https://www.linkedin.com/in/pedrobruder) · [GitHub](https://github.com/BasedCaveman)

**Enzo Garcia** · `[RE]³ Advisor`
Computer Science & Web3 enthusiast. Aims to transform gaming logic and blockchain security into tools for the next human frontier. Currently based in Lisbon, integrating into the European tech community. Skilled in problem-solving and scalable technologies.
[LinkedIn](https://www.linkedin.com/in/enzo-garcia-295066316) · [GitHub](https://github.com/F0rtyF0ur)

---

## Related Projects

- **[Vereda.Verify](https://github.com/G0vermind/vereda-verify-soroban)** — Physical supply chain audit panel for African Mahogany. Cross-contract integration with `rwa_vault` in Phase 2.

---

## License

[Apache 2.0](LICENSE) — Social Forest Protocol

---

<div align="center">

*Converting Ecological Flourishing into Programmable Prosperity on Stellar.*

`rwa_vault` · `sbt_reputation` · `$FLORA` · `C-CRED` · `C-DEBT` · `S-CRED`
`SEP-41` · `Soroban` · `x402` · `MPP` · `PoF` · `Regen Data Stream`

**[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)** · **[Stellar37°](https://stellar37.nearx.com.br)**

</div>

---

# 🌳 Social Forest Protocol

**Infraestrutura Descentralizada para Green RWA & Finanças Climáticas na Stellar**

*Convertendo Florescimento Ecológico em Prosperidade Programável*

> 🇺🇸 [English version above](#-social-forest-protocol)

---

## O Problema

O mercado de créditos de carbono atual opera com dados autorreportados, verificação centralizada e ciclos de emissão que chegam a 18 meses. Empresas que querem compensar emissões reais encontram barreiras de entrada técnica que inviabilizam o acesso direto a ativos florestais verificados.

**O resultado:** greenwashing em escala, capital climático represado e florestas que não recebem o financiamento que precisam.

---

## A Solução

O Social Forest converte o **florescimento ecológico** do Mogno Africano (*Khaya senegalensis*) no semiárido brasileiro em colateral programável on-chain na rede Stellar — transformando árvores em agentes econômicos autônomos que geram dividendos ambientais e financeiros.

Diferente de modelos estáticos de crédito de carbono, introduzimos o **Proof of Flourishing (PoF)**: uma prova dinâmica de saúde biômica auditada por IA que viabiliza uma economia circular **B2B2C** onde cada token cunhado é lastreado por uma árvore viva e verificada.

> **Vantagem competitiva única:** controle total da cadeia física — do Viveiro Maravilha (mudas) à Sómogno (beneficiamento) — garantindo a permanência dos ativos contra riscos climáticos e eliminando o risco de contraparte.

---

## Tokenomics do Protocolo

| Token | Tipo | Função |
|-------|------|---------|
| **RWA** `MOGNO` | Ativo do Mundo Real | Fração de árvore real. Garante *land tenure*, propriedade e direito ao lucro da colheita. Lastreado em biomassa viva de Mogno Africano. |
| **C-CRED** | Crédito de Carbono | Ecocrédito *ex-post* emitido com base na captura real de CO₂ verificada. Segue metodologias científicas rigorosas (GRI, SASB, SBTi). |
| **S-CRED** | Stewardship (PSA) | Pagamento por Serviços Ambientais. Recompensa conservação e biodiversidade — independente do sequestro de carbono. |
| **C-DEBT** | Ledger de Débito | Registro on-chain para empresas declararem pegadas de carbono (Escopos 1, 2 e 3) e comprovarem Net Zero. |
| **$FLORA** | Governança | Votação no protocolo. Atua como *Credit Class Admin* — curadoria de novas áreas e metodologias. |

---

## Arquitetura Técnica

### Smart Contracts — Soroban & Rust

**`rwa_vault`** — Token RWA SEP-41 (`MOGNO`)
- `admin_mint` restrito ao oráculo PoF — tokens só cunhados quando florescimento é criptograficamente provado
- SEP-41 completo: `transfer`, `transfer_from`, `approve`, `allowance`, `balance`
- Storage: `instance()` para admin · `persistent()` para balances e allowances

**`sbt_reputation`** — Motor de Green Cashback + SBT de Reputação
- `distribute_green_cashback(company, user, amount)` — Empresas Verificadas enviam frações RWA a consumidores
- Pontos de Impacto **não-transferíveis por design** — `transfer_reputation()` sempre falha (`SoulboundNonTransferable`)
- `get_user_impact(user) -> i128` — endpoint de leitura consumido pelo frontend

### Motor Proof of Flourishing — x402 + MPP + IA Vision

```
Dados Físicos (DAP/Altura)
    │  Coleta via IoT / Monitor / WhatsApp IA
    ▼
Regen Data Stream ──── ancoragem imutável on-chain
    │
    ▼
IA Vision Layer ──── validação multiespectral (satélite + drone)
    │  PoF threshold atingido
    ▼
x402 Payment Required ──── micropagamento de validação via Coinbase
    │  evento econômico disparado
    ▼
admin_mint() ──── rwa_vault cunha token lastreado em árvore viva
    │
    ▼
distribute_green_cashback() ──── sbt_reputation envia fração ao consumidor
```

> O Social Forest opera os **dois** protocolos oficiais de pagamentos agênticos da Stellar:
> `x402` (Coinbase) para micropagamentos de eventos de validação ·
> `MPP` (Stripe) para fluxos de on-ramp B2B institucional

---

## O Modelo B2B2C

> **O capital entra pelo B2B. O impacto chega ao B2C. O planeta é o beneficiário.**

```
Admin (Social Forest)
  └─ cadastra Empresas Verificadas + aprova limiares PoF
        │
        ▼
Âncora B2B (Empresa Parceira)
  └─ compra lotes RWA via Stripe MPP (fiat, sem crypto)
     configura Green Cashback por SKU/serviço
     acessa Analytics ESG + Greenshouting dashboard
        │  distribute_green_cashback() via x402
        ▼
Usuário B2C (Consumidor)
  └─ recebe micro-fração RWA + Pontos de Impacto (SBT)
     coleciona Folhas Comuns / Raras / Lendárias
     forja certificado de árvore real ao atingir a meta
        │  get_user_impact()
        ▼
Frontend (Florestas.Social — Next.js)
  └─ Viveiro Digital · Histórico de Impacto · Dashboard ODS
     voz na governança da Tesouraria Verde DAO ($FLORA)
```

---

## Alinhamento com ODS

| ODS | Contribuição |
|-----|-------------|
| **1 & 2** | Diversificação de renda rural (apicultura consorciada); segurança alimentar |
| **5** | Igualdade de gênero na gestão de ativos; equipes femininas nos viveiros; carteiras Stellar autônomas para mulheres rurais |
| **6** | Restauração de ecossistemas protegendo bacias hidrográficas |
| **8** | Trabalho decente no interior do Ceará; inovação DeFi |
| **9** | Digitalização de ativos naturais; infraestrutura NbS aberta |
| **10** | Stellar permite populações vulneráveis acessarem mercados globais sem intermediários financeiros |
| **12** | Modelo Cashback Verde; consumo e produção responsáveis |
| **13** | Sequestro de carbono; Acordo de Paris + Marco Kunming-Montreal |
| **15** | Manejo florestal e proteção da biodiversidade |
| **16 & 17** | Governança DAO; parcerias B2B2C globais; Agenda 2030 |

*Alinhado com GEO-7, UNEA-7 e o Relatório sobre a Lacuna de Adaptação (até USD 365 bilhões/ano para nações em desenvolvimento).*

---

## Início Rápido

```bash
# Pré-requisitos
rustup target add wasm32-unknown-unknown
cargo install stellar-cli

# Clone e instalação
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol

# Build dos contratos
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/rwa_vault/Cargo.toml
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/sbt_reputation/Cargo.toml
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/hero_journey/Cargo.toml

# Testes
cargo test --manifest-path contracts/rwa_vault/Cargo.toml
cargo test --manifest-path contracts/sbt_reputation/Cargo.toml
cargo test --manifest-path contracts/hero_journey/Cargo.toml

# Frontend
cd apps/web && npm install && npm run dev  # → http://localhost:3000
```

---

## Roadmap

| Fase | Status | Marcos |
|------|--------|--------|
| **Fase 1 — Seed** | 🔨 Construindo | `rwa_vault` + `sbt_reputation` + `hero_journey` · Stripe MPP · Primeiro registro PoF · Piloto B2B · Viveiro Maravilha "Cliente Zero" |
| **Fase 2 — Crescimento** | 🔜 Planejado | IA Vision oracle na Mainnet · Green Cashback ativo · Cross-contract `vereda-core` · $FLORA governance · Integração Sómogno |
| **Fase 3 — Escala** | 🔜 Planejado | `c_cred` + `c_debt` + `amm_impact` · Marketplace secundário RWA · Transição para DAO · Porto do Pecém exportação · Integração institucional completa |

---

## Core Team — The Netweavers

**Gustavo Gonçalves** · `Founder & Tech Lead`
Silvicultor e empreendedor em madeiras nobres desde o final dos anos 90. Embaixador da Rede Stellar no Brasil/Ceará. Builder do tech-stack Green RWA e nó estratégico no ABC+ Ceará — bioeconomia e agricultura de baixo carbono.
[LinkedIn](https://www.linkedin.com/in/gustavo-gon%C3%A7alves-9a4a1523/)

**Vinicius Brás Rocha** · `Arquiteto ReFi`
P2P glocal explorer e netweaver focado em co-criar uma cibercultura regenerativa no Web3 através do ReRe (Regenerative Resources). Hacker whitehat com raízes no movimento cypherpunk dos anos 90 e no ecossistema pré-lançamento do Bitcoin.
[LinkedIn](https://www.linkedin.com/in/vrselfmedia/)

**Clarkson Luiz Buriche** · `Dev Ambiental & IA`
Desenvolvedor focado em impacto e engenheiro ambiental sênior. Arquiteto Rust e IA para regeneração climática e governança de recursos naturais. Especialista em traduzir complexidade socioambiental em sistemas digitais escaláveis.
[LinkedIn](https://www.linkedin.com/in/clarkson-luiz-buriche-bartalini-80446a6b/)

**Iara Magalhães** · `Web3 Developer`
Desenvolvedora Web3 e entusiasta de blockchain dominando Rust e sistemas descentralizados. Exploradora de arquiteturas seguras de smart contracts no ecossistema Soroban e contribuidora do desenvolvimento técnico do Social Forest.
[LinkedIn](https://www.linkedin.com/in/iaiakedemy)

---

## Advisors — Council of Guardians

**Francisco das Chagas Rosa** · `Consultor Agronômico`
Engenheiro agrônomo e consultor técnico sênior em silvicultura tropical. Especialista no manejo de alta performance de Mogno Africano e restauração florestal. Ponte entre a complexidade biológica e a validação de dados agronômicos para o oráculo PoF.

**Patricia Lemos** · `Consultora Jurídica`
Formada em Direito pela UNICAP. Arquiteta jurídica Web3 especializada em direito ambiental e conformidade regulatória. Estrategista em jurisprudência de ativos florestais e legislação de espécies exóticas isentas de DOF. Guardiã da estrutura legal do protocolo, unindo o direito tradicional às finanças programáveis descentralizadas.

---

## ⚡ [RE]³ — ReReGeneradora: A Primeira Desaceleradora

> A **[RE]³ - ReReGeneradora** é a primeira desaceleradora que se tem notícia ⚡ e ligada ao que já está mudando a lógica do mundo que vivemos: IA & Web3. ⚡
>
> Pois, numa realidade cada vez mais acelerada onde novas ideias & projetos são capturados pela força gravitacional dos *trends* & *hypes*, as tomadas de decisão são mais um ato de sobrevivência do que de efetiva visão crítica...
>
> Pois hoje, neste exato momento, mais do que nunca, é preciso desacelerar não apenas para se eco-localizar, mas também para se tornar dono da sua própria aceleração.

**Pedro Bruder** · `Conselheiro [RE]³`
Indivíduo com mentalidade empreendedora e paixão por mudar o mundo através de educação inovadora, ferramentas de autoaprendizagem, finanças regenerativas, mecânicas de Web3 e DeFi. Especialista em economia de tokens, cunhagem de governança, blockchain, estratégia de marketing e na criação de uma cultura de aprendizado.
[LinkedIn](https://www.linkedin.com/in/pedrobruder) · [GitHub](https://github.com/BasedCaveman)

**Enzo Garcia** · `Conselheiro [RE]³`
Entusiasta de Ciência da Computação & Web3. Desejo transformar a lógica dos games e a segurança do Blockchain em ferramentas para a próxima fronteira humana. Atualmente em Lisboa, integrando-me à comunidade tech europeia. Facilidade em resolver problemas e apaixonado por tecnologias que escalam.
[LinkedIn](https://www.linkedin.com/in/enzo-garcia-295066316) · [GitHub](https://github.com/F0rtyF0ur)

---

## Ecossistema Relacionado

- **[Vereda.Verify](https://github.com/G0vermind/vereda-verify-soroban)** — Painel de rastreabilidade da cadeia física do Mogno Africano. Integração cross-contract com `rwa_vault` na Fase 2.

---

## Licença

[Apache 2.0](LICENSE) — Social Forest Protocol

---

<div align="center">

*Convertendo Florescimento Ecológico em Prosperidade Programável na Stellar.*

---
### 📞 Contato / Contact
Para parcerias B2B, auditorias ou dúvidas sobre o protocolo:
- **Email:** gutogn@gmail.com
- **WhatsApp:** [+55 88 99643-7794](https://wa.me/5588996437794)

`rwa_vault` · `sbt_reputation` · `$FLORA` · `C-CRED` · `C-DEBT` · `S-CRED`
`SEP-41` · `Soroban` · `x402` · `MPP` · `PoF` · `Regen Data Stream`

**[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)** · **[Stellar37°](https://stellar37.nearx.com.br)**

</div>
