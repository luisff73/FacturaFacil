
import React from "react";
import NextImage from "next/image";

interface ImageProps {
    src: string;
    width: number;
    height: number;
    className?: string;
    alt: string;
}

const Image: React.FC<ImageProps> = ({ src, width, height, className, alt }) => {
    return (
        <NextImage src={src} width={width} height={height} className={className} alt={alt} />
    );
};

export default Image;