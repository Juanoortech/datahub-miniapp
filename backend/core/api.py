from ninja import NinjaAPI

from accounts.api import router as accounts_router
from challenges.api import router as challenges_router
from tasks.api import router as tasks_router
from service.api import router as service_router

api = NinjaAPI(
    title="NinjaAPI", version="1.0.0",
)

api.add_router("accounts", accounts_router)
api.add_router("challenges", challenges_router)
api.add_router("tasks", tasks_router)
api.add_router("service", service_router)
