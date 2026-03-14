'use client'

import { useState, useEffect, useCallback } from 'react';
import { SunIcon, MoonIcon, PencilIcon } from '@heroicons/react/24/outline';
import SelectorColores from '@/components/selector_colores'; // componente para seleccionar colores
import tinycolor from 'tinycolor2'; // librería para generar colores dinámicos

export default function BarraTemas({ initialColor }: { initialColor: string }) {
    // 1. ESTADOS DEL COMPONENTE
    const [darkMode, setDarkMode] = useState(false); // estado para alternar entre modo oscuro y claro
    const [, setBgColor] = useState(initialColor); // Usamos ',' porque no necesitamos leer el valor, solo actualizarlo
    const [showColorPicker, setShowColorPicker] = useState(false); // estado para alternar entre mostrar y ocultar el selector de colores

    /**
     * 2. LÓGICA DE COLORES DINÁMICOS
     * Genera una paleta completa (100-700) a partir de un color base 
     * y la aplica al documento mediante variables CSS.
     */
    const aplicarColores = (selectedColor: string) => {
        const colors = {
            100: tinycolor(selectedColor).lighten(60).toString(),
            200: tinycolor(selectedColor).lighten(40).toString(),
            400: tinycolor(selectedColor).lighten(10).toString(),
            500: selectedColor,
            600: tinycolor(selectedColor).darken(10).toString(),
            700: tinycolor(selectedColor).darken(20).toString(),
        };

        // Accedemos al DOM para inyectar las variables que usará Tailwind
        if (typeof document !== 'undefined') {
            Object.entries(colors).forEach(([key, value]) => {
                document.documentElement.style.setProperty(`--bg-green-${key}`, value);
            });
        }
    };

    // 3. EFECTOS DE INICIALIZACIÓN Y CAMBIO
    
    // Se ejecuta al montar el componente: aplica el color guardado en la BD
    useEffect(() => { 
        aplicarColores(initialColor);
    }, [initialColor]);

    // Maneja la alternancia entre modo claro y modo oscuro
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    /**
     * 4. MANEJADOR DE CAMBIOS DESDE EL HIJO
     * Esta función se pasa al componente SelectorColores.
     * Cuando el usuario elige un color, el hijo le devuelve la paleta completa.
     */
    const handleColorChange = useCallback((colors: { [key: string]: string }) => {
        const color = colors['700']; // Escogemos el tono oscuro para seguimiento
        setBgColor(color); // Actualizamos el estado para reflejar el cambio
    }, []);

    return (
        <div className="flex space-x-2 bg-green-000">
            {/* Botón para abrir/cerrar el selector de colores */}
            <button
                className="p-2 rounded-lg bg-green-400 dark:bg-gray-700"
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Cambiar color"
                aria-label="Cambiar color"
            >
                <PencilIcon className="h-5 w-5" />
            </button>

            {/* Muestra el selector solo si showColorPicker es true */}
            {showColorPicker && (
                <SelectorColores onColorChange={handleColorChange} initialColor={initialColor} />
            )}

            {/* Botón para alternar Modo Oscuro / Claro */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-green-400 dark:bg-gray-700"
                title={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
                aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
            >
                {darkMode ? (
                    <SunIcon className="h-5 w-5" />
                ) : (
                    <MoonIcon className="h-5 w-5" />
                )}
            </button>
        </div>
    );
}
