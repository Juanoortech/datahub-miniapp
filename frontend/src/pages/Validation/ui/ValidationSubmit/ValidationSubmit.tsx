import React, {useCallback} from "react";
import {FloatingButtons} from "@/shared/ui/FloatingButtons";
import {Button} from "@/shared/ui";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/app/store";
import {validateResultModel} from "@/features/validation";

export const ValidationSubmit: React.FC<{
    id: number
}> = ({
    id
}) => {
    const { isPending, rate } = useSelector((state: RootState) => state.validationResult)
    const { pool } = useSelector((state: RootState) => state.validationPool)
    const dispatch = useDispatch<AppDispatch>()

    const onClick = useCallback(() => {
        dispatch(validateResultModel.thunks.sendResult({
            id: pool[id]!.completionId,
            rate,
        }))
    }, [rate, id])

    return (
        <FloatingButtons
            childrenCount={1}
        >
            <Button
                isWide={true}
                isLoading={isPending}
                isDisabled={rate === 0}
                onClick={onClick}
            >
                Submit
            </Button>
        </FloatingButtons>
    )
}