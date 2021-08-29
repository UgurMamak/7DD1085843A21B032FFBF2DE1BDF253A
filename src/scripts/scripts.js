jQuery(document).ready(($) => {

    //primary-radio-btn
    /*(() => {
        document.querySelectorAll('.primary-radio-btn').forEach((radioItem) => {
            radioItem.querySelector('input[type="radio"]').addEventListener('change', function (e) {
                //Seçilen checkbox'ın grubunu alır
                //document.querySelectorAll('.primary-radio-btn input[name="' + this.name + '"]')
                document.querySelectorAll('.primary-radio-btn input[name="' + this.name + '"]').forEach(item2 => {
                    if (item2 === e.target) {
                        radioItem.classList.add('active');
                        this.toggleAttribute('checked');
                    } else {
                        item2.closest('.primary-radio-btn').classList.remove('active');
                        item2.removeAttribute('checked');
                    }
                });
            });
        });
    })();*/

    //Step-jquery
    /*   (() => {
           var stepWrap = $('[data-toggle="stepWrap"]');
           if (!stepWrap.length) return;

           stepWrap.each(function () {
               var $this = $(this);

               var currentNumber = 0,
                   form = $this.find('form'),
                   btnPrev = $this.find('[data-toggle="btnPrev"]'),
                   btnNext = $this.find('[data-toggle="btnNext"]'),
                   btnSubmit = $this.find('[type="submit"]'),
                   stepBody = $this.find('.step-body'),
                   stepHeaderItem = $this.find('.step-header .item');

               formValidation(form);

               function stepAction(indexNumber) {
                   if (indexNumber === 0) {
                       btnPrev.css('display', 'none');
                       btnSubmit.css('display', 'none');
                       btnNext.css('display', '')
                   } else {
                       btnPrev.css('display', '');
                   }

                   if (stepBody.length - 1 === indexNumber) {
                       btnSubmit.css('display', '');
                       btnNext.css('display', 'none');
                   }

                   stepBody.css('display', "none");
                   stepBody.eq(indexNumber).css('display', '');
                   stepHeaderItem.removeClass('active');
                   stepHeaderItem.eq(indexNumber).addClass('active');
               }

               btnPrev.click(() => {
                   stepAction(--currentNumber);
               });

               btnNext.click(() => {
                   if (!form.valid()) return;
                   console.log(form.valid());
                   stepAction(++currentNumber);
               });


           });

       })();*/

    function renderPrimaryRadioBtn() {
        $('[data-wrap="radioList"]').each((index, listItem) => {
            var radioBtn = $(listItem).find('.primary-radio-btn');

            radioBtn.find('input[type="radio"]').on('change', function (e) {
                var radioInput = $(this),
                    parent = radioInput.closest('.primary-radio-btn');

                parent.addClass('active');
                radioInput.attr('checked', true);
                radioInput.attr('required', true);

                radioBtn.not(parent).removeClass('active');
                radioBtn.find('input[type="radio"]').not(radioInput).removeAttr('checked');
                radioBtn.find('input[type="radio"]').not(radioInput).removeAttr('required');

            });

        });
    }

    function renderPrimarySelect2(vue) {

        $('.primary-select2').each((index, item) => {
            $(item).select2({
                width: '100%',
                dropdownParent: $(item).parent(),
                dropdownCssClass: "primary-select2",
                selectionCssClass: "primary-select2",
                containerCssClass: "primary-select2",
            });
        }).on('select2:select', (e) => {
            let type = $(e.target).attr('name');
            vue.form[type] = $(e.target).val();
        });
    }

    function renderDatePicker() {
        flatpickr(".primary-datepicker input", {
            allowInput: true,
            minDate: "today",
            disableMobile: "true",
            // maxDate: new Date().fp_incr(14) // 14 days from now
            onChange: function (selectedDates, dateStr, instance) {
                $(instance.input).valid();
            },
        });
    }

    function formValidation(form) {
        form.validate({
            ignore: ':hidden',
            onfocusout: false,
            highlight: function (element) {
                console.log(element);
                let $this = $(element);
                //$this.parents($this[0].type === "checkbox" || $this[0].type === "radio" ? '[data-wrap="radioList"]' : '.input-group').addClass('has-error');
                $this.parents('.input-group').addClass('has-error');
            },
            unhighlight: function (element) {
                let $this = $(element);
                $this.parents('.input-group').removeClass('has-error');
            },
            errorPlacement: function (error, element) {
                let $this = $(element);
                if ($this[0].type == "checkbox" || $this[0].type == "radio") {
                } else {
                    $this.parents('.input-group').append(error);
                }
            }
        });

        form.find('.primary-select2').on('change', (e) => {
            $(e.target).valid();
        });

    }

    (() => {
        function formElement() {
            let form = {};
            $('#stepWrap').find('[name]').map((index, item) => {
                form[$(item).attr('name')] = "";
            });
            return form;
        }

        function initialData() {
            return {
                activeStep: 1,
                stepCount: '',
                form: formElement(),
                result: false
            }
        }

        Vue.directive('mask', VueMask.VueMaskDirective);

        Vue.component('modal', {
            template: '#modal-template',
            data: function () {
                return {show: false};
            },
            methods: {
                open: function () {
                    //this.show = true;
                    $(this.$el).modal('show');
                },
                close: function () {
                    //this.show = false;
                    $(this.$el).modal('hide');
                }
            }
        });

        new Vue({
            el: '#stepWrap',
            data: function () {
                return initialData();
            },
            methods: {
                actionStep: function (step) {
                    if (step === +1) {
                        if (!$(this.$el).find('[data-toggle="form"]').valid()) return;
                    }
                    setTimeout(() => {
                        this.activeStep = this.activeStep + step;
                    });
                },
                submitAction: function () {
                    if (!$(this.$el).find('[data-toggle="form"]').valid()) return;

                    axios.post($(this.$el).find('[data-toggle="form"]').attr('data-url'), {}).then(response => {
                        console.log(response);
                        if (response.data.status === "success") {
                            this.result = true;
                        }
                    });
                },
                resetData: function () {
                    Object.assign(this.$data, initialData());
                },
                cancelReservationShow: function () {
                    this.$refs.questionModal.open();
                },
                cancelReservation: function () {
                    console.log("çalışıyor");
                    this.$refs.questionModal.close();
                    this.$refs.resultModal.open();
                },
            },
            mounted() {
                renderDatePicker();
                renderPrimarySelect2(this);
                formValidation($(this.$el).find('[data-toggle="form"]'));
                renderPrimaryRadioBtn();
                this.stepCount = $(this.$el).find('.step-body').length;
            }
        });
    })();


});