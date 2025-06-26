
# Arquitectura de ExerciseMaker AI

## 1. Resumen

ExerciseMaker AI es una aplicación diseñada para funcionar como un asistente de fitness personal impulsado por un Modelo de Lenguaje Grande (LLM). El sistema utiliza una arquitectura modular y desacoplada para proporcionar a los usuarios rutinas de ejercicio personalizadas a través de una interfaz de chat conversacional.

## 2. Componentes Principales

El sistema se compone de cuatro componentes principales que interactúan entre sí:

1.  **Frontend (UI):** La interfaz de usuario con la que interactúa el usuario. Es responsable de presentar el chat, enviar los mensajes del usuario al backend y renderizar las respuestas del LLM, incluidas las rutinas de ejercicio estructuradas.
2.  **Backend (API):** El orquestador central del sistema. Construido con **Node.js** y **Express**, gestiona las peticiones HTTP del frontend, se comunica con el LLM, maneja la lógica de la conversación y ejecuta herramientas para construir la rutina. La comunicación con el cliente se realiza mediante **Server-Sent Events (SSE)** para una experiencia en tiempo real.
3.  **Modelo de Lenguaje (LLM):** El "cerebro" de la aplicación. Se utiliza **Google Gemini** para comprender la intención del usuario, gestionar el diálogo, utilizar herramientas (Function Calling) para buscar ejercicios y generar la rutina final en formato JSON.
4.  **Base de Datos de Ejercicios (ExerciseDB):** Contiene la información detallada de los ejercicios. En la versión actual, se simula con un archivo `exercises.json` local.

## 3. Flujo de Interacción

1.  **Inicio de la Conversación:** El usuario envía un mensaje a través de la UI.
2.  **Procesamiento del Backend:** El backend recibe el mensaje y gestiona el historial de la conversación.
3.  **Ciclo de Aclaración (LLM):** El backend envía el historial al LLM. Si falta información, el LLM genera preguntas de seguimiento.
4.  **Uso de Herramientas (LLM & Backend):** Una vez que el LLM tiene suficiente información, llama a la herramienta `find_exercises`. El backend ejecuta esta función contra la base de datos de ejercicios.
5.  **Generación de la Rutina (LLM):** Con la lista de ejercicios, el backend vuelve a llamar al LLM para que utilice la herramienta `create_exercise_routine`, que ensambla una rutina estructurada en formato JSON.
6.  **Respuesta Final a la UI:** El backend recibe el JSON, lo valida y lo envía al frontend a través de un evento SSE `ui_action`.
7.  **Visualización:** El frontend recibe el evento y renderiza la rutina en un formato visualmente atractivo.

## 4. Arquitectura de Módulos del Backend (TypeScript)

El backend sigue una arquitectura modular y de separación de responsabilidades:

```
src/
├── api/                # Capa de Express (Controladores, Rutas, Middlewares)
│   ├── controllers/
│   ├── middlewares/
│   └── routes/
├── core/               # Lógica de negocio principal (desacoplada de Express)
│   ├── agent/          # Orquestador del agente, servicio SSE y tipos
│   ├── llm/            # Interacción con Gemini, prompts y definición de herramientas
│   ├── exercise/       # Lógica de negocio para ejercicios y rutinas
│   └── session/        # Gestión del historial de conversación
├── shared/             # Utilidades y tipos compartidos
├── config/             # Carga de variables de entorno
├── app.ts              # Configuración de la aplicación Express
└── server.ts           # Punto de entrada del servidor
```

## 5. Principios de Diseño

*   **Separación de Responsabilidades (SoC):** La lógica de negocio está desacoplada del framework web.
*   **Tipado Estricto:** Se utiliza TypeScript para definir interfaces claras.
*   **Modularidad:** La funcionalidad se divide en módulos cohesivos.
*   **Inversión de Dependencias:** Se utilizan interfaces para desacoplar componentes.
*   **Generación de Estructuras mediante Function Calling:** Se utilizan las herramientas del LLM para generar JSON estructurado de forma fiable.
