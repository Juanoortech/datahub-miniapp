import logging
import os
import asyncio
import sys

from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import MenuButtonWebApp, WebAppInfo
from aiogram.client.bot import DefaultBotProperties
from aiogram.enums import ParseMode

from bot.handlers import start
from bot.middlewares import api

dp = Dispatcher(storage=MemoryStorage())
bot = Bot(
    token=os.getenv("TELEGRAM_TOKEN"),
    default=DefaultBotProperties(parse_mode=ParseMode.HTML),
)
url = os.getenv("TELEGRAM_URI")


async def main():
    dp.include_routers(start.router)
    dp.update.middleware(api.APISessionMiddleware())
    await bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(text="Start", web_app=WebAppInfo(url=url))
    )
    await dp.start_polling(bot)


logging.basicConfig(level=logging.INFO, stream=sys.stdout)
asyncio.run(main())
