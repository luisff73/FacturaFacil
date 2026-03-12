'use client'

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, PencilIcon } from '@heroicons/react/24/outline';
import SelectorColores from '@/components/selector_colores';

export default function BarraTemas({ initialColor }: { initialColor: string }) {
    const [darkMode, setDarkMode] = useState(false);
    const [bgColor, setBgColor] = useState(initialColor);
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');

        } else {
            document.documentElement.classList.remove('dark');

        }
    }, [darkMode]);

    const handleColorChange = (colors: { [key: string]: string }) => {

        const color = colors['700'];
        setBgColor(color);
        console.log('Color de fondo actualizado:', bgColor);
    };

    return (
        <div className="flex space-x-2 bg-green-000">
            <button
                className="p-2 rounded-lg bg-green-400 dark:bg-gray-700"
                onClick={() => setShowColorPicker(!showColorPicker)} // Alterna la visibilidad del SelectorColores
                title="Cambiar color"
                aria-label="Cambiar color"
            >
                <PencilIcon className="h-5 w-5" />
            </button>

            {showColorPicker && (
                <SelectorColores onColorChange={handleColorChange} initialColor={initialColor} />
            )}

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
