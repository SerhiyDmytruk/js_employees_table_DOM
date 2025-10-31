'use strict';

// write code here

const table = document.querySelector('table');
const tHead = table.tHead;
const data = [];

makeCopyToObj();

Array.from(tHead.rows[0].cells).forEach((th) => {
  th.addEventListener('click', (e) => {
    sorting(e.currentTarget.textContent.toLowerCase());
  });
});

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
  let sorted;

  if (sordedType()) {
    sorted = [...data].sort((a, b) => {
      if (typeof a[idx] === 'string') {
        return b[idx].localeCompare(a[idx]);
      } else {
        return b[idx] - a[idx];
      }
    });
  } else {
    sorted = [...data].sort((a, b) => {
      if (typeof a[idx] === 'string') {
        return a[idx].localeCompare(b[idx]);
      } else {
        return a[idx] - b[idx];
      }
    });
  }

  renderTable(sorted);
}

function sordedType() {
  if (table.className.includes(classASC)) {
    table.classList.remove(classASC);
    table.classList.add(classDESC);
  } else {
    table.classList.remove(classDESC);
    table.classList.add(classASC);
  }

  return table.className.includes(classASC);
}

function renderTable(obj) {
  const tbody = table.tBodies[0];

  tbody.innerHTML = '';

  const fragment = document.createDocumentFragment();

  obj.forEach((item) => {
    const tr = document.createElement('tr');

    ['name', 'position', 'office', 'age', 'salary'].forEach((key) => {
      const td = document.createElement('td');

      td.textContent = item[key];

      tr.appendChild(td);
    });

    fragment.appendChild(tr);
  });

  tbody.append(fragment);
}

function activeRow() {
  document.querySelectorAll('table tr').forEach((tr) => {
    tr.classList.remove('active');

    tr.addEventListener('click', () => {
      document.querySelectorAll('table tr').forEach((row) => {
        row.classList.remove('active');
      });

      tr.classList.add('active');
    });
  });
}

activeRow();

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

  eventHandlertoForm();
}

createForm();

function eventHandlertoForm() {
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
      div.style.visibility = 'hidden';
    }, 5000);
  };

  document
    .querySelector('.new-employee-form button')
    .addEventListener('click', (e) => {
      e.preventDefault();

      const nameInput = document.forms[0].elements.name.value;
      const age = Number(document.forms[0].elements.age.value);
      const nameMin = 4;
      const ageMin = 18;
      const ageMax = 90;

      if (
        nameInput.trim().length >= nameMin &&
        age >= ageMin &&
        age <= ageMax
      ) {
        pushNotification(
          500,
          10,
          'Success',
          'New peron was added to table.',
          'success',
        );

        addPerson(document.forms[0].elements);
        document.forms[0].reset();
      } else {
        pushNotification(
          500,
          10,
          'Error please fill the form',
          'Name should be more than ' +
            nameMin +
            ' symbols.\n ' +
            'Age value is more ' +
            ageMin +
            ' or less than ' +
            ageMax +
            '.',
          'error',
        );
      }
    });
}

function addPerson(formVal) {
  const dataForRow = {
    name: formVal.name.value,
    position: formVal.position.value,
    office: formVal.office.value,
    age: formVal.age.value,
    salary: '$' + formVal.salary.value,
  };

  const tbody = document.querySelector('tbody');
  const tr = document.createElement('tr');

  Object.values(dataForRow).forEach((val) => {
    const td = document.createElement('td');

    td.textContent = val;
    tr.append(td);
  });

  tbody.append(tr);
}
