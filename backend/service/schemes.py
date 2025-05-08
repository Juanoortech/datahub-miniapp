from ninja import FilterSchema, Schema


class LinksSchema(FilterSchema):
    ios: str
    android: str
    apk: str


class DetailOut(Schema):
    detail: str
