# -*- coding: utf8 -*-
"""
@author xuruiqi
@date   20160608
@desc   初始化form input记录
"""

from common import *

form_input_list = [
# 公用匿名组件
{
    #"id": 1,
    "uniqkey": "a-s",
    "display": "",
    "pname": "",
    "name": "字符串",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #"id": 2,
    "uniqkey": "a-n",
    "display": "",
    "pname": "",
    "name": "数字",
    "form_input_type": "number",
    "op_user": "xuruiqi",
},
{
    #"id": 3,
    "uniqkey": "a-d",
    "display": "",
    "pname": "",
    "name": "时间日期",
    "form_input_type": "datetime",
    "detail": json.dumps({
        "format": "yyyy-MM-dd HH:mm:ss",
    }),
    "op_user": "xuruiqi",
},
{
    #"id": 4,
    "uniqkey": "a-ta",
    "display": "",
    "pname": "",
    "name": "多行输入",
    "form_input_type": "textarea",
    "op_user": "xuruiqi",
},
# 常用有名组件
{
    #"id": 5,
    "uniqkey": "n-n",
    "display": "ID",
    "pname": "id",
    "name": "ID",
    "form_input_type": "number",
    "assignedAttrs": json.dumps({
        "disabled": True,
    }),
    "op_user": "xuruiqi",
},
{
    #"id": 6,
    "uniqkey": "n-ext",
    "display": "扩展字段",
    "pname": "ext",
    "name": "扩展字段",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #"id": 7,
    "uniqkey": "n-dapi",
    "display": "数据接口api",
    "pname": "api",
    "name": "数据接口api",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
# page相关组件
{
    #"id": 8,
    "uniqkey": "p-name",
    "display": "页面名称",
    "pname": "name",
    "name": "页面名称",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #"id": 9,
    "uniqkey": "p-title",
    "display": "页面标题",
    "pname": "title",
    "name": "页面标题",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #"id": 10,
    "uniqkey": "p-comp",
    "display": "页面组件",
    "pname": "components",
    "name": "页面组件",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "header": "selh",
            "lefter": "sell",
            "sub_header": "selh",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #"id": 11,
    "uniqkey": "selh",
    "display": "Header选择",
    "pname": "header",
    "name": "Header选择",
    "form_input_type": "select",
    "detail": json.dumps({
        "type": "api",
        "multi": False,
        "api": "/api/header/get_header_suggest_list",
        "data_path": ["data", "suggest_list"],
        "display_path": ["display"],
        "value_path": ["value"],
    }),
    "op_user": "xuruiqi",
},
{
    #"id": 12,
    "uniqkey": "sell",
    "display": "Lefter选择",
    "pname": "lefter",
    "name": "Lefter选择",
    "form_input_type": "select",
    "detail": json.dumps({
        "type": "api",
        "multi": False,
        "api": "/api/lefter/get_lefter_suggest_list",
        "data_path": ["data", "suggest_list"],
        "display_path": ["display"],
        "value_path": ["value"],
    }),
    "op_user": "xuruiqi",
},
{
    #"id": 13,
    "uniqkey": "p-ct",
    "display": "页面内容",
    "pname": "content",
    "name": "页面内容",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "type": "p-pt",
            "constants": "p-const",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #"id": 14,
    "uniqkey": "p-isa",
    "display": "是否后台页面",
    "pname": "type",
    "form_input_type": "select",
    "name": "后台页面select",
    "default": 0,
    "detail": json.dumps({
        "type": "raw",
        "multi": False,
        "option_list": [
            {
                "display": "否",
                "value": 1,
            },
            {
                "display": "是",
                "value": 2,
            },
        ],
    }),
    "op_user": "xuruiqi",
},
{
    #id: 15,
    "uniqkey": "p-dpath",
    "display": "参数路径",
    "pname": "data_path",
    "name": "参数路径",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "a-s",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 16,
    "uniqkey": "p-pif",
    "display": "翻页信息路径",
    "pname": "page_info_path",
    "name": "Page翻页信息路径",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "a-s",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 17,
    "uniqkey": "p-dfcl",
    "display": "每列内容",
    "pname": "display_field_list",
    "name": "Page每列内容",
    "form_input_type": "mutabledict",
    "detail": json.dumps({
        "key_sub_input": "p-cname",
        "value_sub_input": "p-cfield",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 18,
    "uniqkey": "p-cname",
    "display": "列名称",
    "pname": "",
    "name": "列名称",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #id: 19,
    "uniqkey": "p-cfield",
    "display": "对应元素中的字段",
    "pname": "",
    "name": "对应元素中的字段",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #id: 20,
    "uniqkey": "p-opl",
    "display": "每列操作",
    "pname": "operation_list",
    "name": "每列操作",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "p-colop",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 21,
    "uniqkey": "p-colop",
    "display": "列操作",
    "pname": "",
    "name": "列操作",
    "form_input_type": "relation",
    "detail": json.dumps({
        "type": "raw",
        "relation_list": [
            {
                "display": "查看",
                "value": "view",
                "form_input": ["n-dapi", "p-dpath", "p-fsel"],
            },
            {
                "display": "编辑",
                "value": "edit",
                "form_input": ["n-dapi", "p-dpath", "p-fsel"],
            },
            {
                "display": "复制",
                "value": "duplicate",
                "form_input": ["n-dapi", "p-dpath", "p-fsel"],
            },
            {
                "display": "删除",
                "value": "delete",
                "form_input": ["n-dapi"],
            },
        ],
    }),
    "op_user": "xuruiqi",
},
{
    #id: 22,
    "uniqkey": "p-fsel",
    "display": "表单选择",
    "pname": "form",
    "name": "表单选择",
    "form_input_type": "select",
    "detail": json.dumps({
        "type": "api",
        "multi": False,
        "api": "/api/form/get_form_suggest_list",
        "data_path": ["data", "suggest_list"],
        "display_path": ["display"],
        "value_path": ["value"],
    }),
    "op_user": "xuruiqi",
},
{
    #id: 23,
    "uniqkey": "n-opu",
    "display": "操作人",
    "pname": "op_user",
    "name": "操作人",
    "form_input_type": "string",
    "assignedAttrs": json.dumps({
        "disabled": True,
    }),
    "op_user": "xuruiqi",
},
## page相关组件结束
# Header相关组件
{
    #"id": 24,
    "uniqkey": "h-name",
    "display": "Header名称",
    "pname": "name",
    "name": "Header名称",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #"id": 25,
    "uniqkey": "h-comp",
    "display": "Header组件",
    "pname": "components",
    "name": "Header组件",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "item": "h-ilist",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #"id": 26
    "uniqkey": "h-ilist",
    "display": "Item列表",
    "pname": "item",
    "name": "Item列表",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "h-isel",
    }),
    "op_user": "xuruiqi",
},
{
    #id: "h-isel"
    "uniqkey": "h-isel",
    "display": "",
    "pname": "item",
    "name": "Item选择",
    "form_input_type": "select",
    "detail": json.dumps({
        "type": "api",
        "multi": False,
        "api": "/api/item/get_item_suggest_list",
        "data_path": ["data", "suggest_list"],
        "display_path": ["display"],
        "value_path": ["value"],
    }),
    "op_user": "xuruiqi",
},
## Header相关组件结束
# Lefter相关组件
{
    #id: 28
    "uniqkey": "l-name",
    "display": "Lefter名称",
    "pname": "name",
    "name": "Lefter名称",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #"id": 29,
    "uniqkey": "l-comp",
    "display": "Lefter组件",
    "pname": "components",
    "name": "Lefter组件",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "item": "h-ilist",
        },
    }),
    "op_user": "xuruiqi",
},
## Lefter相关组件结束
# Form相关组件
{
    #id: 30
    "uniqkey": "f-name",
    "display": "表单名称",
    "pname": "name",
    "name": "表单名称",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #id: 31
    "uniqkey": "f-papi",
    "display": "表单提交接口",
    "pname": "post_api",
    "name": "表单提交接口",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #id: 32
    "uniqkey": "f-comp",
    "display": "表单组件",
    "pname": "components",
    "name": "表单组件",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "form_input": "f-fil",
        }
    }),
    "op_user": "xuruiqi",
},
{
    #"id": 33
    "uniqkey": "f-fil",
    "display": "表单输入列表",
    "pname": "form_input",
    "name": "表单输入列表",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "f-fisel",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 34
    "uniqkey": "f-fisel",
    "display": "",
    "pname": "form_input",
    "name": "表单输入选择",
    "form_input_type": "select",
    "detail": json.dumps({
        "type": "api",
        "multi": False,
        "api": "/api/form_input/get_form_input_suggest_list",
        "data_path": ["data", "suggest_list"],
        "display_path": ["display"],
        "value_path": ["value"],
    }),
    "op_user": "xuruiqi",
},
## Form相关组件结束
# Item相关组件
{
    #id: 35
    "uniqkey": "i-name",
    "display": "Item名称",
    "pname": "name",
    "name": "Item名称",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #id: 36
    "uniqkey": "i-jtype",
    "display": "Item跳转类型",
    "pname": "item_type",
    "name": "Item跳转类型",
    "form_input_type": "relation",
    "detail": json.dumps({
        "type": "raw",
        "relation_list": [
            {
                "display": "页面",
                "value": "page",
                "form_input": ["i-jtpage"],
            },
            {
                "display": "表单",
                "value": "form",
                "form_input": ["i-jtform"],
            },
            {
                "display": "超链接",
                "value": "hyperlink",
                "form_input": ["i-jdetail"],
            }
        ],
    }),
    "op_user": "xuruiqi",
},
{
    #id: 37
    "uniqkey": "i-jtpage",
    "display": "跳转到页面",
    "pname": "detail",
    "name": "跳转到页面",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "page": "i-psel",
            "preserve_url_parameters": "i-pup",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #id: 38
    "uniqkey": "i-jtform",
    "display": "打开表单",
    "pname": "detail",
    "name": "打开表单",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "form": "p-fsel",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #id: 39
    "uniqkey": "i-psel",
    "display": "页面选择",
    "pname": "page",
    "name": "页面选择",
    "form_input_type": "select",
    "detail": json.dumps({
        "type": "api",
        "multi": False,
        "api": "/api/page/get_page_suggest_list",
        "data_path": ["data", "suggest_list"],
        "display_path": ["display"],
        "value_path": ["value"],
    }),
    "op_user": "xuruiqi",
},
## Item相关组件结束
# Form Item相关组件
{
    #id: 40
    "uniqkey": "fi-name",
    "display": "名称",
    "pname": "name",
    "name": "FormInput名称",
    "form_input_type": "string",
    "assignedAttrs": json.dumps({
        "required": True,
    }),
    "op_user": "xuruiqi",
},
{
    #id: 41
    "uniqkey": "fi-disp",
    "display": "展示内容",
    "pname": "display",
    "name": "展示内容",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #id: 42
    "uniqkey": "fi-default",
    "display": "默认值",
    "pname": "default",
    "name": "FormInput默认值",
    "form_input_type": "textarea",
    "op_user": "xuruiqi",
},
{
    #id: 43
    "uniqkey": "fi-pkey",
    "display": "提交参数Key",
    "pname": "pname",
    "name": "FormInput提交参数Key",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #id: 44
    "uniqkey": "fi-itype",
    "display": "输入类型",
    "pname": "form_input_type",
    "name": "FormInput输入类型",
    "form_input_type": "relation",
    "detail": json.dumps({
        "type": "raw",
        "relation_list": [
            {
                "display": "字符串",
                "value": "string",
                "form_input": [],
            },
            {
                "display": "数字",
                "value": "number",
                "form_input": [],
            },
            {
                "display": "日期时间",
                "value": "datetime",
                "form_input": ["fi-ddetail"],
            },
            {
                "display": "多行字符串",
                "value": "textarea",
                "form_input": [],
            },
            {
                "display": "下拉框",
                "value": "select",
                "form_input": ["dddetail"],
            },
            {
                "display": "json",
                "value": "json",
                "form_input": ["jfmt"],
            },
            {
                "display": "可增删的列表",
                "value": "mutablelist",
                "form_input": ["fi-ml"],
            },
            {
                "display": "可增删的字典",
                "value": "mutabledict",
                "form_input": ["fi-md"],
            },
            {
                "display": "关联选择",
                "value": "relation",
                "form_input": ["fi-rs"],
            },
        ],
    }),
    "op_user": "xuruiqi",
},
{
    #id: 45
    "uniqkey": "fi-rhattrs",
    "display": "原生HTML属性",
    "pname": "assignedAttrs",
    "name": "FormInput额外HTML属性",
    "form_input_type": "mutabledict",
    "detail": json.dumps({
        "key_sub_input": "a-s",
        "value_sub_input": "a-s",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 46
    "uniqkey": "fi-urlmark",
    "display": "url路径标识",
    "pname": "urlmark",
    "form_input_type": "string",
    "name": "页面url标识",
    "op_user": "xuruiqi",
},
{
    #id: 47
    "uniqkey": "fi-ddetail",
    "display": "日期详细配置",
    "pname": "detail",
    "name": "FormInput日期详细信息",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "format": "dfmt",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #id: 48
    "uniqkey": "dfmt",
    "display": "",
    "pname": "",
    "name": "日期时间格式",
    "form_input_type": "string",
    "default": "yyyy-MM-dd HH:mm:ss",
    "op_user": "xuruiqi",
},
{
    #id: 49
    "uniqkey": "dddetail",
    "display": "下拉框详细配置",
    "pname": "detail",
    "name": "FormInput下拉框详细配置",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "type": "seltype",
            "multi": "allowms",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #id: 50
    "uniqkey": "jfmt",
    "display": "json格式配置",
    "pname": "detail",
    "name": "FormInput json格式配置",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "structure": "scmd",
        }
    }),
    "op_user": "xuruiqi",
},
{
    #id: 51
    "uniqkey": "fi-ml",
    "display": "可增删列表配置",
    "pname": "detail",
    "name": "FormInput可增删列表配置",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "sub_input": "f-fisel",
        }
    }),
    "op_user": "xuruiqi",
},
{
    #id: 52
    "uniqkey": "fi-md",
    "display": "可增删字典配置",
    "pname": "detail",
    "name": "FormInput可增删字典配置",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "key_sub_input": "f-fisel",
            "value_sub_input": "f-fisel",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #id: 53
    "uniqkey": "fi-rs",
    "display": "关联选择",
    "pname": "detail",
    "name": "FormInput关联选择配置",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "type": "reltyperaw",
        }
    }),
    "op_user": "xuruiqi",
},
{
    #id: 54
    "uniqkey": "seltype",
    "display": "select类型",
    "pname": "type",
    "name": "select类型",
    "form_input_type": "relation",
    "detail": json.dumps({
        "type": "raw",
        "relation_list": [
            {
                "display": "手动指定",
                "value": "raw",
                "form_input": ["selol"],
            },
            {
                "display": "api指定",
                "value": "api",
                "form_input": ["n-dapi", "p-dpath", "seldpath", "selfpath"],
            },
        ],
    }),
    "op_user": "xuruiqi",
},
{
    #id: 55
    "uniqkey": "allowms",
    "display": "允许多选",
    "pname": "multi",
    "name": "允许多选",
    "default": "false",
    "form_input_type": "select",
    "detail": json.dumps({
        "type": "raw",
        "option_list": [
            {
                "display": "允许多选",
                "value": "true",
            },
            {
                "display": "不允许多选",
                "value": "false",
            },
        ],
    }),
    "op_user": "xuruiqi",
},
{
    #id: 56
    "uniqkey": "selol",
    "display": "选项列表",
    "pname": "option_list",
    "name": "select选项列表",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "selo",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 57
    "uniqkey": "selo",
    "display": "选项",
    "pname": "option",
    "name": "select单个选项",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "display": "a-s",
            "value": "a-s",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #id: 58,
    "uniqkey": "seldpath",
    "display": "select展示内容路径",
    "pname": "display_path",
    "name": "select展示内容路径",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "a-s",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 59,
    "uniqkey": "selfpath",
    "display": "select值路径",
    "pname": "value_path",
    "name": "select值路径",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "a-s",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 60,
    "uniqkey": "scmd",
    "display": "",
    "pname": "",
    "name": "自包含的字典",
    "form_input_type": "mutabledict",
    "detail": json.dumps({
        "key_sub_input": "a-s",
        "value_sub_input": "f-fisel",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 61,
    "uniqkey": "reltyperaw",
    "display": "relation类型",
    "pname": "type",
    "name": "relation类型raw",
    "form_input_type": "relation",
    "detail": json.dumps({
        "type": "raw",
        "relation_list": [
            {
                "display": "手动指定",
                "value": "raw",
                "form_input": ["rell"],
            },
            {
                "display": "api（未实现）",
                "value": "api",
                "form_input": [],
            },
        ],
    }),
    "op_user": "xuruiqi",
},
{
    #id: 62,
    "uniqkey": "rell",
    "display": "relation列表",
    "pname": "relation_list",
    "name": "relation列表",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "relle",
    }),
    "op_user": "xuruiqi",
},
{
    #id: 63,
    "uniqkey": "relle",
    "display": "",
    "pname": "",
    "name": "relation列表元素",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "display": "a-s",
            "value": "a-s",
            #"form_input": "f-fisel",
            "form_input": "f-dispfi",
        }
    }),
    "op_user": "xuruiqi",
},
## Form Input相关组件结束
{
    #id 64,
    "uniqkey": "p-pt",
    "display": "展示类型",
    "pname": "page_type",
    "name": "页面展示类型",
    "form_input_type": "relation",
    "detail": json.dumps({
        "type": "raw",
        "relation_list": [
            {
                "display": "列表",
                "value": "list",
                "form_input": ["n-dapi", "p-dpath", "p-pif", "p-dfl", "p-oo"],
            },
            {
                "display": "自定义",
                "value": "custom",
                "form_input": ["p-classname"],
            },
        ],
    }),
    "op_user": "xuruiqi",
},
{
    #id 65
    "uniqkey": "p-dfl",
    "display": "列与字段对应关系",
    "pname": "display_field_list",
    "name": "列与字段对应关系",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "p-df",
    }),
    "op_user": "xuruiqi",
},
{
    #id 66
    "uniqkey": "p-oo",
    "display": "列表操作选项",
    "pname": "operation_list",
    "name": "列表操作选项",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "p-ol",
    }),
    "op_user": "xuruiqi", 
},
{
    #id 67
    "uniqkey": "p-df",
    "display": "展示列",
    "pname": "display_field",
    "name": "展示列",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "display": "",
            "field": "",
        }
    }),
    "op_user": "xuruiqi", 
},
{
    #id 68
    "uniqkey": "p-ol",
    "display": "操作列表",
    "pname": "opertion_list",
    "name": "页面操作列表",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "type": "p-relo",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #id 69
    "uniqkey": "p-relo",
    "display": "操作项",
    "pname": "operation",
    "name": "操作项",
    "form_input_type": "relation",
    "detail": json.dumps({
        "type": "raw",
        "relation_list": [
            {
                "display": "查看",
                "value": "view",
                "form_input": ["n-dapi", "p-dpath", "p-fsel", "f-papi"],
            },
            {
                "display": "修改",
                "value": "edit",
                "form_input": ["n-dapi", "p-dpath", "p-fsel", "f-papi"],
            },
            {
                "display": "复制",
                "value": "duplicate",
                "form_input": ["n-dapi", "p-dpath", "p-fsel", "f-papi"],
            },
            {
                "display": "删除",
                "value": "delete",
                "form_input": ["n-dapi"],
            },
        ],
    }),
    "op_user": "xuruiqi", 
},
{
    #id 70
    "uniqkey": "f-dispfi",
    "display": "展示以下输入",
    "pname": "form_input",
    "name": "展示输入列表",
    "form_input_type": "mutablelist",
    "detail": json.dumps({
        "sub_input": "f-fisel",
    }),
    "op_user": "xuruiqi", 
},
{
    #id 71
    "uniqkey": "p-classname",
    "display": "类名",
    "help_message": "请确保类已经注册到app/custom/init.jsx文件中",
    "pname": "class_name",
    "name": "类名",
    "form_input_type": "string",
    "op_user": "xuruiqi", 
},
{
    #id 72
    "uniqkey": "i-jdetail",
    "display": "跳转设置",
    "pname": "detail",
    "name": "Item跳转地址",
    "form_input_type": "json",
    "detail": json.dumps({
        "structure": {
            "href": "i-jhref",
            "target": "i-jtarget",
        },
    }),
    "op_user": "xuruiqi",
},
{
    #id 73
    "uniqkey": "i-jhref",
    "display": "跳转地址",
    "pname": "href",
    "name": "跳转地址",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #id 74
    "uniqkey": "i-jtarget",
    "display": "打开方式",
    "pname": "target",
    "name": "链接target属性",
    "default": "_blank",
    "form_input_type": "select",
    "detail": json.dumps({
        "type": "raw",
        "option_list": [
            {
                "display": "新页面打开",
                "value": "_blank",
            },
            {
                "display": "本页面打开",
                "value": "_self",
            },
        ],
    }),
    "op_user": "xuruiqi",
},
{
    #id 75
    "uniqkey": "fi-help",
    "display": "帮助信息",
    "pname": "help_message",
    "name": "帮助信息",
    "form_input_type": "string",
    "assignedAttrs": json.dumps({
        "placeholder": "选填，用于对用户进行输入提示",
    }),
    "op_user": "xuruiqi",
},
{
    #id 76
    "uniqkey": "i-itype",
    "display": "图标类型",
    "pname": "icon",
    "help_message": "详见：http://ant.design/components/icon",
    "name": "图标",
    "form_input_type": "string",
    "assignedAttrs": json.dumps({
        "placeholder": "选填，填写图标的type即可",
    }),
    "op_user": "xuruiqi",
},
{
    #id 77
    "uniqkey": "f-submittype",
    "display": "提交类型",
    "pname": "content_type",
    "name": "表单提交类型",
    "form_input_type": "select",
    "detail": json.dumps({
        "type": "raw",
        "option_list": [
            {
                "display": "application/x-www-form-urlencoded;charset=utf-8",
                "value": "application/x-www-form-urlencoded;charset=utf-8",
            },
            {
                "display": "application/json;charset=utf-8",
                "value": "application/json;charset=utf-8",
            },
        ],
    }),
    "op_user": "xuruiqi",
},
{
    #id 78
    "uniqkey": "p-const",
    "display": "页面常量",
    "pname": "constants",
    "name": "页面常量",
    "form_input_type": "mutabledict",
    "detail": json.dumps({
        "key_sub_input": "a-s",
        "value_sub_input": "a-s",
    }),
    "op_user": "xuruiqi",
},
{
    #id 79
    "uniqkey": "fi-uniqkey",
    "display": "uniqkey",
    "name": "uniqkey",
    "pname": "uniqkey",
    "help_message": "唯一标识",
    "form_input_type": "string",
    "op_user": "xuruiqi",
},
{
    #id 80
    "uniqkey": "i-pup",
    "display": "保留URL参数",
    "name": "保留URL参数",
    "pname": "preserve_url_parameters",
    "help_message": "如果选是则跳转后的URL参数与跳转前一致，否则清空",
    "default": "no",
    "form_input_type": "select",
    "detail": json.dumps({
        "type": "raw",
        "option_list": [
            {
                "display": "是",
                "value": "yes",
            },
            {
                "display": "否",
                "value": "no",
            },
        ],
    }),
}
]

if __name__ == "__main__":
    for form_input in form_input_list:
        req = {
            "url": "http://%s/api/form_input/add_form_input" % HOST_N_PORT,
            "method": "POST",
            "data": form_input,
            "response_format": "json",
        }
        resp = http_request(req)
        print "%s:%s:%r" % (resp["errno"], resp["errmsg"], resp["data"])
