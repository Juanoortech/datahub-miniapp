import logging
from typing import List, Any

from ninja.pagination import AsyncPaginationBase
from ninja import Schema, Field


class MyPaginator(AsyncPaginationBase):
    class Input(Schema):
        page: int = Field(1, ge=1)
        page_size: int = Field(10, ge=1)

    class Output(Schema):
        items: List[Any]
        page: int
        last_page: int
        total: int

    def paginate_queryset(self, queryset, pagination: Input, **params) -> Any:
        logging.error(pagination)
        total_items = self._items_count(queryset)
        last_page = (total_items + pagination.page_size - 1) // self._items_count(queryset)

        return {
            "items": queryset[
                     (pagination.page - 1)
                     * pagination.page_size: pagination.page
                                             * pagination.page_size
                     ],
            "page": pagination.page,
            "last_page": last_page,
            "total": total_items,
        }

    async def apaginate_queryset(self, queryset, pagination: Input, **params) -> Any:
        logging.error(pagination)
        total_items = await self._aitems_count(queryset)
        last_page = (total_items + pagination.page_size - 1) // pagination.page_size

        return {
            "items": queryset[
                     (pagination.page - 1)
                     * pagination.page_size: pagination.page
                                             * pagination.page_size
                     ],
            "page": pagination.page,
            "last_page": last_page,
            "total": total_items,
        }
