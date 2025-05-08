import os
from typing import Optional, Dict
from urllib import request
from urllib.error import HTTPError
import json
from django.conf import settings


def prepare_data(data: Optional[Dict]):
    _json = json.dumps(data)
    _bytes = str(_json).encode()

    return _bytes


class Checker:
    _uri = f"{settings.TELEGRAM_ENDPOINT}/getChatMember"

    def req(self, data: Optional[Dict] = {}):
        _data = prepare_data(data=data)
        _request = request.Request(self._uri, data=_data, method="POST")
        _request.add_header("Content-Type", "application/json")

        try:
            _response = request.urlopen(_request)
        except HTTPError as e:
            return e.read()

        return {"response": _response.read()}

    def check_member(self, _id: int, channel: str):
        data = {"chat_id": channel, "user_id": _id}

        return self.req(data=data)
