# DW Projetos — landing page

**Página publicada:** https://eliel2107.github.io/DWLandpage/

> Versão de apresentação — textos entre [colchetes] aguardam dados do cliente.

Site institucional estático da **DW Projetos Empreendimentos Ltda** (proteção catódica, inspeção CIPS/DCVG e PCM/A-Frame, aterramento e SPDA). HTML + CSS + JavaScript vanilla, sem build e sem dependências — pronto para GitHub Pages.

## Estrutura

```
.
├── index.html            # página única (todo o conteúdo está escrito no HTML)
├── assets/
│   ├── css/style.css     # estilos (cores, animações, responsivo)
│   ├── js/main.js        # slideshow do topo, abas de serviços, menu mobile, marquees, lightbox
│   └── img/              # fotos, logo e favicon
├── README.md
└── .gitignore
```

## Rodar localmente

- Abra `index.html` direto no navegador, **ou**
- sirva a pasta: `npx serve .` (ou `python3 -m http.server`) e acesse o endereço exibido.

## Publicar no GitHub Pages

1. Crie um repositório e envie estes arquivos para a raiz da branch `main`:
   ```bash
   git init && git add . && git commit -m "Landing page DW Projetos"
   git branch -M main
   git remote add origin https://github.com/<usuario>/<repo>.git
   git push -u origin main
   ```
2. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, pasta `/ (root)`. Salve.
3. Em ~1 minuto o site fica em `https://<usuario>.github.io/<repo>/`. Para domínio próprio, configure em **Custom domain** e crie o registro DNS indicado.

Todos os caminhos são relativos, então o site funciona tanto em subpasta (`/<repo>/`) quanto em domínio próprio.

## Pendências antes de publicar

**Formulário de orçamento** — o `<form>` envia para `https://formspree.io/f/SEU_ID`. Crie um formulário no [Formspree](https://formspree.io) (ou serviço similar) e troque `SEU_ID` pelo ID gerado em `index.html`.

**Open Graph** — `og:image` usa caminho relativo; algumas redes exigem URL absoluta. Depois de publicar, troque por `https://<seu-dominio>/assets/img/retificadores-duto.jpg` e, se quiser, adicione `og:url`.

**Textos provisórios (entre colchetes) no `index.html`:**

| Onde | Placeholder |
|---|---|
| Como contratar — etapa 03 | `[PRAZO]` (prazo da proposta) |
| Contato — texto de abertura | `[PRAZO]` dias úteis |
| Quem somos — qualificações | `[CERTIFICAÇÃO / QUALIFICAÇÃO DOS INSPETORES]` |
| Quem somos — qualificações | `[NORMAS APLICADAS NOS PROJETOS]` |
| Quem somos — qualificações | `[CADASTRO DE FORNECEDOR — ex.: CRCC]` |
| Quem somos — qualificações | `[ART / CREA DO RESPONSÁVEL TÉCNICO]` |
| FAQ — Quais regiões vocês atendem? | `[RESPOSTA — regiões e estados de atuação]` |
| FAQ — Vocês emitem ART? | `[RESPOSTA — emissão de ART pelo responsável técnico]` |
| FAQ — Formato do relatório | `[RESPOSTA — ex.: perfil ON/OFF, lista de defeitos georreferenciados, recomendações]` |
| FAQ — Processos licitatórios | `[RESPOSTA — participação em licitações e cadastros de fornecedor]` |
| Formulário — consentimento | `[POLÍTICA DE PRIVACIDADE]` (texto e link `href="#"`) |
| Rodapé — empresa | `[ENDEREÇO / CIDADE-SEDE]` |
| Rodapé — empresa | `[RESPONSÁVEL TÉCNICO — CREA]` |
| Rodapé — empresa | CNPJ `[00.000.000/0000-00]` |
| Rodapé — barra inferior | `[Política de privacidade]` (link `href="#"`) |

Os links de política de privacidade apontam para `#`: crie a página (ex.: `privacidade.html`) e atualize os dois links.

## Comportamentos (main.js)

- **Topo:** fotos trocam a cada 6,5 s com crossfade e Ken Burns; pausa ao passar o mouse/focar e retoma do ponto onde parou.
- **Serviços:** abas avançam a cada 8 s só quando a seção está visível; pausa no hover/foco; setas ←/→ navegam entre abas; "Solicitar orçamento deste serviço" pré-seleciona o serviço no formulário.
- **Clientes e galeria:** faixas em loop contínuo (itens duplicados via JS com `aria-hidden`); galeria abre lightbox com navegação e fecha por ✕, clique no fundo ou Esc.
- **Acessibilidade:** com `prefers-reduced-motion`, não há autoplay nem animação de faixas. Sem JavaScript, todo o conteúdo continua visível.
