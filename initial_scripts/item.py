# -*- coding: utf8 -*-
"""
@author xuruiqi
@date   20160608
@desc   初始化item记录
"""

from common import *

item_list = [
# 页面管理相关item
{
    #id 1
    "name": "页面管理-添加页面",
    "uniqkey": "pa-ap",
    "item_type": "form",
    "display": "添加页面",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "form": "add_page",
    }),
},
{
    #id 2
    "name": "页面管理-页面列表",
    "uniqkey": "pa-pl",
    "item_type": "page",
    "display": "页面列表",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "page": "page_admin",
    }),
},

# Header管理相关item
{
    #id 3
    "name": "Header管理-添加Header",
    "uniqkey": "ha-ah",
    "item_type": "form",
    "display": "添加Header",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "form": "add_header",
    }),
},
{
    #id 4
    "name": "Header管理-Header列表",
    "uniqkey": "ha-hl",
    "item_type": "page",
    "display": "Header列表",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "page": "header_admin",
    }),
},

# Lefter管理相关item
{
    #id 5
    "name": "Lefter管理-添加Lefter",
    "uniqkey": "la-al",
    "item_type": "form",
    "display": "添加Lefter",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "form": "add_lefter",
    }),
},
{
    #id 6
    "name": "Lefter管理-Lefter列表",
    "uniqkey": "la-ll",
    "item_type": "page",
    "display": "Lefter列表",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "page": "lefter_admin",
    }),
},

# Item管理相关item
{
    #id 7
    "name": "Item管理-添加Item",
    "uniqkey": "ia-ai",
    "item_type": "form",
    "display": "添加Item",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "form": "add_item",
    }),
},
{
    #id 8
    "name": "Item管理-Item列表",
    "uniqkey": "ia-il",
    "item_type": "page",
    "display": "Item列表",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "page": "item_admin",
    }),
},

# Form管理相关item
{
    #id 9
    "name": "Form管理-添加Form",
    "uniqkey": "fa-af",
    "item_type": "form",
    "display": "添加表单",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "form": "add_form",
    }),
},
{
    #id 10
    "name": "Form管理-Form列表",
    "uniqkey": "fa-fl",
    "item_type": "page",
    "display": "表单列表",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "page": "form_admin",
    }),
},

# Form Item管理相关item
{
    #id 11
    "name": "Form Input管理-添加Form Input",
    "uniqkey": "fia-afi",
    "item_type": "form",
    "display": "添加表单输入",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "form": "add_form_input",
    }),
},
{
    #id 12
    "name": "Form Input管理-Form Input列表",
    "uniqkey": "fia-fil",
    "item_type": "page",
    "display": "表单输入列表",
    "op_user": "xuruiqi",
    "detail": json.dumps({
        "page": "form_input_admin",
    }),
},
]

if __name__ == "__main__":
    for item in item_list:
        req = {
            "url": "http://%s/api/item/add_item" % HOST_N_PORT,
            "method": "POST",
            "data": item,
            "response_format": "json",
        }
        resp = http_request(req)
        print "%s:%s %r" % (resp["errno"], resp["errmsg"], resp["data"])
