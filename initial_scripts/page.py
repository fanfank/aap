# -*- coding: utf8 -*-
"""
@author xuruiqi
@date   20160608
@desc   初始化page记录
"""

from common import *

page_list = [
# 页面管理
{
    "title": "AAP-页面管理",
    "name": "页面管理",
    "page_type": 2,
    "urlmark": "page_admin",
    "components": json.dumps({
        "header": "amh",
        "lefter": "pal",
        "sub_header": "ash",
    }),
    "content": json.dumps({
        "type": "list",
        "api": "/api/page/get_page_list",
        "data_path": ["data", "page_list"],
        "page_info_path": ["data", "page_info"],
        "display_field_list": [
            {"display": "ID", "field": "id"},
            {"display": "页面名", "field": "name"},
            {"display": "title", "field": "title"},
            {"display": "组件", "field": "components"},
            {"display": "urlmark", "field": "urlmark"},
            {"display": "修改时间", "field": "mtime"},
            {"display": "操作人", "field": "op_user"},
        ],
        "operation_list": [
            {"type": "view", "api": "/api/page/get_page", "data_path": ["data"], "form": "add_page", "post_api": "/api/page/add_page"},
            {"type": "edit", "api": "/api/page/get_page", "data_path": ["data"], "form": "add_page", "post_api": "/api/page/modify_page"},
            {"type": "duplicate", "api": "/api/page/get_page", "data_path": ["data"], "form": "add_page", "post_api": "/api/page/add_page"},
            {"type": "delete", "api": "/api/page/delete_page", "data_path": ["data"], "form": "add_page"},
        ],
    }),
    "op_user": "xuruiqi",
},
# Header管理
{
    "title": "AAP-Header管理",
    "name": "Header管理",
    "urlmark": "header_admin",
    "page_type": 2,
    "components": json.dumps({
        "header": "amh",
        "lefter": "hal",
        "sub_header": "ash",
    }),
    "content": json.dumps({
        "type": "list",
        "api": "/api/header/get_header_list",
        "data_path": ["data", "header_list"],
        "page_info_path": ["data", "page_info"],
        "display_field_list": [
            {"display": "ID", "field": "id"},
            {"display": "Header名", "field": "name"},
            {"display": "组件", "field": "components"},
            {"display": "uniqkey", "field": "uniqkey"},
            {"display": "修改时间", "field": "mtime"},
            {"display": "操作人", "field": "op_user"},
        ],
        "operation_list": [
            {"type": "view", "api": "/api/header/get_header", "data_path": ["data"], "form": "add_header", "post_api": "/api/header/add_header"},
            {"type": "edit", "api": "/api/header/get_header", "data_path": ["data"], "form": "add_header", "post_api": "/api/header/modify_header"},
            {"type": "duplicate", "api": "/api/header/get_header", "data_path": ["data"], "form": "add_header", "post_api": "/api/header/add_header"},
            {"type": "delete", "api": "/api/header/delete_header"},
        ],
    }),
    "op_user": "xuruiqi",
},
# Lefter管理
{
    "title": "AAP-Lefter管理",
    "name": "Lefter管理",
    "urlmark": "lefter_admin",
    "page_type": 2,
    "components": json.dumps({
        "header": "amh",
        "lefter": "lal",
        "sub_header": "ash",
    }),
    "content": json.dumps({
        "type": "list",
        "api": "/api/lefter/get_lefter_list",
        "data_path": ["data", "lefter_list"],
        "page_info_path": ["data", "page_info"],
        "display_field_list": [
            {"display": "ID", "field": "id"},
            {"display": "Lefter名", "field": "name"},
            {"display": "组件", "field": "components"},
            {"display": "uniqkey", "field": "uniqkey"},
            {"display": "修改时间", "field": "mtime"},
            {"display": "操作人", "field": "op_user"},
        ],
        "operation_list": [
            {"type": "view", "api": "/api/lefter/get_lefter", "data_path": ["data"], "form": "add_lefter", "post_api": "/api/lefter/add_lefter"},
            {"type": "edit", "api": "/api/lefter/get_lefter", "data_path": ["data"], "form": "add_lefter", "post_api": "/api/lefter/modify_lefter"},
            {"type": "duplicate", "api": "/api/lefter/get_lefter", "data_path": ["data"], "form": "add_lefter", "post_api": "/api/lefter/add_lefter"},
            {"type": "delete", "api": "/api/lefter/delete_lefter"},
        ],
    }),
    "op_user": "xuruiqi",
},
# Item管理
{
    "title": "AAP-Item管理",
    "name": "Item管理",
    "urlmark": "item_admin",
    "page_type": 2,
    "components": json.dumps({
        "header": "amh",
        "lefter": "ial",
        "sub_header": "ash",
    }),
    "content": json.dumps({
        "type": "list",
        "api": "/api/item/get_item_list",
        "data_path": ["data", "item_list"],
        "page_info_path": ["data", "page_info"],
        "display_field_list": [
            {"display": "ID", "field": "id"},
            {"display": "Item名", "field": "name"},
            {"display": "跳转类型", "field": "item_type"},
            {"display": "详细配置", "field": "detail"},
            {"display": "uniqkey", "field": "uniqkey"},
            {"display": "修改时间", "field": "mtime"},
            {"display": "操作人", "field": "op_user"},
        ],
        "operation_list": [
            {"type": "view", "api": "/api/item/get_item", "data_path": ["data"], "form": "add_item", "post_api": "/api/item/add_item"},
            {"type": "edit", "api": "/api/item/get_item", "data_path": ["data"], "form": "add_item", "post_api": "/api/item/modify_item"},
            {"type": "duplicate", "api": "/api/item/get_item", "data_path": ["data"], "form": "add_item", "post_api": "/api/item/add_item"},
            {"type": "delete", "api": "/api/item/delete_item"},
        ],
    }),
    "op_user": "xuruiqi",
},
# Form管理
{
    "title": "AAP-表单管理",
    "name": "表单管理",
    "urlmark": "form_admin",
    "page_type": 2,
    "components": json.dumps({
        "header": "amh",
        "lefter": "fal",
        "sub_header": "ash",
    }),
    "content": json.dumps({
        "type": "list",
        "api": "/api/form/get_form_list",
        "data_path": ["data", "form_list"],
        "page_info_path": ["data", "page_info"],
        "display_field_list": [
            {"display": "ID", "field": "id"},
            {"display": "表单名", "field": "name"},
            {"display": "提交接口", "field": "post_api"},
            {"display": "组件", "field": "components"},
            {"display": "urlmark", "field": "urlmark"},
            {"display": "修改时间", "field": "mtime"},
            {"display": "操作人", "field": "op_user"},
        ],
        "operation_list": [
            {"type": "view", "api": "/api/form/get_form", "data_path": ["data"], "form": "add_form", "post_api": "/api/form/add_form"},
            {"type": "edit", "api": "/api/form/get_form", "data_path": ["data"], "form": "add_form", "post_api": "/api/form/modify_form"},
            {"type": "duplicate", "api": "/api/form/get_form", "data_path": ["data"], "form": "add_form", "post_api": "/api/form/add_form"},
            {"type": "delete", "api": "/api/form/delete_form"},
        ],
    }),
    "op_user": "xuruiqi",
},
# Form Input管理
{
    "title": "AAP-表单输入管理",
    "name": "表单输入管理",
    "urlmark": "form_input_admin",
    "page_type": 2,
    "components": json.dumps({
        "header": "amh",
        "lefter": "fial",
        "sub_header": "ash",
    }),
    "content": json.dumps({
        "type": "list",
        "api": "/api/form_input/get_form_input_list",
        "data_path": ["data", "form_input_list"],
        "page_info_path": ["data", "page_info"],
        "display_field_list": [
            {"display": "ID", "field": "id"},
            {"display": "表单输入名", "field": "name"},
            {"display": "展示名", "field": "display"},
            {"display": "接口字段名", "field": "pname"},
            {"display": "输入类型", "field": "form_input_type"},
            {"display": "uniqkey", "field": "uniqkey"},
            {"display": "修改时间", "field": "mtime"},
            {"display": "操作人", "field": "op_user"},
        ],
        "operation_list": [
            {"type": "view", "api": "/api/form_input/get_form_input", "data_path": ["data"], "form": "add_form_input", "post_api": "/api/form_input/add_form_input"},
            {"type": "edit", "api": "/api/form_input/get_form_input", "data_path": ["data"], "form": "add_form_input", "post_api": "/api/form_input/modify_form_input"},
            {"type": "duplicate", "api": "/api/form_input/get_form_input", "data_path": ["data"], "form": "add_form_input", "post_api": "/api/form_input/add_form_input"},
            {"type": "delete", "api": "/api/form_input/delete_form_input"},
        ],
    }),
    "op_user": "xuruiqi",
},
# Weibo OAuth
{
    "name": "oauth-微博授权成功",
    "title": "微博授权成功",
    "urlmark": "weibo-authorize",
    "components": "{}",
    "content": '{"type":"custom","class_name":"WeiboAuthorizeCallbackPage"}',
    "op_user": "xuruiqi",
    "ext": "",
},
{
    "name": "oauth-微博取消授权成功",
    "title": "微博取消授权成功",
    "urlmark": "weibo-unauthorize",
    "components": "{}",
    "content": '{"type":"custom","class_name":"WeiboUnauthorizeCallbackPage"}',
    "op_user": "xuruiqi",
    "ext": "",
},
]

if __name__ == "__main__":
    for page in page_list:
        req = {
            "url": "http://%s/api/page/add_page" % HOST_N_PORT,
            "method": "POST",
            "data": page,
            "response_format": "json",
        }
        resp = http_request(req)
        print "%s:%s:%r" % (resp["errno"], resp["errmsg"], resp["data"])
