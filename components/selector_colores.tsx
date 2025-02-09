import React, { useState } from 'react';
import tinycolor from 'tinycolor2';

const SelectorColores: React.FC<{ onColorChange: (colors: { [key: string]: string }) => void }> = ({ onColorChange }) => {
    const [baseColor, setBaseColor] = useState('#4CAF50'); // Color base inicial

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedColor = event.target.value;
        setBaseColor(selectedColor);

        // Calcula los tonos ajustados
        const colors = {
            100: tinycolor(selectedColor).lighten(60).toString(), // Un tono muy claro
            200: tinycolor(selectedColor).lighten(40).toString(), // Un tono claro
            400: tinycolor(selectedColor).lighten(10).toString(), // Un tono más claro
            500: selectedColor, // Color base
            600: tinycolor(selectedColor).darken(10).toString(), // Un tono más oscuro
            700: tinycolor(selectedColor).darken(20).toString(), // Un tono muy oscuro
        };

        // Llama a la función para actualizar los colores
        onColorChange(colors);

        // Actualiza las variables CSS con los nuevos colores
        Object.keys(colors).forEach((key) => {
            document.documentElement.style.setProperty(`--bg-green-${key}`, colors[key as unknown as keyof typeof colors]);
        });


    };

    return (
        <div>
            <label className={`block text-sm font-medium text-center text-white`}>Color Base</label>
            <input 
                type="color"
                value={baseColor}
                onChange={handleChange}
                className="border rounded p-2 w-full bg-green-400 border-green-400" 
            />
        </div>
    );
};

export default SelectorColores;
