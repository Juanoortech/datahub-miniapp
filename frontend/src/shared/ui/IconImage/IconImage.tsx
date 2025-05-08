import React from "react";
import { HandySvg } from "handy-svg";

import { PropsDefault } from "@/shared/lib/types";
import {iconImages} from "@/shared/assets/icon-images";

import { names } from './model'

export type IconImageProps = PropsDefault<{
    name: (typeof names)[number]
    size: number
}>

export const IconImage: React.FC<IconImageProps> = ({
    className,
    name,
    size
}) => {
    return (
        <HandySvg 
            className={className}
            src={iconImages[name]}
            alt={`icon-image-${name}`}
            width={size}
            height={size}
        />
    )
}