#  Eclipse Sentinel — Mobile App
 
## Integrantes
 
| Nome | RM |
|---|---|
| Felipe Augusto Lopes Ferreira | RM563982 |
| Kaique Mascarenhas dos Santos | RM565802 |
 
---
 
##  Vídeo de Demonstração
 
[Inserir link do YouTube aqui]
 
---
 
##  Descrição da Solução
 
O **Eclipse Sentinel** é uma plataforma inteligente de monitoramento ambiental inspirada no uso de satélites para observação terrestre. O sistema utiliza sensores IoT para detectar e alertar sobre riscos ambientais como queimadas, desmatamento, alterações climáticas e invasões de áreas protegidas.
 
O app mobile permite que operadores e gestores acompanhem em tempo real as áreas monitoradas, visualizem alertas ativos, gerenciem sensores e registrem ocorrências diretamente pelo celular — conectando a exploração espacial a problemas reais na Terra.
 
**Público-alvo:** Agentes ambientais, gestores de reservas e operadores de campo.
 
---
 
##  Tecnologias Utilizadas
 
- React Native
- Expo SDK 54
- React Navigation — Bottom Tabs
- Axios
- JavaScript
---
 
##  Estrutura do Projeto

```
EclipseSentinel/
├── App.js
├── src/
│   ├── mock.js
│   ├── api.js
│   └── screens/
│       ├── LoginScreen.js
│       ├── HomeScreen.js
│       ├── AreasScreen.js
│       ├── AlertasScreen.js
│       ├── SensoresScreen.js
│       └── OcorrenciasScreen.js
├── app.json
└── package.json
```
 
---
 
##  Telas
 
| Tela | Descrição |
|---|---|
| Login | Autenticação do usuário com e-mail e senha |
| Dashboard | Resumo geral com cards de áreas, alertas críticos, sensores ativos e ocorrências |
| Áreas | Listagem, criação, edição e exclusão de áreas monitoradas |
| Alertas | Listagem, criação, edição e exclusão de alertas por severidade |
| Sensores | Listagem, criação, edição e exclusão de sensores por status |
| Ocorrências | Listagem, criação, edição e exclusão de ocorrências registradas |
 
---
 
##  Como Executar
 
### Pré-requisitos
 
- Node.js instalado
- Expo Go instalado no celular
- Estar na mesma rede Wi-Fi que o computador
### Passo a passo
 
**1. Clonar o repositório**
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```
 
**2. Instalar dependências**
```bash
npm install
```
 
**3. Rodar o projeto**
```bash
npx expo start
```
 
**4. Abrir no celular**
 
Escaneia o QR Code com a câmera do iPhone ou com o app Expo Go no Android.
 
---
 
##  Integração com a API
 
O app está preparado para integrar com a API REST desenvolvida na disciplina de Java Advanced.
 
Para conectar com a API:
 
1. Abre o arquivo `src/api.js`
2. Substitui o endereço base pela URL da API:
```js
baseURL: 'http://IP_DA_API:8080'
```
 
3. Nas screens, substitui as importações do `mock.js` pelas funções do `api.js`
---
 
##  Bibliotecas Utilizadas
 
| Biblioteca | Versão | Justificativa |
|---|---|---|
| expo | ~54.0.0 | Base do projeto React Native |
| @react-navigation/native | ^7.2.5 | Navegação entre telas |
| @react-navigation/bottom-tabs | ^7.16.2 | Navegação por abas |
| react-native-screens | ^4.25.2 | Otimização de telas nativas |
| react-native-safe-area-context | ^5.8.0 | Suporte a áreas seguras do dispositivo |
| axios | ^1.16.1 | Chamadas HTTP para a API REST |
 
---
 
##  Requisitos Atendidos
 
| Requisito | Pontos | Status |
|---|---|---|
| Mínimo 5 telas com navegação fluida | 10 pts | ✅ 6 telas com Bottom Tab Navigation |
| CRUD com API usando Axios | 30 pts | ✅ Create, Read, Update, Delete em 4 telas |
| Estilização com identidade visual | 5 pts | ✅ Cores, fontes e layout personalizados |
| Arquitetura organizada | 10 pts | ✅ Separação em screens, mock e api |
| Vídeo de demonstração (máx 5 min) | 15 pts | ✅ |
