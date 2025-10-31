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

function sorting(idx) {
  const sorted = [...data].sort((a, b) => {
    if (typeof a[idx] === 'string') {
      return b[idx].localeCompare(a[idx]);
    } else {
      return b[idx] - a[idx];
    }
  });

  renderTable(sorted);
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

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  h2.textContent = title;
  h2.className = 'title';

  p.textContent = description;

  div.style.top = posTop + 'px';
  div.style.right = posRight + 'px';

  div.className = `notification ${type}`;
  div.append(h2);
  div.append(p);

  document.body.append(div);

//   setTimeout(function () {
//     div.style.visibility = 'hidden';
//   }, 2000);
};

pushNotification(
  10,
  10,
  'Title of Success message',
  'Message example.\n ' + 'Notification should contain title and description.',
  'success',
);

pushNotification(
  150,
  10,
  'Title of Error message',
  'Message example.\n ' + 'Notification should contain title and description.',
  'error',
);

pushNotification(
  290,
  10,
  'Title of Warning message',
  'Message example.\n ' + 'Notification should contain title and description.',
  'warning',
);
