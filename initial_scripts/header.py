# -*- coding: utf8 -*-
"""
@author xuruiqi
@date   20160611
@desc   初始化header记录
"""

from common import *

header_list = [
{
    "name": "后台主Header",
    "uniqkey": "amh",
    "components": json.dumps({
        "item": ["pa-pl", "ha-hl", "la-ll", "ia-il", "fa-fl", "fia-fil"],
    }),
    "op_user": "xuruiqi",
},
{
    "name": "后台二级Header",
    "uniqkey": "ash",
    "components": json.dumps({}),
    "op_user": "xuruiqi",
},
]

if __name__ == "__main__":
    for header in header_list:
        req = {
            "url": "http://%s/api/header/add_header" % HOST_N_PORT,
            "method": "POST",
            "data": header,
            "response_format": "json",
        }
        resp = http_request(req)
        print "%s:%s:%r" % (resp["errno"], resp["errmsg"], resp["data"])
