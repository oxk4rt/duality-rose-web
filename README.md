# Duality ROSE — Web v1.0

> *"El arte con forma. La lógica con alma."*

Official website of **Duality ROSE**, an independent narrative game studio founded in Spain in 2017.
This repository contains the full source code for the studio's web presence: a clean, modular static site built without frameworks, designed for a future migration to **Astro**.

---

## Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 — custom token system, no framework |
| Logic | Vanilla JavaScript (ES6+) |
| Backend | PHP 8+ |
| AI | OpenRouter API — Google Gemma 3 |
| Email | PHPMailer + Gmail SMTP |
| MD Rendering | marked.js (CDN) |

---

## Pages

| Route | Description |
|---|---|
| `index.html` | Split landing — Studio (left) / Projects (right). Animated SVG logo. |
| `pages/studio.html` | Studio presentation, Rose AI chat, social links |
| `pages/history-line.html` | Studio history rendered dynamically from `docs/info-rose.md` |
| `pages/projects.html` | Game catalogue |
| `pages/team.html` | Team member profiles |
| `pages/contact.html` | Contact form with drag-and-drop captcha mini-game |

---

## Features

- **Animated SVG logo** — Custom path animation with JavaScript, precision-controlled geometry.
- **Rose AI chat** — Contextual AI assistant (OpenRouter / Google Gemma 3) restricted to studio knowledge. Weekly token limit detected via OpenRouter's 403 response and handled gracefully with a styled fallback message.
- **Contact form** — PHP + PHPMailer + Gmail SMTP. Reply-To set to the visitor's email for direct replies. Drag-and-drop card captcha as bot protection. Custom success modal in the studio's visual style.
- **History Line** — Studio history page rendered dynamically from a single Markdown source (`docs/info-rose.md`), which also serves as Rose's knowledge base. One file, two uses — single source of truth.
- **CSS token system** — Full design system via CSS custom properties in `tokens.css`, ready for Astro migration.
- **Game of Life** — Conway's Game of Life canvas animation on the studio page, built in vanilla JS.

---

## Project Structure

```
duality-rose-web-v1.0/
│
├── index.html                    # Landing page (split design, SVG logo animation)
│
├── pages/
│   ├── studio.html               # Studio page — Rose chat, Game of Life
│   ├── history-line.html         # History rendered from info-rose.md
│   ├── projects.html             # Game catalogue
│   ├── team.html                 # Team profiles
│   └── contact.html              # Contact form + captcha mini-game
│
├── assets/
│   ├── css/
│   │   ├── tokens.css            # Design tokens (CSS custom properties)
│   │   ├── base.css              # Global reset
│   │   ├── layout.css            # html, body, h1, header, footer
│   │   ├── components.css        # Shared UI components (curves, back buttons)
│   │   ├── index.css             # Landing page styles
│   │   ├── studio.css
│   │   ├── history-line.css      # Markdown-rendered content styles
│   │   ├── projects.css
│   │   ├── team.css
│   │   └── contact.css
│   │
│   ├── js/
│   │   ├── core/
│   │   │   ├── index.js          # SVG logo animation
│   │   │   ├── chat-with-rose.js # Rose AI chat logic
│   │   │   ├── history-line.js   # Fetches + renders info-rose.md via marked.js
│   │   │   └── contact.js        # Form submission, validation, success modal
│   │   └── experiments/
│   │       ├── game-of-life.js   # Conway's Game of Life canvas
│   │       └── captcha-game.js   # Drag-and-drop captcha mini-game
│   │
│   └── images/                   # Project assets and team photos
│
├── api/
│   ├── ai.php                    # Rose AI endpoint — OpenRouter integration
│   ├── contact.php               # Email endpoint — PHPMailer + Gmail SMTP
│   ├── config.php                # Private credentials — gitignored
│   └── config.example.php        # Public template — copy and fill
│
└── docs/
    └── info-rose.md              # Rose's knowledge base + History Line source
```

---

## Setup

### 1. Clone and serve

```bash
git clone https://github.com/your-username/duality-rose-web.git
cd duality-rose-web
php -S localhost:8000
```

### 2. Configure credentials

Copy the example config file and fill in your values:

```bash
cp api/config.example.php api/config.php
```

Edit `api/config.php`:

```php
define('OPENROUTER_API_KEY', 'sk-or-v1-...');      // openrouter.ai — Rose AI
define('MAIL_FROM',          'sender@gmail.com');   // Gmail account with App Password
define('MAIL_TO',            'contact@gmail.com');  // Where to receive contact messages
define('MAIL_PASSWORD',      'xxxx xxxx xxxx xxxx'); // Google App Password
```

### 3. Install PHPMailer

PHPMailer is gitignored. Place the three required files in `api/lib/`:

```
api/lib/PHPMailer.php
api/lib/SMTP.php
api/lib/Exception.php
```

Source: [github.com/PHPMailer/PHPMailer/tree/master/src](https://github.com/PHPMailer/PHPMailer/tree/master/src)

Alternatively, install via Composer:

```bash
composer require phpmailer/phpmailer
```

---

## Configuration Reference

| File | Purpose | Git |
|---|---|---|
| `api/config.php` | API keys and mail credentials | Ignored |
| `api/config.example.php` | Public template for `config.php` | Tracked |
| `docs/info-rose.md` | Rose's knowledge base and History Line content | Tracked |

---

## Design System

All design decisions live in `assets/css/tokens.css` as CSS custom properties:

```css
/* Brand — Studio side (left / green) */
--color-studio-primary:  #41760f;
--color-studio-dark:     #2d5209;
--color-studio-hover:    #60a30f80;

/* Brand — Catalogue side (right / purple) */
--color-catalog-primary: #5b0688;
--color-catalog-hover:   #9c07ec80;

/* Base */
--color-bg:              #f4f4f4;
--color-text:            #1a1a1a;
--color-text-muted:      #464646;
--color-footer:          #242424;

/* Cards */
--card-bg:               #f7f7f7;
--card-border:           #cccccc;
--radius-card:           6px;
--shadow-card:           0 0 5px #0000001a;

/* Typography */
--font-mono:             'Fira Code', monospace;
```

---

## Astro Migration Notes

This codebase is structured with migration in mind:

- **CSS tokens** map directly to Astro's design token conventions.
- **Each page** corresponds to a future `.astro` component.
- **PHP endpoints** (`ai.php`, `contact.php`) will migrate to Astro API routes.
- **`info-rose.md`** maps naturally to an Astro content collection.
- **The SVG logo** and its JS animation are fully compatible with Astro's inline SVG support — the animation script moves to the component's `<script>` block unchanged.

---

## Roadmap

- [ ] Migrate to Astro — components, content collections, SSG
- [ ] Expand Rose's knowledge base in `docs/info-rose.md`
- [ ] Add individual game pages under `pages/projects/`
- [ ] Complete social links and team profiles

---

## License

© 2017–present Duality ROSE. All rights reserved.
This source code is publicly visible for transparency and portfolio purposes only.
See [LICENSE](LICENSE) for full terms.
