# Localização do usuário no Vega OS

Como um app React Native for Vega (Fire TV, Vega OS 2.0, RN 0.83) pode descobrir a cidade do usuário, e o que o Janela do Tempo deve usar. Levantamento feito em 2026-11-01 com a documentação da Amazon (MCP Amazon Devices Builder Tools e developer.amazon.com) e o npm.

## Resumo

Não existe, no Vega, um jeito pronto e automático de obter a cidade do usuário a partir do JavaScript:

- a API de geolocalização do sistema só existe em C++ (API nativa), sem pacote JS da Amazon;
- os pacotes JS prontos da Amazon dão só o **país e o fuso** configurados no aparelho;
- a localização por **IP** funciona com um serviço externo, mas acerta a cidade da operadora, não necessariamente a do usuário.

**Recomendação:** sugerir a cidade pelo IP na primeira abertura, deixar o usuário confirmar ou trocar pela busca (geocodificação da Open-Meteo) e salvar a escolha no aparelho.

## Opções

### 1. API de geolocalização do Vega (nativa)

- **Pacote:** `com.amazon.kepler.geolocation`, na referência da API nativa do Vega (C++/IDL).
- **O que oferece:** `IGeolocationManagerFactory.getOrMakeGeolocationManager()` e, no `IGeolocationManager`, `getCurrentLocation(providerType)`, `getLastKnownLocation(providerType)` e `startPeriodicTracking()`. A posição vem em `IGeolocation` (latitude, longitude, altitude, precisão, tipo de provedor).
- **Para usar num app React Native:** é preciso escrever um módulo nativo (Turbo Module em C++) que exponha essas chamadas ao JS. Não há pacote JS da Amazon no npm: os nomes `@amazon-devices/react-native-geolocation`, `geolocation`, `kepler-geolocation` e `vega-geolocation` não existem.
- **Limitações:**
  - as interfaces do pacote (`ISpaceVehicleInfo`, `INmeaListener`, `IDeadReckoningInfo`, `IVehicleInfo`) indicam que ele foi feito para aparelhos com GPS;
  - o Fire TV Stick não tem GPS, e a documentação não diz se ele devolve uma posição pela rede nem que privilégio de manifesto é exigido;
  - **não verificado no aparelho.**
- **Para este projeto:** fica fora, porque o app usa só componentes prontos da Amazon e isso exigiria código nativo próprio.

### 2. `@amazon-devices/react-native-localize` (JS, pronto)

- **Pacote:** `@amazon-devices/react-native-localize`, versão `~2.1.9000000001` para RN 0.83 (Package Version Matrix da Amazon). É uma biblioteca do sistema.
- **O que oferece:**
  - `getCountry()`: código do país, por exemplo `"BR"`;
  - `getTimeZone()`: fuso configurado no aparelho, por exemplo `"America/Sao_Paulo"`;
  - `getTemperatureUnit()`: `"celsius"` ou `"fahrenheit"`;
  - `usesMetricSystem()`, `getLocales()`, `getCurrencies()`.
- **Atenção:** segundo a documentação da Amazon, `getCountry()` e `getTimeZone()` vêm das **configurações do aparelho** (o país vem do idioma escolhido). Não vêm da posição física. No simulador são valores fixos.
- **Serve para:** escolher a unidade de temperatura e ter uma cidade padrão razoável por país ou fuso. **Não dá a cidade.**

### 3. Localização pelo IP (serviço externo)

- **Como:** um `fetch` para um serviço de geolocalização por IP (ipapi.co, ip-api.com, ipinfo.io). O app já declara `com.amazon.networking` no `manifest.toml`; nada nativo é necessário.
- **Precisão:** em geral, a cidade onde a operadora registra o IP. No Brasil é comum aparecer a capital ou a cidade do provedor, por exemplo Porto Alegre em vez de Novo Hamburgo.
- **Cuidados:**
  - **Privacidade:** o IP do usuário vai para um terceiro, o que precisa constar na política de privacidade da listagem na Appstore.
  - **Limites dos planos gratuitos:** ip-api.com grátis só por HTTP, ipapi.co com limite diário, ipinfo.io exige token. Confira os termos antes de escolher.
  - **Falhas:** o serviço pode estar fora do ar ou bloquear a requisição; o app precisa de um padrão.

