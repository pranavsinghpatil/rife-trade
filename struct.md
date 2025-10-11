# Project Structure

This document outlines the file and folder structure of the project, along with the role of each file.

```
D:\hacka\autoRAG-n8n\
├─── .gitignore # Specifies which files and folders should be ignored by Git.
├─── .gitmodules # Defines submodules used in the project.
├─── app.py # Main application file, likely the entry point for the Flask/FastAPI backend.
├─── config.py # Configuration settings for the application.
├─── localhost_8080-Rife-Trade-Dashboard.jpeg # A screenshot of the Rife Trade Dashboard.
├─── README.md # Contains information about the project.
├─── requirements.txt # Lists the Python dependencies for the backend.
├─── struct.md # This file, outlining the project structure.
├─── controllers/ # Contains backend logic for handling requests.
├─── front/
│   ├─── bun.lockb # Lockfile for the Bun package manager.
│   ├─── components.json # Configuration for UI components.
│   ├─── eslint.config.js # ESLint configuration for code quality.
│   ├─── index.html # The main HTML file for the frontend application.
│   ├─── package-lock.json # Lockfile for npm, ensuring consistent dependency installation.
│   ├─── package.json # Defines frontend dependencies and scripts.
│   ├─── postcss.config.js # Configuration for PostCSS.
│   ├─── README.md # README specific to the frontend.
│   ├─── tailwind.config.ts # Configuration for Tailwind CSS.
│   ├─── tsconfig.app.json # TypeScript configuration for the application.
│   ├─── tsconfig.json # General TypeScript configuration.
│   ├─── tsconfig.node.json # TypeScript configuration for Node.js environment.
│   ├─── vite.config.ts # Configuration for the Vite build tool.
│   ├─── public/
│   │   ├─── favicon.ico # Favicon for the website.
│   │   ├─── placeholder.svg # A placeholder SVG image.
│   │   └─── robots.txt # Instructions for web crawlers.
│   └─── src/
│       ├─── App.css # CSS for the main App component.
│       ├─── App.tsx # The main React component, acting as the root of the application.
│       ├─── index.css # Global CSS styles.
│       ├─── main.tsx # The entry point for the React application.
│       ├─── vite-env.d.ts # TypeScript definitions for Vite.
│       ├─── components/
│       │   ├─── Footer.tsx # Footer component for the application.
│       │   ├─── ThemeProvider.tsx # Provides the theme (e.g., light/dark) to the application.
│       │   ├─── ThemeToggle.tsx # A component to switch between themes.
│       │   ├─── dashboard/
│       │   │   ├─── HeadlinesCard.tsx # A card component for displaying news headlines.
│       │   │   ├─── InfoCard.tsx # A generic card for displaying information.
│       │   │   ├─── PriceCard.tsx # A card for displaying market prices.
│       │   │   ├─── PriceChart.tsx # A chart for visualizing price data.
│       │   │   ├─── PriceTable.tsx # A table for displaying price data.
│       │   │   ├─── SentimentBarChart.tsx # A bar chart for visualizing sentiment data.
│       │   │   ├─── SentimentCard.tsx # A card for displaying sentiment information.
│       │   │   ├─── SentimentPieChart.tsx # A pie chart for visualizing sentiment data.
│       │   │   ├─── SentimentSection.tsx # A section dedicated to sentiment analysis.
│       │   │   ├─── StatusLogCard.tsx # A card for displaying status logs.
│       │   │   └─── SystemStatusCard.tsx # A card for displaying system status.
│       │   └─── ui/ # Contains UI components from Shadcn.
│       │       ├─── accordion.tsx
│       │       ├─── alert-dialog.tsx
│       │       ├─── alert.tsx
│       │       ├─── aspect-ratio.tsx
│       │       ├─── avatar.tsx
│       │       ├─── badge.tsx
│       │       ├─── breadcrumb.tsx
│       │       ├─── button.tsx
│       │       ├─── calendar.tsx
│       │       ├─── card.tsx
│       │       ├─── carousel.tsx
│       │       ├─── chart.tsx
│       │       ├─── checkbox.tsx
│       │       ├─── collapsible.tsx
│       │       ├─── command.tsx
│       │       ├─── context-menu.tsx
│       │       ├─── dialog.tsx
│       │       ├─── drawer.tsx
│       │       ├─── dropdown-menu.tsx
│       │       ├─── form.tsx
│       │       ├─── hover-card.tsx
│       │       ├─── input-otp.tsx
│       │       ├─── input.tsx
│       │       ├─── label.tsx
│       │       ├─── menubar.tsx
│       │       ├─── navigation-menu.tsx
│       │       ├─── pagination.tsx
│       │       ├─── popover.tsx
│       │       ├─── progress.tsx
│       │       ├─── radio-group.tsx
│       │       ├─── resizable.tsx
│       │       ├─── scroll-area.tsx
│       │       ├─── select.tsx
│       │       ├─── separator.tsx
│       │       ├─── sheet.tsx
│       │       ├─── sidebar.tsx # Sidebar component for navigation.
│       │       ├─── skeleton.tsx
│       │       ├─── slider.tsx
│       │       ├─── sonner.tsx
│       │       ├─── switch.tsx
│       │       ├─── table.tsx
│       │       ├─── tabs.tsx
│       │       ├─── textarea.tsx
│       │       ├─── toast.tsx
│       │       ├─── toaster.tsx
│       │       ├─── toggle-group.tsx
│       │       ├─── toggle.tsx
│       │       ├─── tooltip.tsx
│       │       └─── use-toast.ts
│       ├─── hooks/
│       │   ├─── use-mobile.tsx # A React hook to detect if the application is running on a mobile device.
│       │   └─── use-toast.ts # A React hook for displaying toast notifications.
│       ├─── lib/ # Utility functions for the frontend.
│       ├─── pages/
│       │   ├─── Index.tsx # The main index page of the application.
│       │   └─── NotFound.tsx # The 404 Not Found page.
│       └─── services/
│           └─── api.js # Handles API requests for the frontend.
├─── models/
│   └─── schemas.py # Defines Pydantic schemas for data validation and serialization.
├─── routes/
│   └─── data.py # Defines the API routes for the backend.
├─── services/
│   ├─── market.py # Service for fetching market data.
│   ├─── news.py # Service for fetching news articles.
│   ├─── sentiment.py # Service for performing sentiment analysis.
│   └─── status.py # Service for managing status updates.
└─── utils/
    ├─── config.py # Utility for loading and managing configuration.
    └─── logger.py # Utility for logging.
```