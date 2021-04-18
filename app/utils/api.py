import os
from __app__.utils import query_cosmos


def trim_cosmos_internal_fields(item):
    del item["_rid"]
    del item["_self"]
    del item["_etag"]
    del item["_attachments"]
    del item["_ts"]

    return item


def download_entire_metro_feed():
    feed = query_cosmos(
        os.getenv("COSMOS_URI"),
        os.getenv("COSMOS_KEY"),
        "metro",
        "rss-feed",
        "SELECT c.title, c.summary, c.tags, c.published FROM c ORDER BY c.published DESC OFFSET 0 LIMIT 10"
    )

    return feed
