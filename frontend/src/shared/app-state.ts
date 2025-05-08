export const IS_LOCAL: 'local' | 'dev' | 'demo' | 'prod' = 'prod'

const BOT_LINK_MAP: Record<'local' | 'dev' | 'demo' | 'prod', string> = {
    local: 'https://t.me/oort_test_bot',
    dev: 'https://t.me/oort_test_bot',
    demo: 'https://t.me/oort_demo_bot',
    prod: 'https://t.me/oort_datahub_bot',
}

export const BOT_LINK = BOT_LINK_MAP[IS_LOCAL]