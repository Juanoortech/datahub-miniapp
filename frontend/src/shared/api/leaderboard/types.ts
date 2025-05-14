import {ResponseDefault} from "@/shared/lib/api/createRequest";

export type GetLeaderboardResponse = {
    items: {
        walletAddress: string
        avatar: string
        name: string
        points: number
    }[]
    page: number
    last_page: number
    total?: number
}

export type GetLeaderboardParams = {
    page: number
}

export type GetLeaderboardViewerInfoResponse = {
    viewer_points: number
    viewer_place: number
    viewer_bonus: number
}

export type LeaderboardApi = {
    fetch: (params: GetLeaderboardParams) =>
        Promise<ResponseDefault<GetLeaderboardResponse>>
    fetchViewerInfo: () =>
        Promise<ResponseDefault<GetLeaderboardViewerInfoResponse>>
}