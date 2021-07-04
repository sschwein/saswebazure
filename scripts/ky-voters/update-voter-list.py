import json
from utils import trim_address


def nominatim_address_string(addr):
    trimmed_address = trim_address(addr["street_address"])
    return f'{trimmed_address}; {addr["state"]}, {addr["zip"][:5]}'


def address_string(addr):
    return f'{addr["street_address"]}; {addr["residence"]["city_address"]}, {addr["residence"]["state"]} {addr["residence"]["zip"][:5]}'


def update_voter(voter):
    for row in voter["voting_history"]:
        row.update({
            "primary_code": int(row["primary"]),
            "general_code": int(row["general"])
        })

    voter.update({
        "residence_string": address_string(voter["residence"]),
        "mailing_string": address_string(voter["mailing"]),
        "voting_history": voter["voting_history"],
        # ADD ESTIMATED AGE COLUMN
    })

    return voter


def filter_for_gps(item, voter):
    return (
        item["residence"] == voter["residence"] and
        item["first_name"] == voter["first_name"] and
        item["middle_name"] == voter["middle_name"] and
        item["last_name"] == voter["last_name"] and
        item["date_of_registration"] == voter["date_of_registration"]
    )


def join_gps_coords(voters, gps):
    for voter in voters:
        coords = list(filter(lambda _: filter_for_gps(_, voter), gps))
        if len(coords) > 1:
            print(f'found gps conflict {json.dumps(voter, indent=4)}; {json.dumps(coords, indent=4)}')
            break
        else:
            voter.update({"gps": coords["gps"]})

    return voters


if __name__ == "__main__":
    with open('voter-list-full.jsonl', 'r') as _file:
        voters = [update_voter(json.loads(row)) for row in _file.readlines()]

    with open('gps-voters.jsonl', 'r') as _file:
        gps = [json.loads(row) for row in _file.readlines()]

    voters = join_gps_coords(voters, gps)

    print(json.dumps(voters[0], indent=4))
