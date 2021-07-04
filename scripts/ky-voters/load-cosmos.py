import os
from azure.cosmos import CosmosClient
# from multiprocessing.pool import ThreadPool


# DEV
# COSMOS_URI = os.environ["DEV_COSMOS_URI"]
# COSMOS_KEY = os.environ["DEV_COSMOS_KEY"]
# PROD
COSMOS_URI = os.environ["PROD_COSMOS_URI"]
COSMOS_KEY = os.environ["PROD_COSMOS_KEY"]


def query_cosmos(uri, key, database_name, container_name, query):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    items = container.query_items(query, enable_cross_partition_query=True)

    return items


def replace_cosmos(uri, key, database_name, container_name, doc, partition_key):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    container.replace_item(item=doc, partition_key=partition_key)
