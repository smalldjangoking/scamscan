<a id="readme-top"></a>
<br />
<div align="center">
  <a href="https://github.com/smalldjangoking/scamscan">
    <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg"
         alt="Logo" width="100"/>
  </a>

  <h3 align="center">ScamScan.io — Community Scam Reports & Monitoring</h3>

  <p align="center">
    A community-driven platform to report, analyze, and discuss crypto scams.
    <br />
    <a href="https://scamscan.io"><strong>Visit Website »</strong></a>
  </p>
</div>

---

## 🧠 Technology Stack & Key Features

### ⚙️ Backend (API & Core Logic)
- ⚡ **FastAPI** — high-performance async Python API
- 🧰 **SQLAlchemy 2.0 (async)** — modern ORM with full async support
- 🔍 **Pydantic v2** — strict data validation & API schemas
- 💾 **PostgreSQL** — primary relational database
- 🔑 **JWT authentication** — access & refresh tokens, remember-me logic
- 🔒 **Secure password hashing** (bcrypt)
- 📫 **Email verification & password recovery**
- 🛡 **Rate limiting** (SlowAPI) for abuse protection
- 🧾 **Well-structured domain models**  
  (users, reports, addresses, comments, votes, whois)
- 🧠 **Clean architecture** (routers / services / schemas)

---

### 🚀 Frontend (UI & UX)
- ⚛️ **React 19 + Vite** — modern, fast frontend stack
- 🧑‍💻 **JavaScript (Axios, TanStack Query)** with hooks
- 🎨 **Tailwind CSS** — utility-first styling
- 🧩 **Custom UI components**
  - Dropdowns with search & infinite scroll
  - Nested comments system
  - Rich text editor & viewer (TipTap)
  - Interactive report cards
  - Voting system (Like / Dislike)
  - Modals, pagination, loaders, alerts
  - Theme toggle (dark / light mode)
- 🌗 **Dark mode support**
- ♾ **Infinite scroll & pagination**
- 🔎 **Search & filters** with debouncing
- 🧠 **SEO-optimized pages**  
  (meta tags, OpenGraph, canonical URLs)
- 🔌 **API client integration** with auth & token refresh logic

---

### 🧩 Product Features
- 🚨 **Scam reports** for crypto addresses & websites
- 🧾 **Community-driven reporting system**  
  Users submit structured scam reports with descriptions and evidence
- 💬 **Discussion & feedback layer**  
  Nested comments and replies under each report
- 👍 **Community voting system**  
  Highlight trustworthy or suspicious reports
- 🔎 **Search, filters & discovery**  
  Quickly find reports by address, website, or keywords
- 👤 **User profiles & account management**
  - Update profile information
  - Change password
  - Manage own reports and comments
  - Permanently delete account (with cascading data removal)
- 🔗 **SEO-friendly URLs & slugs**
- ⚖️ **Privacy-aware design**  
  No fingerprinting, minimal tracking, user-first data handling

---

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#key-features-of-functionality">Key Features of Functionality</a></li>
    <li><a href="#project-status">Project Status</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#disclaimer">Disclaimer</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

---

## About The Project

This project was inspired by the well-known Steam community platform **steamrep.com**, which helps users identify scammers in Steam trading.  
ScamScan adapts this concept for the **crypto ecosystem**, where scams are widespread and often difficult to track.

ScamScan.io provides a platform where users can:
- Report suspicious crypto addresses or websites
- Discuss scam cases with the community
- Check existing reports before interacting with unknown entities

All data is **community-driven**, forming a constantly growing database of scam reports.  
This helps both new and experienced users avoid fraudulent activities and make safer decisions.

The long-term goal is to create a transparent, searchable, and trustworthy public resource for crypto scam awareness.

---

## Key Features of Functionality

### 👤 Account
- Create and manage scam reports
- Participate in discussions by leaving comments
- Visual indicators for report ownership

### 🧑 Profile
- Update personal information
- Change password
- View and manage own reports
- Permanently delete account  
  *(all associated reports and comments are removed)*

### 📝 Report Form
- Submit reports for crypto addresses or websites
- Rich text descriptions powered by TipTap
- Screenshot uploads *(planned feature)*

### 📊 View Reports
- Browse community reports
- Filter and search by multiple criteria
- View detailed scam descriptions and discussions

### 🔍 Scan URLs & Addresses
- Instantly check any website or crypto address
- View existing reports and community feedback
- Whois data and trust-related metadata

---

## 🚀 Project Status

ScamScan.io is **actively developed**.

Core functionality is implemented and usable in production:
- Authentication & authorization
- Report creation and browsing
- Community interaction (comments, voting)
- Scanning & lookup features
- Frontend ↔ backend integration

New features and improvements are continuously being added.

---

## 🛣 Roadmap

Planned improvements:
- 📎 Screenshot & evidence uploads
- 🧠 Scam risk scoring & trust indicators
- 🏷 Advanced tagging & categorization
- 🔔 Notifications (replies, report updates)
- 📊 Analytics & insights
- 🌍 Multi-language support

---

## ⚠️ Disclaimer

ScamScan.io is a **community-driven platform**.

All reports are submitted by users and reflect their personal experiences and opinions.
The platform does **not guarantee accuracy** and should not be considered financial or legal advice.

Always do your own research (DYOR).

---

## 📜 License

Distributed under the **MIT License**.

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>
