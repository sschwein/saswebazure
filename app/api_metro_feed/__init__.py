import azure.functions as func
import json
import logging
from __app__.utils.api import download_entire_metro_feed


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.getLogger("azure").setLevel(logging.WARNING)
    data = list(download_entire_metro_feed())
    data = json.dumps(data).encode("utf-8")

    return func.HttpResponse(
        data,
        mimetype="application/json",
        status_code=200,
        headers={"Cache-Control": "max-age=12000, public"}
    )
