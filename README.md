Breve Tutorial para iniciar os requisitos da prova:
# Projeto DevOps – Passo a Passo Completo (VM, Docker, PostgreSQL, Pipeline)

Este guia detalha **passo a passo** o que você deve fazer para executar com sucesso todo o fluxo da prova de DevOps usando Azure, Docker, GitHub e PostgreSQL.

---

## ✅ ETAPA 1 – CRIAR A VM (pelo portal Azure)
1. Acesse o [portal do Azure](https://portal.azure.com)
2. Crie um Grupo de Recursos (se ainda não tiver)
3. Crie uma VM Ubuntu
   - Tamanho: `Standard B1s` (ou similar)
   - Autenticação: Chave SSH (ou senha)
   - Libere a **porta 22** (SSH) e **porta 3000** (sua aplicação)
4. Finalize e aguarde a criação
5. Copie o IP público da VM

---

## ✅ ETAPA 2 – ACESSAR A VM VIA SSH

```bash
ssh usuario@IP_DA_VM
```

---

## ✅ ETAPA 3 – INSTALAR DOCKER E POSTGRESQL NA VM

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## ✅ ETAPA 4 – CONFIGURAR BANCO DE DADOS

```bash
sudo -u postgres psql
```

No console do PostgreSQL:
```sql
CREATE USER admin WITH PASSWORD 'admin';
CREATE DATABASE minhaapi;
GRANT ALL PRIVILEGES ON DATABASE minhaapi TO admin;
\q
```

---

## ✅ ETAPA 5 – CLONAR O PROJETO DO GITHUB

```bash
git clone https://github.com/AnderKamada/meu-projeto-devops.git
cd meu-projeto-devops
```

---

## ✅ ETAPA 6 – CRIAR A IMAGEM DO DOCKER

```bash
sudo docker build -t minha-api .
```
Se ele não existir, recrie com:

nano Dockerfile

Cole este conteúdo:

FROM node:18
WORKDIR /app
COPY ./app /app
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]

Salve com Ctrl + O, Enter, e Ctrl + X
---

## ✅ ETAPA 7 – RODAR O CONTAINER DA APLICAÇÃO

```bash
sudo docker run -d --name app --network host minha-api
```

---

## ✅ ETAPA 8 – TESTAR A APLICAÇÃO

Abra o navegador:
```
http://IP_DA_VM:3000
```

Você deve ver o JSON com `msg` e `dbTime`.

---

## ✅ ETAPA 9 – VERIFICAR `azure-pipelines.yml` NO GITHUB

- Confirme que o arquivo `azure-pipelines.yml` está na raiz do repositório
- Se não estiver, crie e comite via portal do Azure DevOps ou pelo terminal

---

## ✅ ETAPA 10 – CONFIGURAR A PIPELINE NO AZURE DEVOPS

1. Acesse `dev.azure.com`
2. Crie um novo projeto (se necessário)
3. Vá em **Pipelines > New Pipeline**
4. Escolha **GitHub** e selecione o repositório
5. O Azure deve detectar o `azure-pipelines.yml`
6. Clique em **Run Pipeline**
7. Aguarde execução e confira se todos os passos estão verdes ✅
CASO PRECISE CRIAR, CLIQUE EM STARTER PIPELINE E COLE ESSE CODIGO: 
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: ubuntu-latest

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Install Node.js'

  - script: |
      cd app
      npm install
      npm run start
    displayName: 'Run application'


---

## ✅ FINALIZAÇÃO – O QUE FOI ENTREGUE

| Etapa | Resultado Esperado |
|-------|---------------------|
| VM Ubuntu com Docker e PostgreSQL | ✅ |
| Projeto clonado e rodando no Docker | ✅ |
| Aplicação acessível via IP público | ✅ |
| Banco de dados funcionando | ✅ |
| Pipeline automatizada rodando no DevOps | ✅ |
