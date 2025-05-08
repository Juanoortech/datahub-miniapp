import {FloatingButtons} from "@/shared/ui/FloatingButtons";
import {ButtonSkeleton} from "@/shared/ui/Button/ButtonSkeleton";

export const ValidationSubmitSkeleton = () => (
    <FloatingButtons childrenCount={1}>
        <ButtonSkeleton />
    </FloatingButtons>
)