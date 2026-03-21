

/**
 * SERVICE WORKER (PWA)
 * Este archivo permite que la aplicación funcione más rápido y tenga capacidades offline.
 */

// 1. EVENTO DE INSTALACIÓN: Se ejecuta la primera vez que se carga la web o cuando hay cambios.
// Su objetivo principal es "pre-cachear" (guardar) los archivos estáticos básicos.
self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("v1").then((cache) => {
        // Guardamos los recursos críticos en el almacenamiento del navegador (caché)
        return cache.addAll(["/", "/index.html", "/styles/main.css", "/script/main.js", "/images/logo.png"])
      }),
    )
})

// 2. EVENTO FETCH: Intercepta cada solicitud que el navegador hace a internet.
// Implementa una estrategia "Cache-First" (primero la caché, luego internet).
self.addEventListener("fetch", (event) => {
    event.respondWith(
      // Comprobamos si el recurso ya está en la caché
      caches.match(event.request).then((response) => {
        // Si está en la caché lo devolvemos inmediatamente, si no, lo pedimos a internet
        return response || fetch(event.request)
      }),
    )
})
  
  
  