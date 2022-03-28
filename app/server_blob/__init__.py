import azure.functions as func
import logging
import os
from __app__.utils import read_from_blob


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.getLogger("azure").setLevel(logging.WARNING)
    container = req.route_params.get("container")
    file_name = req.route_params.get("filename")
    file_extension = req.route_params.get("extension")
    logging.info(f"blob container {container}, file name {file_name}, extension {file_extension}")

    blob_stream = read_from_blob(os.getenv("STORAGE_CONNECTION_STRING"), container, f"{file_name}.{file_extension}")
    data = blob_stream.content_as_text(max_concurrency=1, encoding='UTF-8')

    return func.HttpResponse(data, mimetype="text/plain", status_code=200)
