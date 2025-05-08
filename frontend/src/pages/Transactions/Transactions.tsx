import {images} from "@/shared/assets/images"

import {TransactionBalance, TransactionGroupList} from "@/widgets/transactions"

import {TransactionFilters} from "@/features/transaction"

import styles from './Transactions.module.scss'
import {WalletCard} from "@/widgets/WalletCard";
import {useBackButton} from "@/shared/providers";
import {useEffect} from "react";

export const Transactions = () => {
    const { show } = useBackButton()

    useEffect(() => {
        show()
    }, []);

    return (
        <div className={styles.root}>
            <img
                className={styles.image}
                src={images.Decorations.PageBgDecoration}
                alt='page decoration'
            />
            <TransactionBalance />
            <WalletCard />
            <TransactionFilters />
            <TransactionGroupList />
        </div>
    )
}