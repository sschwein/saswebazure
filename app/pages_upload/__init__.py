import azure.functions as func
import json
import logging
import os
import uuid
from __app__.utils import (
    load_jinja_template,
    upload_to_blob,
    validate_password,
    write_queue_message
)


def process_voter_file(_file):
    blob_id = str(uuid.uuid4())
    file_data = _file.stream.read()

    upload_to_blob(os.getenv("STORAGE_CONNECTION_STRING"), "voter-files", blob_id, file_data)
    queue_message = {
        "uuid": blob_id,
        "file_name": _file.filename
    }
    write_queue_message(
        os.getenv("STORAGE_CONNECTION_STRING"),
        "parse-voter-file",
        json.dumps(queue_message)
    )

    return "success"


def main(request: func.HttpRequest) -> func.HttpResponse:
    logging.info('pages-upload function started')

    if request.method == "GET":
        html = load_jinja_template("upload.html")
    elif request.method == "POST":
        try:
            password_match = validate_password(
                request.form["password"],
                os.getenv("UPLOAD_PASSWORD")
            )

            if password_match:
                _file = request.files["filename"]
                file_extension = _file.filename.split(".")[-1]

                if file_extension == "txt":
                    is_error = process_voter_file(_file)
                    html = load_jinja_template("upload.html", is_error=is_error)
                else:
                    logging.info("unsupported file type")
                    html = load_jinja_template("upload.html", is_error="filetype")
            else:
                html = load_jinja_template("upload.html", is_error="password")
        except Exception as e:
            logging.error(e)
            html = load_jinja_template("upload.html", is_error="generic")

    return func.HttpResponse(html, mimetype="text/html", status_code=200)
