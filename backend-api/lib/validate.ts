export function validateTodo(data: any) {
  if (!data.task || data.task.trim() === '') return 'Tugas tidak boleh kosong';
  return null;
}