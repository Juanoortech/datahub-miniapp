import logging

import aiohttp
import json


class APIWorker:
    _session = None
    _api = "http://backend:8000/api/v1"

    def __init__(self) -> None:
        if not self._session:
            self._session = aiohttp.ClientSession()

    async def cleanup(self):
        await self._session.close()

    async def req(self, endpoint: str, params: list = None):
        async with self._session.get(f"{self._api}{endpoint}", params=params) as resp:
            data = await resp.json()

        return data

    async def post_req(self, endpoint: str, data: dict | None = {}):
        logging.error(data)
        async with self._session.post(
            f"{self._api}{endpoint}", data=json.dumps(data)
        ) as resp:
            data = await resp.json(content_type=resp.content_type)

        return data

    async def create_user(
        self,
        _id: int,
        name: str,
        username: str = None,
        referral_code: str = None,
        is_premium: bool = False,
        language_code: str = "en",
    ) -> dict:
        data = {
            "id": _id,
            "name": name,
            "username": username,
            "referral_code": referral_code,
            "is_premium": is_premium,
            "language_code": language_code,
        }

        return await self.post_req(endpoint="/accounts/", data=data)
