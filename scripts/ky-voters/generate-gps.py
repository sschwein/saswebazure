import json
import argparse
import logging
import subprocess
from copy import deepcopy
from datetime import date

parser = argparse.ArgumentParser()
parser.add_argument('input_file')

nominatim_search_template = 'nominatim search --project-dir /mnt/nas/sschwein/Drive/Nominatim/nominatim-planet --query "{address}"'


def run(args):
    with open(args.input_file, "r") as _file:
        voters = json.loads(_file.read())
        logging.info("finished loading voter file")
    
    for i, voter in enumerate(voters):
        # OpenStreetMap needs exact city when searching. Cut off search with Louisville for any failed locations
        address_string = f'{voter["residence"]["street_address"]}, {voter["residence"]["city_address"]}, {voter["residence"]["state"]} {voter["residence"]["zip"]}'
        nominatim_address_string = f'{voter["residence"]["street_address"]}, {voter["residence"]["state"]} {voter["residence"]["zip"][:5]}'
        nominatim_search = deepcopy(nominatim_search_template).format(address=nominatim_address_string)

        results = subprocess.run(nominatim_search, shell=True, capture_output=True)

        try:
            stdout = json.loads(results.stdout.decode("utf-8"))
        except Exception as e:
            error = {
                "address": address_string,
                "nominatim_address": nominatim_address_string,
                "message": f"Python Exception: {e}"
            }
            with open("gps-errors.jsonl", "a") as _file:
                _file.write(f"{json.dumps(error)}\n")

            if i % 250 == 0:
                logging.info(f"Converted {i} addresses")
            continue

        if len(stdout) == 0:
            error = {
                "address": address_string,
                "nominatim_address": nominatim_address_string,
                "message": "No address found"
            }
            with open("gps-errors.jsonl", "a") as _file:
                _file.write(f"{json.dumps(error)}\n")
        elif len(stdout) > 1:
            error = {
                "address": address_string,
                "nominatim_address": nominatim_address_string,
                "message": f"{len(stdout)} addresses found"
            }
            with open("gps-errors.jsonl", "a") as _file:
                _file.write(f"{json.dumps(error)}\n")
        else:
            voter["gps"] = {
                "latitude": stdout[0]["lat"],
                "longitude": stdout[0]["lon"]
            }
            with open("gps-voters.jsonl", "a") as _file:
                _file.write(f"{json.dumps(voter)}\n")

        if i % 250 == 0:
            logging.info(f"Converted {i} addresses")


if __name__ == "__main__":
    logging.getLogger().setLevel(logging.INFO)

    args = parser.parse_args()
    run(args)