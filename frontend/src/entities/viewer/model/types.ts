export type Viewer = {
    id: number,
    photo: string,
    name: string,
    isBanned: boolean,

    balance: number,
    referralsBalance: number

    isPremium: boolean,
    referralCode: string,
    referralLevel: number,
    leaderboardBonus: number
    story: string

    isWalletConnect: boolean
    walletConnectCode: string

    isFirstUse: boolean
}