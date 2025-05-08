document.addEventListener('DOMContentLoaded', function() {
    function toggleFields() {
        const taskType = document.getElementById('id_internal_type').value;

        // Показать все поля по умолчанию
        const formRows = document.querySelectorAll('.form-row');
        formRows.forEach(row => row.style.display = 'block');

        // Логика скрытия полей в зависимости от типа задачи
        if (taskType === 'Photo') {
            document.querySelectorAll('.form-row').forEach(row => {
                if (row.querySelector('#id_audio_text')) {
                    row.style.display = 'none'; // Скрыть поле для аудио текста
                }
                if (row.querySelector('#id_limit_video_length')) {
                    row.style.display = 'none'; // Скрыть поле для аудио текста
                }
                if (row.querySelector('#id_limit_audio_length')) {
                    row.style.display = 'none'; // Скрыть поле для аудио текста
                }
                if (row.querySelector('#id_audio_text')) {
                    row.style.display = 'none'; // Скрыть поле для аудио текста
                }
            });
        } else if (taskType === 'Audio') {
            document.querySelectorAll('.form-row').forEach(row => {
                if (row.querySelector('#id_limit_video_length')) {
                    row.style.display = 'none'; // Скрыть поле для аудио текста
                }
            });
        } else if (taskType === 'Video') {
            document.querySelectorAll('.form-row').forEach(row => {
                if (row.querySelector('#id_limit_audio_length')) {
                    row.style.display = 'none'; // Скрыть поле для аудио текста
                }
                if (row.querySelector('#id_audio_text')) {
                    row.style.display = 'none'; // Скрыть поле для аудио текста
                }
            });
        }
    }

    // Привязка события изменения типа задачи
    document.getElementById('id_internal_type').addEventListener('change', toggleFields);

    // Первоначальная настройка при загрузке страницы
    toggleFields();
});


