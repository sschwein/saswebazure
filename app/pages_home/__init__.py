import azure.functions as func
import logging
from __app__.utils import load_jinja_template


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.getLogger("azure").setLevel(logging.WARNING)
    logging.info('request received to load home page')

    html = load_jinja_template("home.html")

    return func.HttpResponse(html, mimetype="text/html", status_code=200)
