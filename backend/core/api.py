from ninja import NinjaAPI
from ninja.security import HttpBearer
import jwt
from core import settings

from accounts.api import router as accounts_router
from challenges.api import router as challenges_router
from tasks.api import router as tasks_router
from service.api import router as service_router

class GlobalJWTAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = payload.get("user")
            if user:
                return user
        except Exception as e:
            import logging
            logging.error(f"[AUTH] JWT decode error: {e}")
        return None

api = NinjaAPI(
    title="NinjaAPI", version="1.0.0",
    auth=GlobalJWTAuth(),
)

api.add_router("accounts", accounts_router)
api.add_router("challenges", challenges_router)
api.add_router("tasks", tasks_router)
api.add_router("service", service_router)
