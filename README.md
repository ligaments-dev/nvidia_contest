# NVIDIA Developer Contest

The **Telecom Field Assistant Bot** is a smart, conversational assistant developed to support field technicians in the telecommunications industry. It leverages advanced natural language processing to provide real-time assistance with troubleshooting, protocol guidance, and quick access to telecom resources. The bot is designed for mobile use, enabling technicians to quickly resolve issues and follow industry standards without needing to consult multiple manuals or documents.

The application uses NVIDIA's Retrieval-Augmented Generation (RAG) model for enhanced data processing from various file formats such as PDF, PPT, and images. This feature-rich assistant aims to boost efficiency by providing instant, context-aware solutions directly to the technician in the field.

## Frontend Installation and Setup

To set up and run the Next.js frontend application from the `ui` branch, follow these steps:

1. Clone the repository and switch to the `ui` branch:
    ```bash
    git clone https://github.com/ligaments-dev/nvidia_contest.git
    cd nvidia_contest
    git checkout ui
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the Next.js development server:
    ```bash
    npm run dev
    ```

4. Access the application by opening [http://localhost:3000](http://localhost:3000) in your web browser.

This guide ensures a simple setup process using Next.js, a React framework for building performant, responsive web applications. Running `npm install` installs the required packages, and `npm run dev` starts the development server for local testing and iteration.
