
# AccesoIT

AccesoIT is a modern web application for an IT solutions and AI automation company. It features multi-language support, a contact form, a floating WhatsApp widget (UI), an informative landing page, and an AI-powered automation advisor.

Built with Next.js, Tailwind CSS, and Genkit for AI features.

## Getting Started

### Prerequisites

- Node.js (version 18.x or higher recommended)
- npm or yarn

### Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd accesoit 
    ```
    (If you received this as a zip, extract it and navigate to the project directory)

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add any necessary environment variables. For the Genkit AI features, you'll typically need an API key for your chosen AI provider (e.g., Google AI Studio).
    Example for Google AI:
    ```env
    GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
    ```
    Refer to the Genkit documentation for more details on configuring AI providers.

### Running the Development Server

1.  **Run the Next.js development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will start the Next.js application, usually on `http://localhost:9002`.

2.  **(Optional) Run the Genkit development server (if you need to test/debug AI flows locally):**
    In a separate terminal, run:
    ```bash
    npm run genkit:dev
    # or use watch mode
    npm run genkit:watch
    ```
    This starts the Genkit development UI, usually on `http://localhost:4000`.

    The AI flows in this project are designed to be called as server actions from the Next.js app, so running `genkit:dev` might only be necessary for deeper debugging of the flows themselves.

### Building for Production

To create a production build:
```bash
npm run build
# or
yarn build
```

### Starting the Production Server

After building, you can start the production server:
```bash
npm run start
# or
yarn start
```

## Project Structure

-   `src/app/[lang]/`: Contains the language-specific pages and layouts.
    -   `page.tsx`: Main landing page.
    -   `advisor/page.tsx`: AI Automation Advisor page.
    -   `layout.tsx`: Layout for localized routes.
-   `src/app/api/`: Contains API routes (e.g., `contact/route.ts`).
-   `src/components/`: Reusable React components.
    -   `layout/`: Header, Footer, LanguageSwitcher, etc.
    -   `ui/`: ShadCN UI components.
    -   `ContactForm.tsx`, `AutomationAdvisorForm.tsx`: Specific form components.
-   `src/dictionaries/`: JSON files for internationalization (i18n).
-   `src/lib/`: Utility functions, i18n configuration.
-   `src/ai/`: Genkit AI integration.
    -   `flows/automation-advisor.ts`: The core AI logic for recommendations.
-   `middleware.ts`: Handles i18n routing.
-   `public/`: Static assets.

## Key Features

-   **Multi-Language Support (EN/ES):** Using Next.js Internationalized Routing.
-   **Contact Form:** Submits data to `/api/contact`.
-   **Floating WhatsApp Widget:** UI placeholder for WhatsApp chat.
-   **Informative Landing Page:** Sections for Hero, Services, Plans, and Contact.
-   **AI-Powered Automation Advisor:** Provides tailored automation recommendations using Genkit.

## Technologies Used

-   **Framework:** Next.js (App Router)
-   **Styling:** Tailwind CSS with ShadCN UI components
-   **AI Integration:** Genkit
-   **Form Handling:** React Hook Form with Zod for validation
-   **Icons:** Lucide React

## Deployment

This Next.js application can be deployed to various platforms that support Node.js applications, such as:

-   Vercel (Recommended for Next.js)
-   Netlify
-   AWS Amplify
-   Google Cloud Run / Firebase App Hosting
-   Self-hosted Node.js server

For Firebase App Hosting, an `apphosting.yaml` is already provided. Ensure your Firebase project is set up correctly.

Generally, connect your Git repository to the hosting provider and follow their instructions for deploying a Next.js application.