### 4. Busca pelo nome (Open-Meteo Geocoding)

- **Como:** o usuário digita a cidade com o teclado do sistema e o app consulta a geocodificação da Open-Meteo, grátis e sem chave, da mesma fonte da previsão:

  ```
  https://geocoding-api.open-meteo.com/v1/search?name=Novo%20Hamburgo&count=5&language=pt&format=json
  ```

  Resposta (resumida): `Novo Hamburgo, Rio Grande do Sul, BR, -29.67833, -51.13056, America/Sao_Paulo`. Testado em 2026-11-01.
- **Para o teclado aparecer:** o `TextInput` exige `[[wants.service]] id = "com.amazon.inputmethod.service"` no `manifest.toml`. No SDK 2.0 o Voltar do teclado chega em `onSubmitEditing` com `submitAction: 'previous'`, e não deve disparar a busca.
- **Precisão:** exata, porque é o usuário quem escolhe.

## Comparação

| Opção | Dá a cidade? | Pronta da Amazon? | Precisão | Precisa de |
| --- | --- | --- | --- | --- |
| Geolocalização nativa | Talvez (não verificado) | Só em C++ | Desconhecida no Fire TV Stick | Turbo Module próprio |
| react-native-localize | Não (país e fuso) | Sim | País e fuso das configurações | Só o pacote |
| IP | Sim, aproximada | Não (serviço externo) | Cidade da operadora | Rede e política de privacidade |
| Busca pelo nome | Sim | Não (Open-Meteo) | Exata | Teclado do sistema |

## Fluxo recomendado para o Janela do Tempo

1. **Primeira abertura:** consultar o IP e sugerir a cidade com a frase "Parece que você está em Porto Alegre. Usar esta cidade?", em foco o botão **Usar esta cidade** e ao lado **Trocar cidade**.
2. **Trocar cidade:** abre a busca. O usuário digita, a lista vem da geocodificação da Open-Meteo e cada resultado mostra cidade, estado e país.
3. **Salvar a escolha** no aparelho (`@amazon-devices/react-native-async-storage__async-storage`, `~2.1.9000000001` para RN 0.83). Nas aberturas seguintes, o IP não é consultado de novo.
4. **Sem IP nem escolha** (falha de rede, serviço fora do ar): usar Novo Hamburgo, como hoje, com o botão Buscar cidade disponível.
5. **Unidade de temperatura** pelo `getTemperatureUnit()` do react-native-localize. No Brasil será sempre °C.

Esse fluxo usa só JS e pacotes da Amazon do lado do app, e o IP fica restrito à primeira sugestão. Um erro de precisão se corrige com um clique.

## Pendências

- Testar no Fire TV Stick se `com.amazon.kepler.geolocation` devolve alguma posição sem GPS, caso um dia valha escrever o módulo nativo.
- Escolher o serviço de IP pelos termos de uso (HTTPS, limite, uso comercial) e atualizar a política de privacidade da listagem.

## Referências

- Vega Native API, `IGeolocationManager`: https://developer.amazon.com/docs/vega-native-api/2.0/interfaces.IGeolocationManager.com_amazon_kepler_geolocation
- Vega Native API, `IGeolocationManagerFactory`: https://developer.amazon.com/docs/vega-native-api/2.0/interfaces.IGeolocationManagerFactory.com_amazon_kepler_geolocation
- react-native-localize no Vega: https://developer.amazon.com/docs/vega-api/2.0/react-native-localize
- Package Version Matrix: documento `react_native_for_vega_version_specific_knowledge_base.md` do MCP Amazon Devices Builder Tools
- Open-Meteo Geocoding API: https://open-meteo.com/en/docs/geocoding-api
