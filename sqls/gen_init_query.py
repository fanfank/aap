# coding: utf8
# @author   reetsee.com
# @date     20160702
# @desc     generate initial table queries for programs

f = open("./source", "r")
lines = []
while True:
    line = f.readline()
    if not line:
        break
    lines.append(line)
f.close()

tables = ["aap_page", "aap_header", "aap_lefter", "aap_item", "aap_form", "aap_form_input"]
query_dict = {}
try:
    for index, table in enumerate(tables):
        create_line = lines[index*2]
        insert_line = lines[index*2+1]

        current_table = "`%s`" % table
        create_tokens = create_line.split(" ", 4)
        insert_tokens = insert_line.split(" ", 4)
        if create_tokens[0] != 'CREATE' or create_tokens[2] != current_table:
            raise Exception(
                "Table to be created should be %s, but table %s with operation '%s' found" % (
                    current_table, create_tokens[2], create_tokens[0]
                )
            )
        elif insert_tokens[0] != 'INSERT' or insert_tokens[2] != current_table:
            raise Exception(
                "Table to insert should be %s, but table %s with operation '%s' found" % (
                    current_table, insert_tokens[2], insert_tokens[0]
                )
            )

        query_dict[table] = {
            "create": create_line,
            "insert": insert_line,
        }

except:
    import logging
    logging.exception("Generate init_query.json failed")
    exit(255)

import json
f = open("./init_query.json", "w")
json.dump(query_dict, f)
f.close()
