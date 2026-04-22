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
[![Stellar37°](https://img.shields.io/badge/Stellar37°-Acceleration-7B6FEE?style=for-the-badge)](https://stellar37.nearx.com.br)

> 🇧🇷 [Versão em Português abaixo](#-social-forest-protocol-1)

</div>

---

## The Mission

Most sustainability promises stop at marketing. We build the infrastructure that makes them verifiable.

**Social Forest democratizes sustainability** by connecting everyday consumption to real environmental regeneration. Every Real spent at a partner brand becomes biological heritage — a fraction of a living African Mahogany tree (*Khaya senegalensis*), anchored on the Stellar blockchain, owned by the person who earned it.

We call this model **RWA as a Service (RWAaaS)**: companies don't invest in the asset — they use our infrastructure to distribute regenerative cashback to their customers. **The tree belongs to whoever redeems it.**

> **Unique competitive moat:** full control of the physical supply chain — from Viveiro Maravilha (seedlings) to Sómogno (processing) — eliminates counterparty risk and guarantees the permanence of every on-chain asset.

---

## The Problem

Today's carbon credit market operates on self-reported data, centralized verification, and issuance cycles up to 18 months long. Companies seeking to offset real emissions face technical barriers blocking direct access to verified forest assets.

**The result:** greenwashing at scale, trapped climate capital, and forests that don't receive the financing they need.

---

## How It Works — The B2B2C Flow

```
🏢 B2B Partner (Company)
  └─ Buys RWA lot via Stripe MPP (BRL/USD — no crypto custody required)
     Configures LEAF cashback rules per SKU or service
     Accesses ESG Analytics + Greenshouting dashboard
          │  distribute_green_cashback() on Soroban
          ▼
🌱 B2C User (Consumer)
  └─ Captures LEAF Tokens via purchases / missions
     Accumulates Common → Rare → Legendary Leaves
     Redeems: forge_tree() → receives Mogno NFT (RWA)
          │  The tree belongs to whoever redeems the cashback
          ▼
🌍 Planet
  └─ Real tree growing in the Brazilian semi-arid
     CO₂ sequestered · biodiversity preserved · rural income generated
```

**Capital flows in from B2B. The asset lands with B2C. The planet is the beneficiary.**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [LIGHTPAPER.md](LIGHTPAPER.md) | Climate Finance thesis, B2B2C strategy, full token architecture |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Dev environment setup, branch workflow, code standards |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Trust model, storage schema, cross-contract flows |
| [docs/SECURITY.md](docs/SECURITY.md) | Security policy, audit tools, invariants |
| [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md) | Soroban audit readiness checklist (Certora + STRIDE) |
| [docs/FRONTEND_ARCHITECTURE.md](docs/FRONTEND_ARCHITECTURE.md) | Next.js portal structure, routing, component map |
| [docs/CONTRACT_SPEC.md](docs/CONTRACT_SPEC.md) | Contract interfaces, storage layout, error codes |
| Whitepaper *(coming soon)* | Full Soroban contract architecture + x402/MPP integration spec |

---

## Protocol Tokenomics

| Token | Type | Role |
|-------|------|------|
| **LEAF** | Fungible (SEP-41) | Regenerative cashback fuel. Distributed by companies, captured by consumers via purchases and missions. The engine of the B2B2C economy. |
| **NFT Mogno** (RWA) | Non-Fungible · Soulbound | Fraction of a real African Mahogany tree. Evolves Common → Rare → Legendary based on engagement. Forged from accumulated LEAF. |
| **C-CRED** | Carbon Credit | Ex-post ecocredit based on verified real CO₂ capture. Follows GRI, SASB, SBTi methodologies. Tradeable in the B2B non-speculative DeFi layer. |
| **S-CRED** | Stewardship (PES) | Payment for Environmental Services. Rewards conservation and biodiversity — independent of carbon sequestration. |
| **C-DEBT** | Carbon Debt Ledger | On-chain registry for companies to declare footprints (Scopes 1, 2 & 3) and prove Net Zero compliance. |
| **$FLORA** | Governance | Protocol voting token. Acts as Credit Class Admin — curating new areas, methodologies, and the authorized agent list. |

---

## DeFi Layer — Two Complementary Engines

### ⚖️ Non-Speculative Layer — ESG Compliance

For corporate compliance. Companies manage environmental liabilities with integrity, not speculation.

- **C-DEBT Management:** Register and monitor carbon footprint on-chain. No self-reported spreadsheets.
- **C-CRED Settlement:** Companies exceeding targets offer verified ex-post credits to organizations with carbon debts.
- **Net Zero Proof:** Credit retirement on Stellar creates irrefutable audit trails for GRI, SASB, and SBTi.
- **Non-Speculative AMM:** Exchange values driven by real forest restoration costs, curated by the DAO via `$FLORA`.

### 📈 Speculative Layer — Secondary RWA Market *(Phase 3)*

As Mogno NFTs evolve in rarity and biological maturity, a secondary market emerges:

- Holders of **Legendary NFTs** can sell RWAs to companies seeking to acquire premium timber or mature biological assets.
- **Price discovery** grounded in real silviculture data: DAP, height, age, and PoF oracle records.
- Transforms the consumer from passive cashback recipient into an active participant in a real-world asset market — without needing to understand blockchain.

---

## Technical Architecture

### Smart Contracts — Soroban & Rust

```
contracts/
├── rwa_vault/       ← SEP-41 LEAF Token + Mogno NFT minting    🔨 testnet
├── sbt_reputation/  ← Green Cashback Engine + Soulbound SBT     🔨 in dev
├── hero_journey/    ← LEAF economy + forge_tree() + rarity      🔨 in dev
├── governance/      ← $FLORA weighted voting                    🔜 roadmap
├── c_cred/          ← Ex-post carbon credit issuance            🔜 roadmap
├── c_debt/          ← Corporate carbon audit ledger             🔜 roadmap
└── amm_impact/      ← Non-speculative DeFi settlement AMM       🔜 roadmap
```

**`rwa_vault`** — Core Asset Contract
- `admin_mint` gated behind the PoF oracle — tokens only minted when flourishing is cryptographically proven
- Full SEP-41: `transfer`, `transfer_from`, `approve`, `allowance`, `balance`
- Security: `require_auth()` · `extend_ttl()` · explicit error enum · emergency pause

**`sbt_reputation`** — Green Cashback Engine
- `distribute_green_cashback(company, user, amount)` — double-validated: `require_auth` + on-chain whitelist
- Impact Points are **Soulbound by design** — `transfer_reputation()` always panics (`SoulboundNonTransferable`)

**`hero_journey`** — LEAF Economy + NFT Forge
- Manages LEAF accumulation and rarity evolution (Common → Rare → Legendary)
- `forge_tree()` — consumer triggers when LEAF threshold is reached, mints the Mogno NFT
- Legendary Leaves unlock secondary market access in Phase 3

### Proof of Flourishing — x402 + MPP + AI Vision

```
Physical Data (DAP / Height)
    │  IoT sensors / Human monitors / WhatsApp AI
    ▼
Regen Data Stream ──── immutable on-chain anchoring
    │
    ▼
AI Vision Layer ──── multispectral validation (satellite + drone)
    │  PoF threshold reached
    ▼
x402 Payment Required ──── validation micropayment via Coinbase
    │
    ▼
admin_mint() ──── rwa_vault mints LEAF backed by living tree
    │
    ▼
distribute_green_cashback() ──── LEAF reaches consumer wallet
```

> Social Forest runs **both** official Stellar agentic payment protocols:
> `x402` (Coinbase) for PoF validation micropayments ·
> `MPP` (Stripe) for institutional B2B on-ramp flows

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Rust + Soroban SDK 21 |
| Frontend | Next.js 14 · TypeScript · TailwindCSS |
| Wallet | Freighter API v6 (Web3) · Google Account Abstraction (Web2) |
| Payments | Stripe Managed Payments (MPP) |
| Oracle Pipeline | n8n · x402 Protocol · AI Vision |
| Blockchain | Stellar Network · SEP-41 · SEP-1 (stellar.toml) |

---

## Repository Structure

```
social-forests-protocol/
│
├── apps/
│   └── web/                    # Next.js frontend — Florestas.Social
│       └── src/app/            # B2B2C dashboard + B2B corporate panel
│
├── contracts/                  # Rust workspace — Soroban smart contracts
│   ├── rwa_vault/              # SEP-41 LEAF Token + Mogno NFT ✅
│   ├── sbt_reputation/         # Green Cashback + Soulbound SBT 🔨
│   ├── hero_journey/           # LEAF economy + NFT forge 🔨
│   ├── governance/             # $FLORA voting (roadmap)
│   ├── c_cred/                 # Ex-post carbon credit (roadmap)
│   ├── c_debt/                 # Corporate carbon ledger (roadmap)
│   └── amm_impact/             # Non-speculative AMM (roadmap)
│
├── services/
│   ├── stripe_gateway/         # Fiat on-ramp via Stripe MPP
│   └── pof_oracle/             # AI Vision + x402/MPP PoF engine (n8n)
│
├── docs/
│   ├── ARCHITECTURE.md         # Trust model + storage schema
│   ├── SECURITY.md             # Security policy + audit tools
│   ├── SECURITY_CHECKLIST.md   # Soroban audit readiness checklist
│   ├── FRONTEND_ARCHITECTURE.md# Next.js portal map + routing
│   └── CONTRACT_SPEC.md        # Contract interfaces + error codes
│
├── .well-known/
│   └── stellar.toml            # SEP-1: asset definitions + metadata
│
├── Cargo.toml                  # Rust workspace root
├── CONTRIBUTING.md · LIGHTPAPER.md
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

# Run tests
cargo test --manifest-path contracts/rwa_vault/Cargo.toml -- --nocapture
cargo test --manifest-path contracts/sbt_reputation/Cargo.toml -- --nocapture
cargo test --manifest-path contracts/hero_journey/Cargo.toml -- --nocapture

# Frontend
cd apps/web && npm install && npm run dev  # → http://localhost:3000
```

---

## Roadmap

| Phase | Status | Milestones |
|-------|--------|-----------|
| **Phase 1 — Seed** | 🔨 Building | `rwa_vault` + `sbt_reputation` + `hero_journey` on Testnet · Stripe MPP · First PoF registry · B2B pilot · Viveiro Maravilha "Client Zero" |
| **Phase 2 — Growth** | 🔜 Planned | AI Vision oracle on Mainnet · LEAF cashback live · NFT Mogno evolution · `vereda-core` cross-contract · $FLORA governance · Sómogno integration |
| **Phase 3 — Scale** | 🔜 Planned | `c_cred` + `c_debt` + `amm_impact` · Secondary RWA marketplace · DAO transition · Pecém Port export · Full institutional onboarding |

---

## SDG Alignment

| SDG | Contribution |
|-----|-------------|
| **1 & 2** | Rural income diversification (intercropped beekeeping); food security |
| **5** | Gender equality in asset management; women-led nursery teams; autonomous Stellar wallets for rural women |
| **6** | Ecosystem restoration protecting watersheds |
| **8** | Decent work in inland Ceará; DeFi infrastructure innovation |
| **9** | Digitization of natural assets; open NbS infrastructure |
| **10** | Stellar enables vulnerable populations to access global markets without intermediaries |
| **12** | Regenerative Cashback model; responsible consumption and production |
| **13** | Carbon sequestration; Paris Agreement + Kunming-Montreal alignment |
| **15** | Forest management and biodiversity protection |
| **16 & 17** | DAO governance; global B2B2C partnerships; Agenda 2030 implementation |

*Aligned with GEO-7, UNEA-7, and the Adaptation Gap Report (up to USD 365 billion/year needed for developing nations).*

---

## Core Team — The Netweavers

**Gustavo Gonçalves** · `Founder & Tech Lead`
Silviculturist and entrepreneur in high-value hardwoods since the late 90s. Stellar Network Ambassador for Brazil/Ceará. Builder of the Green RWA tech-stack and strategic node within the ABC+ Ceará low-carbon agriculture and bioeconomy ecosystem.
[LinkedIn](https://www.linkedin.com/in/gustavo-gon%C3%A7alves-9a4a1523/) · [GitHub](https://github.com/G0vermind)

**Vinicius Braz Rocha** · `ReFi Architect`
P2P glocal explorer and netweaver co-creating regenerative cyberculture in Web3 through ReRe (Regenerative Resources). Whitehat hacker from the 1990s cypherpunk movement with roots in the pre-launch Bitcoin ecosystem.
[LinkedIn](https://www.linkedin.com/in/vrselfmedia/) · [GitHub](https://github.com/glocalVR)

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

> **[RE]³ - ReReGeneradora** is the first known decelerator ⚡ connected to what is already changing the logic of the world we live in: AI & Web3.
>
> In an increasingly accelerated reality where new ideas & projects are captured by the gravitational pull of *trends* & *hypes*, decision-making becomes more an act of survival than of effective critical vision.
>
> Today, more than ever, it is necessary to decelerate — not only to eco-localize oneself, but to become the master of your own acceleration.

GitHub: **[ReRegeneradora](https://github.com/ReRe-Recursos-Regenerativos)**

**Pedro Bruder** · `[RE]³ Advisor`
Entrepreneurial-minded with a passion for changing the world through innovative education, self-learning tools, regenerative finance, Web3 and DeFi mechanics. Skilled in token economy, governance minting, blockchain, marketing strategy, and crafting learning culture.
[LinkedIn](https://www.linkedin.com/in/pedrobruder) · [GitHub](https://github.com/BasedCaveman)

**Vinícius Braz Rocha (glocalVR)** · `[RE]³ Advisor & Protocol Co-initiator`
Co-creator at [ReRegeneradora](https://github.com/ReRe-Recursos-Regenerativos). Expert in regenerative governance, bridging biological assets and sustainable impact models, ensuring the protocol follows circular economy best practices.
[LinkedIn](https://www.linkedin.com/in/vrselfmedia/) · [GitHub](https://github.com/glocalVR)

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

`rwa_vault` · `sbt_reputation` · `hero_journey` · `LEAF` · `NFT Mogno` · `C-CRED` · `C-DEBT` · `$FLORA`
`SEP-41` · `Soroban` · `x402` · `MPP` · `PoF` · `Regen Data Stream`

**[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)** · **[Stellar37°](https://stellar37.nearx.com.br)**

📧 [gutogn@gmail.com](mailto:gutogn@gmail.com) · 📱 [+55 88 99643-7794](https://wa.me/5588996437794)

</div>

---

# 🌳 Social Forest Protocol

**Infraestrutura Descentralizada para Green RWA & Finanças Climáticas na Stellar**

*Convertendo Florescimento Ecológico em Prosperidade Programável*

> 🇺🇸 [English version above](#-social-forest-protocol)

---

## A Missão

A maioria das promessas de sustentabilidade para na comunicação. A gente constrói a infraestrutura que as torna verificáveis.

**O Social Forest democratiza a sustentabilidade** conectando o consumo cotidiano à regeneração ambiental real. Cada Real gasto numa marca parceira vira patrimônio biológico — uma fração de um Mogno Africano (*Khaya senegalensis*) vivo, ancorado na blockchain Stellar, de propriedade de quem o ganhou.

Chamamos isso de **RWA as a Service (RWAaaS)**: as empresas não "investem" no ativo — elas usam nossa infraestrutura para distribuir cashback regenerativo aos clientes. **A árvore pertence a quem resgata.**

> **Vantagem competitiva única:** controle total da cadeia física — do Viveiro Maravilha (mudas) à Sómogno (beneficiamento) — elimina risco de contraparte e garante a permanência de cada ativo on-chain.

---

## O Problema

O mercado de créditos de carbono atual opera com dados autorreportados, verificação centralizada e ciclos de emissão que chegam a 18 meses. Empresas que querem compensar emissões reais encontram barreiras técnicas que inviabilizam o acesso direto a ativos florestais verificados.

**O resultado:** greenwashing em escala, capital climático represado e florestas que não recebem o financiamento que precisam.

---

## Como Funciona — O Fluxo B2B2C

```
🏢 Parceiro B2B (Empresa)
  └─ Compra lote RWA via Stripe MPP (BRL/USD — sem custódia crypto)
     Configura cashback em LEAF por SKU ou serviço
     Acessa Analytics ESG + dashboard Greenshouting
          │  distribute_green_cashback() no Soroban
          ▼
🌱 Usuário B2C (Consumidor)
  └─ Captura LEAF Tokens via compras / missões
     Acumula Folhas Comuns → Raras → Lendárias
     Resgata: forge_tree() → recebe NFT Mogno (RWA)
          │  A árvore é de quem resgata o cashback
          ▼
🌍 Planeta
  └─ Árvore real crescendo no semiárido brasileiro
     CO₂ sequestrado · biodiversidade preservada · renda rural gerada
```

**O capital entra pelo B2B. O ativo chega ao B2C. O planeta é o beneficiário.**

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [LIGHTPAPER.md](LIGHTPAPER.md) | Tese de Finanças Climáticas, estratégia B2B2C, tokenomics completo |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Setup do ambiente, workflow de branches, padrões de código |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Trust model, schema de storage, fluxos cross-contract |
| [docs/SECURITY.md](docs/SECURITY.md) | Política de segurança, ferramentas de auditoria, invariantes |
| [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md) | Checklist de auditoria Soroban (Certora + STRIDE) |
| [docs/FRONTEND_ARCHITECTURE.md](docs/FRONTEND_ARCHITECTURE.md) | Estrutura dos portais Next.js, roteamento, mapa de componentes |
| [docs/CONTRACT_SPEC.md](docs/CONTRACT_SPEC.md) | Interfaces dos contratos, storage layout, códigos de erro |
| Whitepaper *(em breve)* | Arquitetura completa dos contratos Soroban + spec x402/MPP |

---

## Tokenomics do Protocolo

| Token | Tipo | Função |
|-------|------|---------|
| **LEAF** | Fungível (SEP-41) | Combustível do cashback regenerativo. Distribuído por empresas, capturado por consumidores via compras e missões. |
| **NFT Mogno** (RWA) | Não-Fungível · Soulbound | Fração de um Mogno Africano real. Evolui Comum → Raro → Lendário com o engajamento. Forjado a partir do LEAF acumulado. |
| **C-CRED** | Crédito de Carbono | Ecocrédito *ex-post* com captura real de CO₂ verificada. Segue GRI, SASB, SBTi. Negociável na camada DeFi B2B. |
| **S-CRED** | Stewardship (PSA) | Pagamento por Serviços Ambientais. Recompensa conservação e biodiversidade — independente do sequestro de carbono. |
| **C-DEBT** | Ledger de Débito | Registro on-chain para empresas declararem pegadas de carbono (Escopos 1, 2 e 3) e comprovarem Net Zero. |
| **$FLORA** | Governança | Votação no protocolo. Atua como *Credit Class Admin* — curadoria de novas áreas e metodologias. |

---

## Camada DeFi — Dois Motores Complementares

### ⚖️ Camada Não-Especulativa — Conformidade ESG

Para compliance corporativo. As empresas gerenciam passivos ambientais com integridade, sem especulação.

- **Gestão de C-DEBT:** Registro e monitoramento da pegada de carbono on-chain. Chega de planilhas autorreportadas.
- **Liquidação de C-CRED:** Empresas que superam metas oferecem créditos verificados *ex-post* a organizações com débitos.
- **Prova de Net Zero:** Aposentadoria de créditos na Stellar cria trilhas de auditoria irrefutáveis para GRI, SASB e SBTi.
- **AMM Não-Especulativa:** Valores orientados pelo custo real de restauração florestal, curados pela DAO via `$FLORA`.

### 📈 Camada Especulativa — Mercado Secundário RWA *(Fase 3)*

À medida que os NFTs Mogno evoluem em raridade e maturidade biológica, um mercado secundário emerge:

- Holders de **NFTs Lendários** podem vender RWAs a empresas interessadas em adquirir madeira nobre ou ativos biológicos maduros.
- **Formação de preço** ancorada na economia real da silvicultura: DAP, altura, idade e registros do oráculo PoF.
- Transforma o consumidor de receptor passivo em participante ativo do mercado de ativos reais — sem precisar entender blockchain.

---

## Arquitetura Técnica

### Smart Contracts — Soroban & Rust

**`rwa_vault`** — Contrato Principal de Ativos
- `admin_mint` restrito ao oráculo PoF — tokens só cunhados quando florescimento é criptograficamente provado
- SEP-41 completo: `transfer`, `transfer_from`, `approve`, `allowance`, `balance`
- Segurança: `require_auth()` · `extend_ttl()` · enum de erros explícito · emergency pause

**`sbt_reputation`** — Motor de Green Cashback
- `distribute_green_cashback(company, user, amount)` — validação dupla: `require_auth` + whitelist on-chain
- Pontos de Impacto **Soulbound por design** — `transfer_reputation()` sempre falha

**`hero_journey`** — Economia de LEAF + Forja do NFT
- Gerencia acúmulo de LEAF e evolução de raridade (Comum → Raro → Lendário)
- `forge_tree()` — acionado pelo consumidor ao atingir a meta, cria o NFT Mogno

### Motor Proof of Flourishing — x402 + MPP + IA Vision

```
Dados Físicos (DAP/Altura)
    │  Sensores IoT / Monitor humano / WhatsApp IA
    ▼
Regen Data Stream ──── ancoragem imutável on-chain
    │
    ▼
IA Vision Layer ──── validação multiespectral (satélite + drone)
    │  PoF threshold atingido
    ▼
x402 Payment Required ──── micropagamento de validação via Coinbase
    │
    ▼
admin_mint() ──── rwa_vault cunha LEAF lastreado em árvore viva
    │
    ▼
distribute_green_cashback() ──── LEAF chega na carteira do consumidor
```

> O Social Forest opera os **dois** protocolos oficiais de pagamentos agênticos da Stellar:
> `x402` (Coinbase) para micropagamentos de validação PoF ·
> `MPP` (Stripe) para fluxos de on-ramp B2B institucional

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
cargo test --manifest-path contracts/rwa_vault/Cargo.toml -- --nocapture
cargo test --manifest-path contracts/sbt_reputation/Cargo.toml -- --nocapture
cargo test --manifest-path contracts/hero_journey/Cargo.toml -- --nocapture

# Frontend
cd apps/web && npm install && npm run dev  # → http://localhost:3000
```

---

## Roadmap

| Fase | Status | Marcos |
|------|--------|--------|
| **Fase 1 — Seed** | 🔨 Construindo | `rwa_vault` + `sbt_reputation` + `hero_journey` na Testnet · Stripe MPP · Primeiro registro PoF · Piloto B2B · Viveiro Maravilha "Cliente Zero" |
| **Fase 2 — Crescimento** | 🔜 Planejado | IA Vision oracle na Mainnet · LEAF cashback ativo · Sistema de evolução NFT Mogno · Cross-contract `vereda-core` · $FLORA governance · Integração Sómogno |
| **Fase 3 — Escala** | 🔜 Planejado | `c_cred` + `c_debt` + `amm_impact` · Mercado secundário de RWA · Transição para DAO · Porto do Pecém exportação · Integração institucional completa |

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
| **12** | Modelo Cashback Regenerativo; consumo e produção responsáveis |
| **13** | Sequestro de carbono; Acordo de Paris + Marco Kunming-Montreal |
| **15** | Manejo florestal e proteção da biodiversidade |
| **16 & 17** | Governança DAO; parcerias B2B2C globais; Agenda 2030 |

*Alinhado com GEO-7, UNEA-7 e o Relatório sobre a Lacuna de Adaptação (até USD 365 bilhões/ano para nações em desenvolvimento).*

---

## Core Team — The Netweavers

**Gustavo Gonçalves** · `Founder & Tech Lead`
Silvicultor e empreendedor em madeiras nobres desde o final dos anos 90. Embaixador da Rede Stellar no Brasil/Ceará. Builder do tech-stack Green RWA e nó estratégico no ABC+ Ceará — bioeconomia e agricultura de baixo carbono.
[LinkedIn](https://www.linkedin.com/in/gustavo-gon%C3%A7alves-9a4a1523/) · [GitHub](https://github.com/G0vermind)

**Vinicius Braz Rocha** · `Arquiteto ReFi`
P2P glocal explorer e netweaver co-criando cibercultura regenerativa no Web3 via ReRe (Regenerative Resources). Hacker whitehat com raízes no movimento cypherpunk dos anos 90 e no ecossistema pré-lançamento do Bitcoin.
[LinkedIn](https://www.linkedin.com/in/vrselfmedia/) · [GitHub](https://github.com/glocalVR)

**Clarkson Luiz Buriche** · `Dev Ambiental & IA`
Engenheiro ambiental sênior e desenvolvedor focado em impacto. Arquiteto Rust e IA para regeneração climática e governança de recursos naturais. Especialista em traduzir complexidade socioambiental em sistemas digitais escaláveis.
[LinkedIn](https://www.linkedin.com/in/clarkson-luiz-buriche-bartalini-80446a6b/)

**Iara Magalhães** · `Web3 Developer`
Desenvolvedora Web3 dominando Rust e sistemas descentralizados. Exploradora de arquiteturas seguras de smart contracts no ecossistema Soroban e contribuidora do desenvolvimento técnico do Social Forest.
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

GitHub: **[ReRegeneradora](https://github.com/ReRe-Recursos-Regenerativos)**

**Pedro Bruder** · `Conselheiro [RE]³`
Indivíduo com mentalidade empreendedora e paixão por mudar o mundo através de educação inovadora, ferramentas de autoaprendizagem, finanças regenerativas, mecânicas de Web3 e DeFi. Especialista em economia de tokens, cunhagem de governança, blockchain, estratégia de marketing e na criação de uma cultura de aprendizado.
[LinkedIn](https://www.linkedin.com/in/pedrobruder) · [GitHub](https://github.com/BasedCaveman)

**Vinícius Braz Rocha (glocalVR)** · `Conselheiro [RE]³ & Co-iniciador do Protocolo`
Co-criador na [ReRegeneradora](https://github.com/ReRe-Recursos-Regenerativos). Especialista em governança regenerativa, fazendo a ponte entre ativos biológicos e modelos de impacto sustentável, garantindo que o protocolo siga as melhores práticas de economia circular.
[LinkedIn](https://www.linkedin.com/in/vrselfmedia/) · [GitHub](https://github.com/glocalVR)

**Enzo Garcia** · `Conselheiro [RE]³`
Entusiasta de Ciência da Computação & Web3. Transformando a lógica dos games e a segurança do blockchain em ferramentas para a próxima fronteira humana. Atualmente em Lisboa, integrando a comunidade tech europeia. Apaixonado por resolução de problemas e tecnologias que escalam.
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

`rwa_vault` · `sbt_reputation` · `hero_journey` · `LEAF` · `NFT Mogno` · `C-CRED` · `C-DEBT` · `$FLORA`
`SEP-41` · `Soroban` · `x402` · `MPP` · `PoF` · `Regen Data Stream`

**[Stellar](https://stellar.org)** · **[Soroban](https://soroban.stellar.org)** · **[Stellar37°](https://stellar37.nearx.com.br)**

📧 [gutogn@gmail.com](mailto:gutogn@gmail.com) · 📱 [+55 88 99643-7794](https://wa.me/5588996437794)

</div>
