'use client'

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, PencilIcon } from '@heroicons/react/24/outline';
import SelectorColores from '@/components/selector_colores';

export default function BarraTemas() {
    const [darkMode, setDarkMode] = useState(false);
    const [bgColor, setBgColor] = useState('--bg-green-700');
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');

        } else {
            document.documentElement.classList.remove('dark');

        }
    }, [darkMode]);

    const handleColorChange = (colors: { [key: string]: string }) => {

        const color = colors['700']; // Asegúrate de usar la clave correcta
        setBgColor(color);
        console.log('Color de fondo actualizado:', color);
    };

    return (
        <div className="flex space-x-2 bg-green-000">
            <button
                className="p-2 rounded-lg bg-green-400 dark:bg-gray-700"
                onClick={() => setShowColorPicker(!showColorPicker)} // Alterna la visibilidad del SelectorColores
            >
                <PencilIcon className="h-5 w-5" />
            </button>

            {showColorPicker && (
                <SelectorColores onColorChange={handleColorChange} />
            )}

            <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-green-400 dark:bg-gray-700"
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
