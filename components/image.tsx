import React from 'react';

interface ImageProps {
    src: string;
    width: number;
    height: number;
    className?: string;
    alt: string;
}

const Image: React.FC<ImageProps> = ({ src, width, height, className, alt }) => {
    return (
        <img src={src} width={width} height={height} className={className} alt={alt} />
    );
};

export default Image;