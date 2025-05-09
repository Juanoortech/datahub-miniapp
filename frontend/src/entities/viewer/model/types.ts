export type Viewer = {
    walletAddress: string,
    photo: string,
    name: string,
    isBanned: boolean,

    balance: number,
    referralsBalance: number,

    referralCode: string,
    referralLevel: number,
    leaderboardBonus: number,
    story: string,

    isWalletConnect: boolean,
    walletConnectCode: string,

    isFirstUse: boolean
}