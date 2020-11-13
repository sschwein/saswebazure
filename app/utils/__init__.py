import jinja2
import logging
import json
from azure.storage.blob import BlobServiceClient
from azure.storage.queue import QueueClient
from azure.cosmos import CosmosClient
from datetime import datetime, date, time, timedelta


def load_jinja_template(filename, **kwargs):
    loader = jinja2.FileSystemLoader(searchpath="./templates")
    template_env = jinja2.Environment(
        loader=loader,
        autoescape=jinja2.select_autoescape(['html', 'xml'])
    )
    template = template_env.get_template(filename)
    html = template.render(**kwargs)
    return html


def upload_to_blob(connection_string, container, file_name, data, overwrite=False):
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container)
    container_client.upload_blob(file_name, data, overwrite=overwrite)

    logging.debug(f"Uploaded blob {file_name} to container {container}")


def read_from_blob(connection_string, container, file_name):
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container)
    blob_stream = container_client.download_blob(file_name)

    logging.debug(f"Downloaded blob {file_name} from container {container}")

    return blob_stream


def write_queue_message(connection_string, queue, message):
    queue = QueueClient.from_connection_string(conn_str=connection_string, queue_name=queue)
    queue.send_message(message)

    logging.debug(f"Wrote Queue message to {queue}")


def upload_to_cosmos(uri, key, database_name, container_name, data):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    container.upsert_item(data)

    logging.debug(f"Uploaded Cosmos item to {database_name}.{container_name}")


def read_from_cosmos(uri, key, database_name, container_name, item_id, partition_key):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    item = container.read_item(item_id, partition_key=partition_key)

    logging.debug(f"Read Cosmos item from {database_name}.{container_name}")

    return item


def query_cosmos(uri, key, database_name, container_name, query):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    items = container.query_items(query, enable_cross_partition_query=True)

    logging.debug(f"Queried Cosmos container {database_name}.{container_name}")

    return items


def read_all_from_cosmos(uri, key, database_name, container_name):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    item = container.read_all_items()

    logging.debug(f"Reading Cosmos all items from {database_name}.{container_name}")

    return item


class DateTimeEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, (datetime, date, time)):
            return obj.isoformat()
        elif isinstance(obj, timedelta):
            return (datetime.min + obj).time().isoformat()

        return super(DateTimeEncoder, self).default(obj)
