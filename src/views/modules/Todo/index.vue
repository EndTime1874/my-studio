<template>
  <div class="todo-module">
    <div class="module-header">
      <h1>待办事项</h1>
      <p>任务管理和进度跟踪工具</p>
    </div>

    <div class="module-content">
      <div class="todo-container">
        <!-- 添加任务 -->
        <div class="add-todo">
          <div class="add-todo__input">
            <input
              v-model="newTodo"
              @keyup.enter="addTodo"
              placeholder="添加新任务..."
              class="todo-input"
            />
            <button @click="addTodo" :disabled="!newTodo.trim()" class="add-btn">
              <Icon icon="mdi:plus" />
            </button>
          </div>
        </div>

        <!-- 任务统计 -->
        <div class="todo-stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalTodos }}</span>
            <span class="stat-label">总任务</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ completedTodos }}</span>
            <span class="stat-label">已完成</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ pendingTodos }}</span>
            <span class="stat-label">待完成</span>
          </div>
        </div>

        <!-- 任务列表 -->
        <div class="todo-list">
          <div v-if="todos.length === 0" class="empty-state">
            <Icon icon="mdi:clipboard-text-outline" class="empty-icon" />
            <p>还没有任务，添加一个开始吧！</p>
          </div>

          <div v-else class="todo-items">
            <div
              v-for="todo in todos"
              :key="todo.id"
              class="todo-item"
              :class="{ 'todo-item--completed': todo.completed }"
            >
              <div class="todo-item__checkbox">
                <input
                  type="checkbox"
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
                  class="checkbox"
                />
              </div>
              <div class="todo-item__content">
                <span class="todo-text">{{ todo.text }}</span>
                <span class="todo-time">{{ formatDate(todo.createdAt, 'MM-DD HH:mm') }}</span>
              </div>
              <div class="todo-item__actions">
                <button @click="deleteTodo(todo.id)" class="delete-btn">
                  <Icon icon="mdi:delete-outline" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { formatDate } from '@/utils/date';
import { generateId } from '@/utils';

// 响应式数据
const newTodo = ref('');
const todos = useLocalStorage('todos', []);

// 计算属性
const totalTodos = computed(() => todos.value.length);
const completedTodos = computed(() => todos.value.filter(todo => todo.completed).length);
const pendingTodos = computed(() => todos.value.filter(todo => !todo.completed).length);

// 方法
const addTodo = () => {
  if (!newTodo.value.trim()) return;

  const todo = {
    id: generateId(),
    text: newTodo.value.trim(),
    completed: false,
    createdAt: new Date(),
  };

  todos.value.unshift(todo);
  newTodo.value = '';
};

const toggleTodo = id => {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

const deleteTodo = id => {
  const index = todos.value.findIndex(t => t.id === id);
  if (index > -1) {
    todos.value.splice(index, 1);
  }
};
</script>

<style scoped>
.todo-module {
  min-height: 100vh;
  background: var(--bg-color);
}

.module-header {
  background: linear-gradient(135deg, #45b7d1 0%, #6bc5e0 100%);
  color: white;
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.module-header h1 {
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.module-header p {
  font-size: var(--text-lg);
  opacity: 0.9;
}

.module-content {
  padding: var(--spacing-xl);
}

.todo-container {
  max-width: 800px;
  margin: 0 auto;
}

/* 添加任务 */
.add-todo {
  margin-bottom: var(--spacing-xl);
}

.add-todo__input {
  display: flex;
  gap: var(--spacing);
}

.todo-input {
  flex: 1;
  padding: var(--spacing) var(--spacing-lg);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: var(--transition);
}

.todo-input:focus {
  border-color: #45b7d1;
  box-shadow: 0 0 0 3px rgba(69, 183, 209, 0.1);
}

.add-btn {
  padding: var(--spacing) var(--spacing-lg);
  background: #45b7d1;
  color: white;
  border: 2px solid #45b7d1;
  border-radius: var(--radius-lg);
  font-size: 18px;
  transition: var(--transition);
}

.add-btn:hover:not(:disabled) {
  background: #3a9bc1;
  border-color: #3a9bc1;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 统计 */
.todo-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing);
  margin-bottom: var(--spacing-xl);
}

.stat-item {
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
}

.stat-number {
  display: block;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: #45b7d1;
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-color-secondary);
}

/* 任务列表 */
.todo-list {
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.empty-state {
  padding: var(--spacing-xl);
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: var(--text-color-tertiary);
  margin-bottom: var(--spacing);
}

.empty-state p {
  color: var(--text-color-secondary);
  font-size: var(--text-base);
}

.todo-items {
  max-height: 400px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background: var(--bg-color);
}

.todo-item--completed {
  opacity: 0.6;
}

.todo-item--completed .todo-text {
  text-decoration: line-through;
}

.todo-item__checkbox {
  margin-right: var(--spacing);
}

.checkbox {
  width: 18px;
  height: 18px;
  accent-color: #45b7d1;
}

.todo-item__content {
  flex: 1;
  min-width: 0;
}

.todo-text {
  display: block;
  font-size: var(--text-base);
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
  word-break: break-word;
}

.todo-time {
  font-size: var(--text-xs);
  color: var(--text-color-tertiary);
}

.todo-item__actions {
  margin-left: var(--spacing);
}

.delete-btn {
  padding: var(--spacing-sm);
  background: transparent;
  color: var(--error-color);
  border: 1px solid transparent;
  border-radius: var(--radius);
  transition: var(--transition);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--error-color);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing);
    text-align: center;
  }

  .add-todo__input {
    flex-direction: column;
  }

  .todo-stats {
    grid-template-columns: 1fr;
  }
}
</style>
