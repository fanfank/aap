use `aapdb`;

create table `aap_page` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'page id',
    `name` varchar(256) NOT NULL COMMENT 'page record name',
    `title` varchar(64) NOT NULL DEFAULT 'Unknown Page' COMMENT 'title of the page',
    `urlmark` varchar(64) NOT NULL DEFAULT '' COMMENT 'what to display in page part in the url',
    `components` text NOT NULL COMMENT 'components of page, a json string',
    `content` text NOT NULL COMMENT 'content of page, a json string',
    `page_type` tinyint NOT NULL DEFAULT 1 COMMENT '1 for normal pages，2 for aap pages',
    `op_user` varchar(128) NOT NULL DEFAULT 'UNKNOWN_USER' COMMENT 'user that last modifies this record',
    `ctime` int(10) NOT NULL DEFAULT 0 COMMENT 'create timestamp',
    `mtime` int(10) NOT NULL DEFAULT 0 COMMENT 'last modify timestamp',
    `ext` varchar(1024) NOT NULL DEFAULT '' COMMENT 'for future use',
    PRIMARY KEY (`id`),
    INDEX `name` (`name`),
    INDEX `page_type` (`page_type`),
    INDEX `ctime` (`ctime`),
    INDEX `mtime` (`mtime`),
    INDEX `op_user` (`op_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'save page records';

create table `aap_header` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'header id',
    `name` varchar(256) NOT NULL COMMENT 'header record name',
    `components` text NOT NULL COMMENT 'header components, a json string',
    `op_user` varchar(128) NOT NULL DEFAULT 'UNKNOWN_USER' COMMENT 'user that last modifies this record',
    `ctime` int(10) NOT NULL DEFAULT 0 COMMENT 'create timestamp',
    `mtime` int(10) NOT NULL DEFAULT 0 COMMENT 'last modify timestamp',
    `ext` varchar(1024) NOT NULL DEFAULT '' COMMENT 'for future use',
    PRIMARY KEY (`id`),
    INDEX `name` (`name`),
    INDEX `ctime` (`ctime`),
    INDEX `mtime` (`mtime`),
    INDEX `op_user` (`op_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'save header records';

create table `aap_lefter` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'lefter id',
    `name` varchar(256) NOT NULL COMMENT 'lefter record name',
    `components` text NOT NULL COMMENT 'lefter components, a json string',
    `op_user` varchar(128) NOT NULL DEFAULT 'UNKNOWN_USER' COMMENT 'user the last modifies this record',
    `ctime` int(10) NOT NULL DEFAULT 0 COMMENT 'create timestamp',
    `mtime` int(10) NOT NULL DEFAULT 0 COMMENT 'last modify timestamp',
    `ext` varchar(1024) NOT NULL DEFAULT '' COMMENT 'for future use',
    PRIMARY KEY (`id`),
    INDEX `name` (`name`),
    INDEX `op_user` (`op_user`),
    INDEX `ctime` (`ctime`),
    INDEX `mtime` (`mtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'save lefter records';

create table `aap_item` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'item id',
    `name` varchar(256) NOT NULL COMMENT 'item record name',
    `item_type` varchar(32) NOT NULL COMMENT 'page for jumping to an aap page, form for opening a form, hyperlink for jumping to an external page',
    `display` varchar(512) NOT NULL COMMENT 'the display content of this item',
    `icon` varchar(4096) NOT NULL COMMENT 'icon type, see: http://ant.design/components/icon',
    `detail` text NOT NULL COMMENT 'the detail configuration of this item, a json string',
    `op_user` varchar(128) NOT NULL DEFAULT 'UNKNOWN_USER' COMMENT 'user that last modifies this record',
    `ctime` int(10) NOT NULL DEFAULT 0 COMMENT 'create timestamp',
    `mtime` int(10) NOT NULL DEFAULT 0 COMMENT 'last modifies timestamp',
    `ext` varchar(1024) NOT NULL DEFAULT '' COMMENT 'for future use',
    PRIMARY KEY (`id`),
    INDEX `name` (`name`),
    INDEX `item_type` (`item_type`),
    INDEX `ctime` (`ctime`),
    INDEX `mtime` (`mtime`),
    INDEX `op_user` (`op_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'save item records';

create table `aap_form` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'form id',
    `name` varchar(256) NOT NULL COMMENT 'form record name',
    `post_api` varchar(4096) NOT NULL COMMENT 'which url to post to when the form submits',
    `content_type` varchar(1024) NOT NULL DEFAULT 'application/x-www-form-urlencoded;charset=utf-8' COMMENT 'content type of the post data',
    `components` text NOT NULL COMMENT 'form components, a json string',
    `op_user` varchar(128) NOT NULL DEFAULT 'UNKNOWN_USER' COMMENT 'user that last modifies this record',
    `ctime` int(10) NOT NULL DEFAULT 0 COMMENT 'create timestamp',
    `mtime` int(10) NOT NULL DEFAULT 0 COMMENT 'last modify timestamp',
    `ext` varchar(1024) NOT NULL DEFAULT '' COMMENT 'for future use',
    PRIMARY KEY (`id`),
    INDEX `name` (`name`),
    INDEX `ctime` (`ctime`),
    INDEX `mtime` (`mtime`),
    INDEX `op_user` (`op_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'save form records';

create table `aap_form_input` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'form input id',
    `name` varchar(256) NOT NULL COMMENT 'form input name',
    `display` varchar(512) NOT NULL COMMENT 'the label of this input',
    `pname` varchar(128) NOT NULL COMMENT 'the parameter name of the input',
    `help_message` varchar(4096) NOT NULL DEFAULT '' COMMENT 'help message of the input',
    `assignedAttrs` text NOT NULL COMMENT 'additional attributes assigned by the user, a json string',
    `form_input_type` varchar(64) NOT NULL COMMENT 'type of the input',
    `detail` text NOT NULL COMMENT 'the detail configuration of this input, a json string',
    `op_user` varchar(128) NOT NULL DEFAULT 'UNKNOWN_USER' COMMENT 'user that last modifies this form input',
    `ctime` int(10) NOT NULL DEFAULT 0 COMMENT 'create timestamp',
    `mtime` int(10) NOT NULL DEFAULT 0 COMMENT 'last modify timestamp',
    `ext` varchar(1024) NOT NULL DEFAULT '' COMMENT 'for future use',
    PRIMARY KEY (`id`),
    INDEX `name` (`name`),
    INDEX `form_input_type` (`form_input_type`),
    INDEX `pname` (`pname`),
    INDEX `ctime` (`ctime`),
    INDEX `mtime` (`mtime`),
    INDEX `op_user` (`op_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'save form input records';
