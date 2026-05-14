.PHONY: build test clean dev

build:
	@echo "Compilando contratos Soroban (wasm32v1-none)..."
	cargo build --target wasm32v1-none --release -p leaf_token
	cargo build --target wasm32v1-none --release -p collateral_vault
	cargo build --target wasm32v1-none --release -p guardian_id
	cargo build --target wasm32v1-none --release -p company_id
	cargo build --target wasm32v1-none --release -p forest_mythos_vault
	cargo build --target wasm32v1-none --release -p journey_orchestrator

test:
	@echo "Executando testes dos contratos..."
	cargo test --workspace -- --nocapture

clean:
	cargo clean
	rm -rf target/

dev:
	@echo "Iniciando frontend Next.js..."
	cd apps/web && npm run dev
