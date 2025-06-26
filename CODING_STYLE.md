
# Guía de Estilo de Codificación para ExerciseMaker AI

## 1. Introducción

Este documento establece las convenciones de codificación, el formato y las mejores prácticas a seguir en el proyecto ExerciseMaker AI. El objetivo es mantener un código limpio, consistente y fácil de mantener.

## 2. Lenguaje y Formato

*   **Lenguaje:** Todo el código del backend debe estar escrito en **TypeScript**.
*   **Formato:** Se utilizará **Prettier** para el formateo automático del código. La configuración de Prettier se definirá en un archivo `.prettierrc` en la raíz del proyecto.
*   **Linting:** Se utilizará **ESLint** para identificar y corregir problemas en el código. La configuración de ESLint se definirá en un archivo `.eslintrc.js`.

## 3. Convenciones de Nomenclatura

*   **Variables y Funciones:** Utilizar `camelCase` (e.g., `myVariable`, `myFunction`).
*   **Clases e Interfaces:** Utilizar `PascalCase` (e.g., `MyClass`, `IMyInterface`).
*   **Interfaces:** Prefijar los nombres de las interfaces con una `I` (e.g., `IExercise`, `ISessionService`).
*   **Archivos:** Utilizar `kebab-case` para los nombres de archivo (e.g., `chat.controller.ts`, `exercise.service.ts`).

## 4. Tipado

*   **Tipado Estricto:** Habilitar las opciones de tipado estricto de TypeScript en el archivo `tsconfig.json` (`"strict": true`).
*   **Interfaces y Tipos:** Definir interfaces o tipos para todos los modelos de datos, parámetros de funciones y contratos de API. Agrupar los tipos relacionados en archivos `*.types.ts` dentro de su módulo correspondiente.

## 5. Arquitectura y Estructura de Módulos

*   **Separación de Responsabilidades:** Seguir la estructura de módulos definida en el documento de arquitectura. La lógica de negocio debe residir en el directorio `src/core` y estar desacoplada del framework web.
*   **Inversión de Dependencias:** Utilizar interfaces para desacoplar los servicios de alto nivel de sus implementaciones concretas.
*   **Controladores:** Los controladores deben ser delgados y actuar como una capa de adaptación HTTP. Su única responsabilidad es recibir las peticiones, validarlas y delegar la lógica de negocio a los servicios correspondientes.

## 6. Prompts y Herramientas del LLM

*   **Centralización:** Los prompts del sistema y las definiciones de las herramientas del LLM deben estar centralizados en archivos dedicados (`src/core/llm/llm.prompts.ts` y `src/core/llm/llm.tools.ts`).
*   **Claridad:** Los prompts deben ser claros, concisos y seguir las mejores prácticas para guiar el comportamiento del LLM.

## 7. Manejo de Errores

*   **Middleware Global:** Utilizar un middleware de manejo de errores global en Express para capturar y gestionar los errores de forma centralizada.
*   **Errores HTTP:** Utilizar códigos de estado HTTP apropiados para indicar el resultado de las peticiones.

## 8. Pruebas

*   **Pruebas Unitarias:** Escribir pruebas unitarias para los servicios y la lógica de negocio.
*   **Pruebas de Integración:** Escribir pruebas de integración para los endpoints de la API.
*   **Mocks:** Utilizar mocks para aislar los componentes y probarlos de forma independiente.
