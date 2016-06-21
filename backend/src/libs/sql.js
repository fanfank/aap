/**
 * @author  reetsee.com
 * @date    20160621
 */
var mysql = require('mysql');

// SQL schemes
// DELETE {OPTION1 OPTION2 .. OPTIONn}
//   FROM [TABLE]
//       WHERE conds1='1' AND conds2>'2' AND ... AND condsn<'n'
//           {ORDER BY field1 LIMIT 10};
// 
// INSERT {OPTION1 OPTION2 ... OPTIONn} 
//   INTO [TABLE] (col1, col2, ..., coln) VALUES ('1', '2', ..., 'n') 
//       {ON DUPLICATE KEY UPDATE col1='1', col2='2', ..., coln='n'};
// 
// SELECT {OPTION1 OPTION2 ... OPTIONn}
//   col1, col2, ..., coln
//       FROM [TABLE]
//           WHERE conds1='1' AND conds2>'2' AND ... AND condsn<'n'
//               {ORDER BY field1 LIMIT 10, 20};
// 
// UPDATE {OPTION1 OPTION2 .. OPTIONn}
//   [TABLE] SET field1='1', field2='2', ..., fieldn='n'
//       WHERE conds1='1' AND conds2>'2' AND ... AND condsn<'n'
//           {ORDER BY field1 LIMIT 10};

var SQL_PART_KEY     = 1;
var SQL_PART_VALUE   = 2;
var SQL_PART_COMBINE = 3;
var SQL_PART_SET     = 4;

exports.escapeString = function(val, forbidQualified) {
  if (Array.isArray(val)) {
    var sql = '';

    for (var i = 0; i < val.length; i++) {
      sql += (i === 0 ? '' : ', ') + SqlString.escapeId(val[i], forbidQualified);
    }

    return sql;
  }

  if (forbidQualified) {
    return '' + val.replace(/`/g, '``') + '';
  }

  return '' + val.replace(/`/g, '``').replace(/\./g, '`.`') + '';
}

exports.getSqlSelect = function(table, fields, conds, appends, options) {
    var sqlPartList = ['SELECT'];

    // options
    if (options) {
        var strOption = getSqlPart(options, SQL_PART_KEY);
        sqlPartList.push(strOption);
    }

    // columns
    var strCols = getSqlPart(fields, SQL_PART_KEY, ',');
    sqlPartList.push(strCols);

    // tables
    var strTables = getSqlPart(table, SQL_PART_KEY, ',');
    sqlPartList.push('FROM ' + strTables);

    // conds
    if (conds) {
        var strConds = getSqlPart(conds, SQL_PART_COMBINE, ' AND ');
        sqlPartList.push('WHERE ' + strConds);
    }

    // appends
    if (appends) {
        var strAppends = getSqlPart(appends);
        sqlPartList.push(strAppends);
    }

    return sqlPartList.join(' ');
};

exports.getSqlUpdate(table, fields, conds, appends, options) {
    var sqlPartList = ['UPDATE'];

    // options
    if (options) {
        var strOptions = getSqlPart(options, SQL_PART_KEY);
        sqlPartList.push(strOptions);
    }

    // tables
    var strTables = getSqlPart(table, SQL_PART_KEY, ',');
    sqlPartList.push(strTables + ' SET');

    // fields
    var strFields = getSqlPart(fields, SQL_PART_SET, ',');
    sqlPartList.push(strFields);

    // conds
    if (conds) {
        var strConds = getSqlPart(conds, SQL_PART_COMBINE, ' AND ');
        sqlPartList.push('WHERE ' + strConds);
    }

    // appends
    if (appends) {
        var strAppends = getSqlPart(appends);
        sqlPartList.push(strAppends);
    }

    return sqlPartList.join(' ');
};

exports.getSqlDelete(table, conds, appends, options) {
    var sqlPartList = ['DELETE'];

    // options
    if (options) {
        var strOptions = getSqlPart(options, SQL_PART_KEY);
        sqlPartList.push(strOptions);
    }

    // tables
    var strTables = getSqlPart(table, SQL_PART_KEY, ',');
    sqlPartList.push('FROM ' + strTables);

    // conds
    if (conds) {
        var strConds = getSqlPart(conds, SQL_PART_COMBINE, ' AND ');
        sqlPartList.push('WHERE ' + strConds);
    }

    // appends
    if (appends) {
        var strAppends = getSqlPart(appends);
        sqlPartList.push(strAppends);
    }

    return sqlPartList.join(' ');
};

exports.getSqlInsert = function(table, fields, dup, options) {
    var sqlPartList = ['INSERT'];

    // options
    if (options) {
        var strOptions = getSqlPart(options, SQL_PART_KEY);
        sqlPartList.push(strOptions);
    }

    // tables
    var strTables = getSqlPart(table, SQL_PART_KEY, ',');
    sqlPartList.push('INTO ' + strTables);

    // columns and values
    var strCols = getSqlPart(basic.keys(fields), SQL_PART_KEY, ',');
    var strValues = getSqlPart(basic.values(fields), SQL_PART_KEY, ',');
    sqlPartList.push('(' + strCols + ') VALUES (' + strValues + ')');

    // dup
    if (dup) {
        var strDup = getSqlPart(dup, SQL_PART_SET, ',');
        sqlPartList.push('ON DUPLICATE KEY UPDATE ' + strDup);
    }

    return sqlPartList.join(' ');
};

function getSqlPart(tuples, type, seperator) {
    type = type || SQL_PART_SET;
    seperator = seperator || ' ';

    if (!(typeof(tuples) == 'object' && !basic.isVoid(tuples))) {
        return tuples;
    }

    var sql = '';
    switch(type) {
    case SQL_PART_KEY:
        var escapedTuples = tuples.map(function(tuple) {
            return mysql.escapeId(tuple);
        });
        sql = escapedTuples.join(seperator);
        break;

    case SQL_PART_VALUE:
        var escapedTuples = tuples.map(function(tuple) {
            return mysql.escape(tuple);
        });
        sql = escapedTuples.join(seperator);
        break;

    case SQL_PART_COMBINE:
        var fatal = false;
        var escapedTuples = basic.keys(tuples).map(function(key) {
            var value = tuples[key];
            var part = escapeString(key) ;
            if (typeof(value) == 'string') {
                part += mysql.escape(value);
            } else if (Array.isArray(value)) {
                for (var i = 0; i < value.length; ++i) {
                    if (Array.isArray(value[i])) {
                        fatal = true;
                        return false; // NOTE:not function return
                    } else if (typeof(value[i]) == 'string') {
                        value[i] = mysql.escape(value[i]);
                    }
                }
                part += ' (' + value.join(',') + ')';
            } else {
                part += value;
            }
            return part;
        });
        if (fatal) {
            return false;
        }
        sql = escapedTuples.join(seperator);
        break;

    case SQL_PART_SET:
        var escapedTuples = basic.keys(tuples).map(function(key) {
            var value = tuples[key];
            var part = mysql.escapeId(key) + '=';
            if (typeof(value) == 'string') {
                value = mysql.escape(value);
            }
            part += value;
            return part;
        });
        sql = escapedTuples.join(seperator);
        break;
    
    default:
        return false;

    }

    return sql;
}
