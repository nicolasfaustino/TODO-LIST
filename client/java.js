document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.querySelector('.task-list');
  const clearBtn = document.getElementById('clearBtn');

  function createTaskElement(text) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';

    const span = document.createElement('span');
    span.textContent = text;
    span.style.flex = '1';

    
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'edit-btn';
    editBtn.title = 'Editar tarefa';
    editBtn.textContent = '✏️';

    
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'delete-btn';
    delBtn.title = 'Remover tarefa';
    delBtn.textContent = '🗑️';

    
    function enableEdit() {
      if (taskDiv.dataset.editing === 'true') return;
      taskDiv.dataset.editing = 'true';

      const inputEdit = document.createElement('input');
      inputEdit.type = 'text';
      inputEdit.value = span.textContent;
      inputEdit.className = 'edit-input';
      inputEdit.style.flex = '1';

      taskDiv.replaceChild(inputEdit, span);
      editBtn.textContent = '💾';
      inputEdit.focus();
      inputEdit.select();

      function saveEdit() {
        const v = inputEdit.value.trim();
        if (v) span.textContent = v;
        taskDiv.replaceChild(span, inputEdit);
        editBtn.textContent = '✏️';
        taskDiv.dataset.editing = 'false';
      }

      function cancelEdit() {
        taskDiv.replaceChild(span, inputEdit);
        editBtn.textContent = '✏️';
        taskDiv.dataset.editing = 'false';
      }

      inputEdit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveEdit();
        if (e.key === 'Escape') cancelEdit();
      });

      inputEdit.addEventListener('blur', () => {
        saveEdit();
      });
    }

    editBtn.addEventListener('click', () => {
      if (editBtn.textContent === '💾') {
        const inputEdit = taskDiv.querySelector('.edit-input');
        if (inputEdit) {
          const ev = new KeyboardEvent('keydown', { key: 'Enter' });
          inputEdit.dispatchEvent(ev);
        }
        return;
      }
      enableEdit();
    });

    delBtn.addEventListener('click', () => {
      taskDiv.remove();
    });

    taskDiv.appendChild(span);
    taskDiv.appendChild(editBtn);
    taskDiv.appendChild(delBtn);
    return taskDiv;
  }

  function addTask() {
    const value = input.value.trim();
    if (!value) return; 

    const taskEl = createTaskElement(value);
    taskList.appendChild(taskEl);
    input.value = '';
    input.focus();
  }

  
  addBtn.addEventListener('click', addTask);

  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });

  
  document.querySelectorAll('.task-list .task').forEach((t) => {
    
    if (t.querySelector('.edit-btn')) return;
    const span = t.querySelector('span') || document.createElement('span');
    if (!t.contains(span)) t.insertBefore(span, t.firstChild);
    const newEl = createTaskElement(span.textContent || '');
    t.replaceWith(newEl);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!taskList || taskList.children.length === 0) {
        alert('Não há tarefas para apagar.');
        return;
      }
      const ok = confirm('Deseja apagar todas as tarefas? Esta ação não pode ser desfeita.');
      if (!ok) return;
      taskList.innerHTML = '';
    });
  }
});
