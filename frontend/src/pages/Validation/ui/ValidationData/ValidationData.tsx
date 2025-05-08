import React from "react";
import {ValidationExpand} from "@/entities/validation";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import {TaskType} from "@/shared/api/enums";
import {LazyImage} from "@/shared/ui/LazyImage";

import styles from './ValidationData.module.scss'
import {VideoPlayer} from "@/shared/ui/VideoPlayer";
import {clsx} from "clsx";
import {AudioPlayer} from "@/shared/ui/AudioPlayer";

export const ValidationData: React.FC<{
    id: ValidationExpand['taskId']
}> = ({
    id
}) => {
    const {
        pool
    } = useSelector((state: RootState) => state.validationPool)

    if (pool[id].type === TaskType.IMAGE) {
        return (
            <LazyImage
                className={clsx(styles.root, styles.photo)}
                src={pool[id].data}
                alt={`validation-${id}`}
                skeletonMinHeight={446}
            />
        )
    }

    if (pool[id].type === TaskType.VIDEO) {
        return (
            <VideoPlayer
                className={styles.root}
                src={pool[id].data}
            />
        )
    }

    return (
        <AudioPlayer
            className={styles.root}
            src={pool[id].data}
        />
    )
}