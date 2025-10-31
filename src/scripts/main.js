'use strict';

const table = document.querySelector('table');
const tHead = table.tHead;
const data = [];

function makeCopyToObj() {
  [...table.tBodies].forEach((block) => {
    [...block.rows].forEach((tr) => {
      data.push({
        name: tr.cells[0].textContent.trim(),
        position: tr.cells[1].textContent.trim(),
        office: tr.cells[2].textContent.trim(),
        age: parseFloat(tr.cells[3].textContent.replace(/[^\d.-]/g, '')),
        salary: parseFloat(tr.cells[4].textContent.replace(/[^\d.-]/g, '')),
      });
    });
  });
}

const classASC = '_asc';
const classDESC = '_desc';

function sorting(idx) {
  const direction = toggleSortDirection() ? 1 : -1;
  const sorted = [...data].sort((a, b) => {
    const aVal = a[idx];
    const bVal = b[idx];

    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal) * direction;
    } else {
      return (aVal - bVal) * direction;
    }
  });

  renderTable(sorted);
}

function bindTableSort() {
  Array.from(tHead.rows[0].cells).forEach((th) => {
    th.addEventListener('click', (e) => {
      sorting(e.currentTarget.textContent.toLowerCase());
    });
  });
}

function toggleSortDirection() {
  const isAsc = table.classList.toggle(classASC);

  table.classList.toggle(classDESC, !isAsc);

  return isAsc;
}

function renderTable(rows) {
  const tbody = table.tBodies[0];

  tbody.innerHTML = '';

  const fragment = document.createDocumentFragment();

  rows.forEach((person) => {
    const tr = document.createElement('tr');

    ['name', 'position', 'office', 'age', 'salary'].forEach((key) => {
      const td = document.createElement('td');

      if (key === 'salary') {
        td.textContent = priceFormat(person[key]);
      } else {
        td.textContent = person[key];
      }
      tr.appendChild(td);
    });

    fragment.appendChild(tr);
  });

  tbody.append(fragment);
}

function priceFormat(str) {
  return '$' + str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function createRow(person) {
  const tbody = table.tBodies[0];
  const tr = document.createElement('tr');

  ['name', 'position', 'office', 'age', 'salary'].forEach((key) => {
    const td = document.createElement('td');

    td.textContent = person[key];
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
  data.push(person);
}

function activeRow() {
  table.tBodies[0].addEventListener('click', (e) => {
    if (e.target.tagName !== 'TD') {
      return;
    }

    document.querySelectorAll('table tbody tr.active').forEach((row) => {
      row.classList.remove('active');
    });

    e.target.closest('tr').classList.add('active');
  });
}

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  ['name', 'position', 'office', 'age', 'salary'].forEach((el) => {
    const htmlTag = el === 'office' ? 'select' : 'input';
    const formEl = document.createElement(htmlTag);

    if (el === 'name' || el === 'position') {
      formEl.setAttribute('type', 'text');
    }

    if (el === 'age' || el === 'salary') {
      formEl.setAttribute('type', 'number');
    }

    if (el === 'office') {
      [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ].forEach((city) => {
        const option = document.createElement('option');

        option.textContent = city;
        formEl.append(option);
      });
    }

    formEl.setAttribute('name', el);
    formEl.setAttribute('data-qa', el);
    formEl.setAttribute('required', true);

    const label = document.createElement('label');

    label.textContent = el[0].toUpperCase() + el.substring(1) + ':';
    label.append(formEl);
    form.append(label);
  });

  const btn = document.createElement('button');

  btn.textContent = 'Save to table';
  form.append(btn);

  document.body.append(form);

  attachFormHandler(form);
}

function attachFormHandler(form) {
  const pushNotification = (posTop, posRight, title, description, type) => {
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');

    h2.textContent = title;
    h2.className = 'title';

    p.textContent = description;

    div.style.top = posTop + 'px';
    div.style.right = posRight + 'px';

    div.setAttribute('data-qa', 'notification');

    div.className = `notification ${type}`;
    div.append(h2);
    div.append(p);

    document.body.append(div);

    setTimeout(function () {
      div.remove();
    }, 5000);
  };

  const { name: nameInput, position, office, age, salary } = form.elements;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const nameMin = 4;
    const ageMin = 18;
    const ageMax = 90;

    if (nameInput.value.trim().length < nameMin) {
      pushNotification(
        500,
        10,
        'Error - not correct Name field',
        'Name should be more than ' + nameMin + ' symbols.\n ',
        'error',
      );

      return;
    }

    if (
      Number(age.value.trim()) < ageMin ||
      Number(age.value.trim()) > ageMax
    ) {
      pushNotification(
        500,
        10,
        'Error - not correct Age field',
        'Age value is more ' + ageMin + ' or less than ' + ageMax + '.\n ',
        'error',
      );

      return;
    }

    pushNotification(
      500,
      10,
      'Success',
      'New peron was added to table.',
      'success',
    );

    const obj = {
      name: nameInput.value,
      position: position.value,
      office: office.value,
      age: age.value,
      salary: priceFormat(salary.value.trim()),
    };

    createRow(obj);
    document.forms[0].reset();
  });
}

document.addEventListener('DOMContentLoaded', init);

function init() {
  makeCopyToObj();
  bindTableSort();
  createForm();
  activeRow();
}
