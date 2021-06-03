import azure.functions as func
import logging
import mimetypes


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.getLogger("azure").setLevel(logging.WARNING)
    file_type = req.route_params.get("type")
    folder = req.route_params.get("folder")
    file_name = req.route_params.get("filename")
    logging.info(f"folder {folder}, file name {file_name}, file type {file_type}")

    if file_type == "css":
        with open(f"static/css/{folder}/{file_name}", "r") as raw_file:
            static_file = raw_file.read()
    elif file_type == "images":
        with open(f"static/images/{folder}/{file_name}", "rb") as raw_file:
            static_file = raw_file.read()
    elif file_type == "js":
        with open(f"static/js/{folder}/{file_name}", "r") as raw_file:
            static_file = raw_file.read()

    mimetype = mimetypes.guess_type(f"{file_name}")

    return func.HttpResponse(
        static_file,
        mimetype=mimetype[0],
        status_code=200,
        headers={"Cache-Control": "max-age=1200, public"}
    )
