import React, { useState, useEffect, useCallback } from 'react';
import tinycolor from 'tinycolor2';
import { updateUserCss } from '@/app/lib/actions';

const SelectorColores: React.FC<{
    onColorChange: (colors: { [key: string]: string }) => void,
    initialColor: string
}> = ({ onColorChange, initialColor }) => {
    const [baseColor, setBaseColor] = useState(initialColor); // Usar el color de la BD

    const applyColors = useCallback((selectedColor: string) => {
        const colors = {
            100: tinycolor(selectedColor).lighten(60).toString(), // Un tono muy claro
            200: tinycolor(selectedColor).lighten(40).toString(), // Un tono claro
            400: tinycolor(selectedColor).lighten(10).toString(), // Un tono más claro
            500: selectedColor, // Color base
            600: tinycolor(selectedColor).darken(10).toString(), // Un tono más oscuro
            700: tinycolor(selectedColor).darken(20).toString(), // Un tono muy oscuro
        };

        onColorChange(colors);

        Object.keys(colors).forEach((key) => {
            document.documentElement.style.setProperty(`--bg-green-${key}`, colors[key as unknown as keyof typeof colors]);
        });
    }, [onColorChange]);

    // Efecto para aplicar el color inicial al montar el componente (al refrescar página)
    useEffect(() => {
        applyColors(initialColor);
    }, [initialColor, applyColors]);

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedColor = event.target.value;
        setBaseColor(selectedColor);

        // Aplicar visualmente al instante
        applyColors(selectedColor);

        // Guardar en la base de datos (Server Action)
        try {
            await updateUserCss(selectedColor);
        } catch (error) {
            console.error("No se pudo guardar el color:", error);
        }
    };

    return (
        <div>
            <label className={"block text-sm font-medium text-center bg-opacity-0 text-green-700"}>Color App</label>
            <input
                type="color"
                value={baseColor}
                onChange={handleChange}
                className="border rounded p-2 w-full bg-green-400 border-green-400 text-color-black"
            />
        </div>
    );
};

export default SelectorColores;
