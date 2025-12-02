"use strict"

document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll("._form");
    forms.forEach(form => {
        if (form) {
            form.addEventListener('submit', function(e) {
                formSubmit(e, form);
            });

            async function formSubmit(e, form) {
                e.preventDefault(); 
                let error = formValidate(form);
                if (error != 0) {
                    // Ошибка валидации формы;
                   
                } else {
                    // Валидация прошла успешно;
                    form.submit(); 
                    form.reset();
                }
            }
            
        }
    });

   function formValidate(form) {
    let error = 0;
    let formReq = form.querySelectorAll('._req');

    for (let index = 0; index < formReq.length; index++) {
        const input = formReq[index];
        formRemove_Req_Error(input);
        // Checkbox check
        if (input.type === 'checkbox') {
            if (!input.checked) {
                formAddReq(input);
                error++;
            }
        }
        //  Email check
        if (input.classList.contains('_email')) {
            if (input.value.trim() === '') {
                formAddReq(input);
                error++;
            } else if (emailTest(input)) {
                formAddError(input);
                error++;
            }
        }
        //  Phone check
        else if (input.classList.contains('_phone')) {
            if (input.value.trim() === '') {
                formAddReq(input);
                error++;
            } else if (!isPhoneLengthValid(input)) {
                formAddError(input);
                error++;
            }
        }
        // 🧾 General input check
        else {
            if (input.value.trim() === '') {
                formAddReq(input);
                error++;
            }
        }
    }

    return error;
    }

    function isPhoneLengthValid(input) {
        return input.value.replace(/\D/g, '').length === 11;
    }

    function formAddReq(input) {
        input.closest('._form-group').classList.add('req_error');
    }

    function formAddError(input) {
        input.closest('._form-group').classList.add('error_error');
    }

    function formRemove_Req_Error(input) {
        input.closest('._form-group').classList.remove('req_error');
        input.closest('._form-group').classList.remove('error_error');
    }

    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    // Phone mask 
    const inputPhoneMask = document.querySelectorAll(".phone-mask");
    inputPhoneMask.forEach((input) => {
        const prefixNumber = (str) => {
            if (str === "7") {
                return "7 (";
            }
            if (str === "8") {
                return "8 (";
            }
            if (str === "9") {
                return "7 (9";
            }
            return "7 (";
        };

        input.addEventListener("input", (e) => {
            let value = input.value.replace(/\D+/g, "");  
            const numberLength = 11;
            let result = "+";
            // Если строка начинается с "8" или "+8", убираем "+" в начале
            if (value.length > 0 && (value[0] === "8" || value.startsWith("8") || value.startsWith("+8"))) {
                result = "";
            }
            for (let i = 0; i < value.length && i < numberLength; i++) {
                switch (i) {
                    case 0:
                        result += prefixNumber(value[i]);
                        continue;
                    case 4:
                        result += ") ";
                        break;
                    case 7:
                        result += "-";
                        break;
                    case 9:
                        result += "-";
                        break;
                    default:
                        break;
                }
                result += value[i];
            }

            input.value = result;
        });

        // Обработчик для клавиши Backspace или Ctrl+A и X, чтобы можно было стереть полностью
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" || e.key === "Delete" || (e.ctrlKey && e.key === "a")) {
                let value = input.value.replace(/\D+/g, "");
                if (value === "7" || value === "8") {
                    input.value = "";
                }
                if (input.value === "+7 (" || input.value === "+8 (" || input.value === "+") {
                    input.value = "";
                }
            }
        });
    });
    
});
