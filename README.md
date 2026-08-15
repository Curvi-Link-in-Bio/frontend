# Curvi: Link in Bio Gold

Cria um, um projeto baseado no JSON abaixo. Pode ser por enquanto com a persistência em local storage



{

  "project": {

    "name": "Curvi",

    "description": "Micro-SaaS de Link na Bio focado no nicho Plus Size e criadoras de conteúdo.",

    "category": "Micro-SaaS / Link in Bio"

  },

  "brandIdentity": {

    "theme": "Dark Premium Gold",

    "colorPalette": {

      "backgroundPrimary": "#18181B",

      "backgroundSecondary": "#27272A",

      "accentPrimaryGold": "#D4AF37",

      "accentGoldGradient": "linear-gradient(135deg, #D4AF37 0%, #E6C875 100%)",

      "accentSecondarySilver": "#C0C0C0",

      "textPrimary": "#FFFFFF",

      "textSecondary": "#9CA3AF"

    },

    "typography": {

      "headings": {

        "family": "Inter, Plus Jakarta Sans, Montserrat",

        "weight": "700 (Bold)",

        "style": "Uppercase / Geometric Sans-Serif",

        "letterSpacing": "0.05em"

      },

      "body": {

        "family": "Inter, Plus Jakarta Sans",

        "weight": "400 (Regular) / 500 (Medium)",

        "style": "Clean / Mobile-First Legibility"

      }

    },

    "uiStyle": {

      "borderRadius": "12px",

      "cardBorder": "1px solid #D4AF37",

      "primaryButton": {

        "background": "linear-gradient(135deg, #D4AF37 0%, #E6C875 100%)",

        "textColor": "#121214",

        "fontWeight": "bold",

        "glowEffect": "box-shadow: 0 0 15px rgba(212, 175, 55, 0.3)"

      },

      "secondaryButton": {

        "background": "transparent",

        "border": "1px solid #C0C0C0",

        "textColor": "#FFFFFF"

      }

    }

  },

  "functionalRequirements": [

    {

      "id": "RF01",

      "category": "Autenticação e Usuários",

      "title": "Cadastro de Usuário",

      "description": "O sistema deve permitir cadastro via e-mail/senha ou autenticação social (Google)."

    },

    {

      "id": "RF02",

      "category": "Autenticação e Usuários",

      "title": "Login e Sessão",

      "description": "O sistema deve autenticar o usuário, manter sessão ativa e permitir recuperação de senha."

    },

    {

      "id": "RF03",

      "category": "Autenticação e Usuários",

      "title": "Definição de URL Única",

      "description": "O usuário deve escolher um identificador único para sua página pública (ex: curvi.link/username)."

    },

    {

      "id": "RF04",

      "category": "Gestão de Perfil",

      "title": "Editar Perfil Básico",

      "description": "Permitir alterar foto de perfil, nome de exibição e biografia."

    },

    {

      "id": "RF05",

      "category": "Gestão de Perfil",

      "title": "Seleção de Temas Visuais",

      "description": "Disponibilizar temas pré-definidos alinhados com a identidade visual escuro/dourado."

    },

    {

      "id": "RF06",

      "category": "Gestão de Perfil",

      "title": "Personalização Básica",

      "description": "Permitir ajuste de cores base dos botões e do plano de fundo dentro da paleta do sistema."

    },

    {

      "id": "RF07",

      "category": "Gerenciamento de Links",

      "title": "CRUD de Links",

      "description": "Permitir criar, editar e excluir links informando Título e URL de destino."

    },

    {

      "id": "RF08",

      "category": "Gerenciamento de Links",

      "title": "Reordenar Links",

      "description": "Permitir alterar a ordem de exibição dos links na página pública."

    },

    {

      "id": "RF09",

      "category": "Gerenciamento de Links",

      "title": "Ativar/Desativar Link",

      "description": "Permitir ocultar temporariamente um link sem excluí-lo."

    },

    {

      "id": "RF10",

      "category": "Página Pública e Métricas",

      "title": "Renderização Pública",

      "description": "Exibir a página pública no formato curvi.link/username aplicando tema e links ativos."

    },

    {

      "id": "RF11",

      "category": "Página Pública e Métricas",

      "title": "Redirecionamento e Contador de Cliques",

      "description": "Contabilizar o clique no banco de dados antes de redirecionar para a URL final."

    },

    {

      "id": "RF12",

      "category": "Página Pública e Métricas",

      "title": "Exibição de Métricas Simples",

      "description": "Exibir no painel o total acumulado de cliques por link."

    },

    {

      "id": "RF13",

      "category": "Página Pública e Métricas",

      "title": "Rodapé Padrão",

      "description": "Exibir o selo promocional 'Powered by Curvi' no rodapé das páginas públicas."

    },

    {

      "id": "RF14",

      "category": "Pagamentos",

      "title": "Checkout Externo",

      "description": "Redirecionar para gateway externo (Stripe ou Mercado Pago) para compra de plano."

    },

    {

      "id": "RF15",

      "category": "Pagamentos",

      "title": "L

iberação via Webhook",

      "description": "Processar o webhook do gateway para ativar ou suspender recursos do usuário."

    }

  ]

}

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/627cb953-3a65-4c38-8ea2-2dba23acd6d9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
