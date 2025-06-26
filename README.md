
# ExerciseMaker AI

## 1. Descripción General

ExerciseMaker AI es un asistente de fitness personal impulsado por un Modelo de Lenguaje Grande (LLM) de Google Gemini. La aplicación permite a los usuarios solicitar y recibir rutinas de ejercicio 100% personalizadas a través de una interfaz de chat conversacional. El sistema recopila información sobre los objetivos del usuario, su nivel de experiencia, el equipamiento disponible y sus preferencias para generar un plan de entrenamiento estructurado y fácil de seguir.

## 2. Características Principales

*   **Asistente Conversacional:** Interactúa con el usuario para recopilar la información necesaria.
*   **Rutinas Personalizadas:** Genera planes de entrenamiento basados en las necesidades específicas del usuario.
*   **Comunicación en Tiempo Real:** Utiliza Server-Sent Events (SSE) para una experiencia de usuario fluida y dinámica.
*   **Visualización Atractiva:** La interfaz de usuario está diseñada para presentar la rutina de una manera clara y organizada.
*   **Arquitectura Modular:** El backend está construido con un diseño modular y desacoplado para facilitar el mantenimiento y la extensibilidad.

## 3. Tecnologías Utilizadas

*   **Backend:** Node.js, Express, TypeScript
*   **Modelo de Lenguaje (LLM):** Google Gemini (gemini-2.0-flash, gemini-2.5-flash-preview-05-20)
*   **Frontend (Sugerido):** React, Vue, Svelte o cualquier framework moderno de JavaScript.
*   **Base de Datos (Simulada):** Archivo `exercises.json`

## 4. Cómo Empezar

Para utilizar la aplicación, sigue estos pasos:

1.  **Clona el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```

2.  **Instala las dependencias del backend:**

    ```bash
    cd <DIRECTORIO_DEL_PROYECTO>
    npm install
    ```

3.  **Configura las variables de entorno:**

    Crea un archivo `.env` en la raíz del proyecto y añade tu clave de API de Google Gemini:

    ```
    GEMINI_API_KEY=tu_api_key
    ```

4.  **Inicia el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

5.  **Abre la interfaz de usuario en tu navegador** (si tienes una implementación de frontend).

## 5. Endpoints de la API

*   `POST /api/chat/stream`: Inicia una conversación y recibe eventos en tiempo real.
*   `DELETE /api/chat/memory`: Borra el historial de una sesión de chat.
*   `GET /api/chat/health`: Comprueba el estado del servidor.
*   `POST /api/exercises/details`: Obtiene detalles de ejercicios específicos.
