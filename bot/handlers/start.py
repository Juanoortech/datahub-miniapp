import os
from aiogram import Router
from aiogram.utils.deep_linking import decode_payload
from aiogram.filters import CommandStart, CommandObject
from aiogram.fsm.context import FSMContext
from aiogram.types import Message
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

from bot.worker import APIWorker
from bot.texts import START_TEXT

ikb_play = InlineKeyboardMarkup(
    row_width=1,
    inline_keyboard=[
        [
            InlineKeyboardButton(
                text="Start",
                web_app=WebAppInfo(url=os.getenv("TELEGRAM_URI")),
            )
        ],
    ],
)

router = Router(name="start")


@router.message(CommandStart(deep_link=True))
async def command_ref_start_handler(
        message: Message, api: APIWorker, state: FSMContext, command: CommandObject = None
):
    await state.clear()
    args = command.args
    payload = decode_payload(args)
    await api.create_user(
        _id=message.from_user.id,
        name=message.from_user.full_name,
        username=message.from_user.username,
        referral_code=payload,
        is_premium=message.from_user.is_premium,
        language_code=message.from_user.language_code,
    )
    return await message.answer(
        text=START_TEXT.format(name=message.from_user.full_name),
        reply_markup=ikb_play,
    )


@router.message(CommandStart())
async def command_start_handler(
        message: Message, api: APIWorker, state: FSMContext, command: CommandObject = None
):
    await state.clear()
    await api.create_user(
        _id=message.from_user.id,
        name=message.from_user.full_name,
        username=message.from_user.username,
        is_premium=message.from_user.is_premium,
        language_code=message.from_user.language_code,
    )
    return await message.answer(
        text=START_TEXT.format(name=message.from_user.full_name),
        reply_markup=ikb_play,
    )
