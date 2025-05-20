from django.core.handlers.asgi import ASGIRequest
from django.core.handlers.wsgi import WSGIRequest
from ninja import Router, Query

from service.models import AppLinks
from service.schemes import LinksSchema, DetailOut

router = Router()

# All endpoints now use global authentication

@router.get(
    "/app-links/",
    response={200: LinksSchema, 404: DetailOut},
    summary="Get links",
)
async def get_links(request: WSGIRequest | ASGIRequest):
    try:
        links: AppLinks = await AppLinks.objects.filter().afirst()
    except AppLinks.DoesNotExist:
        return 404, {"detail": "Links object does not exist"}
    return 200, links
