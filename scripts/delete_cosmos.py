from azure.cosmos import CosmosClient

# DEV
COSMOS_URI = "https://sschwein-dev-cosmos.documents.azure.com:443/"
COSMOS_KEY = "IZWL048ukGpmT9Lb2sVfORpvSLmf2nUJjOYu9Qbru0TEAAcxXYLmBL62Sx9soM93oQKdkm3bpaA5PwFH2xGPZA=="
# PROD
# COSMOS_URI = "https://sschwein-greenberg-cosmos-prod.documents.azure.com:443/"
# COSMOS_KEY = "pNC4jxY3AQhRJX3biPVmHMT8CdeIubT9QtGkGYOJ7Lk1n1bSTopvB9Zm9jN8VReHWdnFjk0uNPe7faFqJpGmNg=="


def query_cosmos(uri, key, database_name, container_name, query):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    items = container.query_items(query, enable_cross_partition_query=True)

    return items


def delete_from_cosmos(uri, key, database_name, container_name, doc_id, partition_key):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    container.delete_item(item=doc_id, partition_key=partition_key)


cosmos_query = query_cosmos(
    COSMOS_URI,
    COSMOS_KEY,
    "metro",
    "rss-item",
    "SELECT * FROM c"
)

for i, item in enumerate(cosmos_query):
    delete_from_cosmos(
        COSMOS_URI,
        COSMOS_KEY,
        "metro",
        "rss-item",
        item["id"],
        item["title"]
    )
    if i % 25 == 0:
        print(f'deleted {i} docs')
