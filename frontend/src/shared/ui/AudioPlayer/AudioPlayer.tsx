import React, { useCallback, useRef, useState } from "react"

import { PropsDefault } from "@/shared/lib/types"

import { ButtonIcon } from "../ButtonIcon"

import styles from './AudioPlayer.module.scss'

export type AudioPlayerProps = PropsDefault<{
    src: string
}>

const AudioPlayerComponent: React.FC<AudioPlayerProps> = ({
    className,
    src,
}) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const context = useRef<AudioContext | null>(null)
    const analyser = useRef<AnalyserNode | null>(null)
    const mediaElement = useRef<MediaElementAudioSourceNode | null>(null)
    const array = useRef<Uint8Array | null>(null)
    const currentElement = useRef<number>(0)

    const [isPlaing, setIsPlaing] = useState(false)

    const classes = [
        className ? className : '',
        styles.root,
    ].join(' ').trim()

    const toggle = useCallback(async () => {
        if (audioRef.current) {
            if (!context.current) {
                context.current = new AudioContext();
                analyser.current = context.current.createAnalyser();
                mediaElement.current = context.current.createMediaElementSource(audioRef.current);
                mediaElement.current.connect(analyser.current);
                analyser.current.connect(context.current.destination);
            }
    
            if (isPlaing) {
                audioRef.current.pause();
                setIsPlaing(false);
            } else {
                try {
                    await audioRef.current.play(); // Вызов play должен быть оборудован в `try...catch`
                    loop();
                    setIsPlaing(true);
                } catch (error) {
                    console.error('Playback error:', error);
                }
            }
        }
    }, [isPlaing]);

    function loop() {
        if (audioRef.current) {
            if (!audioRef.current!.paused) {
                window.requestAnimationFrame(loop)
            }
            array.current = new Uint8Array(analyser.current!.frequencyBinCount)
            analyser.current!.getByteFrequencyData(array.current)

            wrapperRef.current!.children[currentElement.current].classList.add(styles['is-active'])
            // @ts-ignore
            wrapperRef.current!.children[currentElement.current].style.height = `${array.current[currentElement.current] / 2}px`
            // @ts-ignore
            wrapperRef.current!.children[currentElement.current].style.opacity = 0.008 * array.current[currentElement.current] / 2

            if (currentElement.current < 39) {
                currentElement.current += 1
            } else {
                currentElement.current = 0
            }
        }
    }

    return (
        <div 
            className={classes}
        >
            <audio
                className={styles.source}
                ref={audioRef}
                src={src}
                crossOrigin={'anonymous'}
                controls
            />
            <div 
                ref={wrapperRef}
                className={styles.wrapper}
            >
                {Array(40).fill(1).map((_, key) => (
                    <div 
                        key={key}
                        className={styles.item}
                    />
                ))}
            </div>
            <ButtonIcon 
                className={styles.button}
                icon={isPlaing ? 'pause' : 'play'}
                view={'surface-secondary'}
                size={'l'}
                radius={'rounded'}
                onClick={toggle}
            />
        </div>
    )
}

export const AudioPlayer = React.memo(AudioPlayerComponent)