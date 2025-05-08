import {tokenApi} from "@/shared/api/token"
import {telegramWindow} from "@/shared/lib/hooks/useTelegram"
import {IS_LOCAL} from "@/shared/app-state"

export const TOKEN_STORAGE = 'jwt-token'

function getToken() {
    return localStorage.getItem(TOKEN_STORAGE)
}

async function updateToken() {
    try {
        const { initData } = telegramWindow.Telegram.WebApp

        const init_data = IS_LOCAL === 'local'
            ? 'query_id=AAFPoJElAAAAAE-gkSVkt7U9&user=%7B%22id%22%3A630300751%2C%22first_name%22%3A%22%D0%92%D0%BB%D0%B0%D0%B4%22%2C%22last_name%22%3A%22%D0%90%D1%81%D1%82%D0%B0%D1%85%D0%BE%D0%B2%22%2C%22username%22%3A%22astahovVlad%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fw_sjcGCKSxH1UDOlT5fx9QvoxvyT4sBtlXUH6RRzgjk.svg%22%7D&auth_date=1731708506&hash=0120f2c6a9451e4efde467e58bfc21ab100a8e3d3ded07877ce2381565c084af'
            : initData

        const { payload } = await tokenApi.generateToken({
            init_data
        })

        if (payload) {
            localStorage.setItem(TOKEN_STORAGE, payload?.token)
            return {
                error: false
            }
        }

        return {
            error: true
        }
    } catch (e) {
        console.log(e)

        return {
            error: false
        }
    }
}

function clearToken() {
    localStorage.setItem(TOKEN_STORAGE, '')
}

export const tokenModel = {
    getToken,
    updateToken,
    clearToken,
}