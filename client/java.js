document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.querySelector('.task-list');
  const clearBtn = document.getElementById('clearBtn');
  const url = 'http://localhost:5091/api/tasks';

  async function fetchTasks() {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      const tasks = await response.json();
      
      taskList.innerHTML = '';
      
      tasks.forEach(task => {
        const taskEl = createTaskElement(task.description);
        taskEl.dataset.taskId = task.id;
        taskList.appendChild(taskEl);
      });
      
    } catch (error) {
      console.error('Erro ao buscar tasks:', error);
      alert('Erro ao carregar as tarefas da API. Verifique se o servidor está rodando.');
    }
  }

  async function addTaskToAPI(description) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: description })
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const newTask = await response.json();
      return newTask;
    } catch (error) {
      alert('Erro ao criar a tarefa na API.');
      return null;
    }
  }

  async function updateTaskInAPI(id, description) {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: description })
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return true;
    } catch (error) {
      alert('Erro ao atualizar a tarefa na API.');
      return false;
    }
  }

  async function deleteTaskFromAPI(id) {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar task:', error);
      alert('Erro ao deletar a tarefa na API.');
      return false;
    }
  }

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

      async function saveEdit() {
        const v = inputEdit.value.trim();
        if (v) {
          const taskId = taskDiv.dataset.taskId;
          if (taskId) {
            const success = await updateTaskInAPI(taskId, v);
            if (success) {
              span.textContent = v;
            } else {
              return;
            }
          } else {
            span.textContent = v;
          }
        }
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

    delBtn.addEventListener('click', async () => {
      const taskId = taskDiv.dataset.taskId;
      if (taskId) {
        const success = await deleteTaskFromAPI(taskId);
        if (success) {
          taskDiv.remove();
        }
      } else {
        taskDiv.remove();
      }
    });

    taskDiv.appendChild(span);
    taskDiv.appendChild(editBtn);
    taskDiv.appendChild(delBtn);
    return taskDiv;
  }

  async function addTask() {
    const value = input.value.trim();
    if (!value) return; 

    const newTask = await addTaskToAPI(value);
    if (newTask) {
      const taskEl = createTaskElement(newTask.description);
      taskEl.dataset.taskId = newTask.id;
      taskList.appendChild(taskEl);
    }
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
    clearBtn.addEventListener('click', async () => {
      if (!taskList || taskList.children.length === 0) {
        alert('Não há tarefas para apagar.');
        return;
      }
      const ok = confirm('Deseja apagar todas as tarefas? Esta ação não pode ser desfeita.');
      if (!ok) return;
      
      const tasks = Array.from(taskList.children);
      let allDeleted = true;
      
      for (const taskDiv of tasks) {
        const taskId = taskDiv.dataset.taskId;
        if (taskId) {
          const success = await deleteTaskFromAPI(taskId);
          if (!success) {
            allDeleted = false;
          }
        }
      }
      
      if (allDeleted) {
        taskList.innerHTML = '';
      } else {
        alert('Algumas tarefas não puderam ser deletadas. Recarregando a lista...');
        fetchTasks();
      }
    });
  }

  fetchTasks();
});
