import json
import logging
import subprocess
from copy import deepcopy
from datetime import datetime
from multiprocessing import Pool
from utils import trim_address

nominatim_search_template = 'nominatim search --project-dir /mnt/nas/sschwein/Drive/Nominatim/nominatim-planet --query "{address}"'


def load_addresses():
    addresses = dict()
    with open("voter-list-full.jsonl", "r") as _file:
        for i, row in enumerate(_file.readlines()):
            voter = json.loads(row)
            trimmed_address = trim_address(voter["residence"]["street_address"])
            voter["nominatim_address"] = f'{trimmed_address}; {voter["residence"]["state"]}, {voter["residence"]["zip"][:5]}'
            addresses[voter["nominatim_address"]] = voter

        logging.info(f"loaded {len(addresses.items())} unique addresses")

    return addresses


def process_address(args):
    index, addr = args
    error = False
    nominatim_search = deepcopy(nominatim_search_template).format(address=addr["nominatim_address"])
    result = subprocess.run(nominatim_search, shell=True, capture_output=True)

    try:
        stdout = json.loads(result.stdout.decode("utf-8"))
    except Exception as e:
        stdout = f"Python Exception: {e}"
        error = True

    result = {
        "error": error,
        "stdout": stdout,
        "nominatim_address": addr["nominatim_address"]
    }

    if index % 25 == 0:
        logging.info(f"Converted {index}th address")

    return result


def record_results(results):
    for result in results:
        if result["error"]:
            output = {
                "nominatim_address": result["nominatim_address"],
                "message": result["stdout"]
            }
            with open("gps-errors-parallel.jsonl", "a") as _file:
                _file.write(f"{json.dumps(output)}\n")
        elif len(result["stdout"]) == 0:
            output = {
                "nominatim_address": result["nominatim_address"],
                "message": "No address found"
            }
            with open("gps-errors-parallel.jsonl", "a") as _file:
                _file.write(f"{json.dumps(output)}\n")
        elif len(result["stdout"]) > 1:
            output = {
                "nominatim_address": result["nominatim_address"],
                "message": f"{len(result['stdout'])} addresses found"
            }
            with open("gps-errors-parallel.jsonl", "a") as _file:
                _file.write(f"{json.dumps(output)}\n")
        else:
            output = {
                "result": result["stdout"],
                "address": result["nominatim_address"]
            }
            with open("gps-voters-parallel.jsonl", "a") as _file:
                _file.write(f"{json.dumps(output)}\n")


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.INFO)
    addresses = load_addresses()

    start_time = datetime.now()
    with Pool(8) as pool:
        results = pool.map(process_address, enumerate(addresses.values()))

    end_time = datetime.now()
    logging.info(f"Total time taken: {(end_time - start_time).total_seconds()}")

    record_results(results)

    logging.info(f"Geo-coded {len(results)} addresses")
