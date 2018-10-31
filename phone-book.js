'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {};

function isString(field) {
    return typeof field === 'string';
}

function isCorrectedPhone(phone) {
    if (isString(phone) && /^[0-9]{10}$/.test(phone)) {
        return true;
    }

    return false;
}

function isCorrectedName(name) {
    return isString(name) && name !== '';
}

function isUndefined(field) {
    return typeof field === 'undefined';
}

// Собираем нужный формат номера из полного номера
function getPhone(fullPhone) {
    return fullPhone.substring(4, 7) + fullPhone.substring(9, 12) +
    fullPhone.substring(13, 15) + fullPhone.substring(16, 19);
}

function getNeedFormat(records, phone) {
    return records[phone].name + ', +7 (' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) +
    '-' + phone.substring(6, 8) + '-' + phone.substring(8, 10);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

let incorrectedData = (name, phone) => {
    return !isCorrectedName(name) || !isCorrectedPhone(phone) || isUndefined(name);
};

function add(phone, name, email) {
    if (incorrectedData(name, phone) || !isUndefined(phoneBook[phone])) {
        return false;
    }
    email = email || '';
    phoneBook[phone] = {
        name: name,
        email: email
    };

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (incorrectedData(name, phone) || isUndefined(phoneBook[phone])) {
        return false;
    }
    email = email || '';
    phoneBook[phone] = {
        name: name,
        email: email
    };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let removable = find(query);
    for (let record of removable) {
        let str = record.split(', ');
        let phone = getPhone(str[1]);
        delete phoneBook[phone];
    }

    return removable.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function find(query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        return getFormattedRecors(phoneBook);
    }
    let bookRecords = [];
    bookRecords = getRecordsByQuery(query);

    return getFormattedRecors(bookRecords);
}

//  Проверка на существование записей в книге
function getRecordsByQuery(query) {
    let result = [];
    for (let phone of Object.keys(phoneBook)) {
        if (phone.indexOf(query) !== -1 || phoneBook[phone].name.indexOf(query) !== -1 ||
            phoneBook[phone].email.indexOf(query) !== -1) {
            result[phone] = {
                name: phoneBook[phone].name,
                email: phoneBook[phone].email
            };
        }
    }

    return result;
}
//  Получение форматированных записей из книги
function getFormattedRecors(records) {
    let result = [];
    for (let phone of Object.keys(records)) {
        let record = getNeedFormat(records, phone);
        if (records[phone].email.length !== 0) {
            record = record + ', ' + records[phone].email;
        }
        if (record.length !== 0) {
            result.push(record);
        }
    }
    result.sort();

    return result;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let count = 0;
    let strs = csv.split('\n');
    strs.forEach(item => {
        let str = item.split(';');
        let phone = str[1];
        let name = str[0];
        let email = str[2];
        email = email || '';
        if (!isUndefined(phoneBook[phone])) {
            if (update(phone, name, email)) {
                count++;
            }
        } else if (add(phone, name, email)) {
            count++;
        }
    });

    return count;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
