# OjaLink - WhatsApp Marketing & Business Suite

## Overview
A specialized business productivity suite designed for Nigerian small businesses, focusing on WhatsApp sales funnels and essential business management tools. Features include WhatsApp marketing content generation, booking management, budget tracking, customer management, inventory tracking, pricing tools, currency conversion, and a calculator.

## Current State
- Full-stack React + Express application
- OjaLink branding applied across all pages
- Marketing generator simplified to focus exclusively on WhatsApp sales funnels
- Daily generation limit implemented for marketing content

## Architecture
- **Framework**: React 18 with TypeScript
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OIDC)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: react-router-dom v6
- **Theme**: Dark/light mode with custom teal/cyan color scheme

## Pages
- `/` - Landing page (logged out)
- `/dashboard` - Protected dashboard
- `/marketing` - AI marketing content generator
- `/booking` - Appointment booking management
- `/budget` - Financial tracking
- `/customers` - Customer management
- `/inventory` - Inventory management
- `/pricing` - Pricing page
- `/converter` - Currency converter
- `/calculator` - Calculator tool
- `/settings` - App settings

## Recent Changes
- **Feb 2026**: 
  - Integrated Replit Auth for secure login/registration.
  - Added Inventory and Pricing modules to the landing page features.
  - Optimized WhatsApp marketing content to focus on high-conversion sales funnels.
  - Set up full-stack architecture with Express server and PostgreSQL persistence.
