import {TaskTypeFilter} from "@/shared/ui/TaskTypeFilter"

import styles from './ValidationFilter.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/app/store";
import {validationListModel} from "@/entities/validation";
import {useEffect} from "react";

export const ValidationFilter = () => {
    const { activeType } = useSelector((state: RootState) => state.validation)

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(validationListModel.thunks.fetch({
            page: 1,
            type: activeType,
        }))
    }, [activeType]);

    return (
        <TaskTypeFilter
            className={styles.root}
            value={activeType}
            setValue={v => {
                console.log(v)
                dispatch(validationListModel.actions.setActiveType(v))
            }}
        />
    )
}