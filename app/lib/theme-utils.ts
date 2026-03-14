import tinycolor from 'tinycolor2';

export const aplicarColoresTema = (selectedColor: string) => {
    const colors = {
        100: tinycolor(selectedColor).lighten(60).toString(),
        200: tinycolor(selectedColor).lighten(40).toString(),
        400: tinycolor(selectedColor).lighten(10).toString(),
        500: selectedColor,
        600: tinycolor(selectedColor).darken(10).toString(),
        700: tinycolor(selectedColor).darken(20).toString(),
    };

    if (typeof document !== 'undefined') {
        Object.entries(colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--bg-green-${key}`, value);
        });
    }
    
    return colors;
};
