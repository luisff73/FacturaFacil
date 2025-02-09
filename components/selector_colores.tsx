import React, { useState } from 'react';
import tinycolor from 'tinycolor2';

const SelectorColores: React.FC<{ onColorChange: (colors: { [key: string]: string }) => void }> = ({ onColorChange }) => {
    const [baseColor, setBaseColor] = useState('#4CAF50'); // Color base inicial

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedColor = event.target.value;
        setBaseColor(selectedColor);

        // Calcula los colores ajustados
        const colors = {
            400: tinycolor(selectedColor).lighten(10).toString(), // Un color más claro
            500: selectedColor, // Color base
            600: tinycolor(selectedColor).darken(10).toString(), // Un color más oscuro
            700: tinycolor(selectedColor).darken(20).toString(), // Un color muy oscuro
        };

        // Llama a la función para actualizar los colores
        onColorChange(colors);

        // Actualiza las variables TAILWIND con los nuevos colores
        Object.keys(colors).forEach((key) => {
            document.documentElement.style.setProperty(`--bg-green-${key}`, colors[key as unknown as keyof typeof colors]);
        });


    };

    return (
        <div>
            <label className={`block text-sm font-medium  text-white`}>Color Base</label>
            <input
                type="color"
                value={baseColor}
                onChange={handleChange}
                className="border rounded p-2"
            />
        </div>
    );
};

export default SelectorColores;
