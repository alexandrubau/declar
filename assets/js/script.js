$(document).ready(function () {

    let signaturePad = createSignaturePad();
    resizeSignaturePad(signaturePad);

    let formAddressSameInput = $('#form_address_same');
    let currentHour = new Date().getHours();

    $('#form-signature-clear').on('click', function () {

        signaturePad.clear();
    });

    $('#download').on('submit', function (event) {

        event.preventDefault();

        // let data = getFormData($('form'));
        let data = {};

        downloadDoc(data);
    });

    $(window).on('resize', function () {

        resizeSignaturePad(signaturePad);
    });

    $('#form_date').datepicker({
        autoPick: true,
        format: 'dd.mm.yyyy'
    });

    $('#form_birth_date').datepicker({
        format: 'dd.mm.yyyy'
    });

    $('#form_start_hour').val(currentHour);
    $('#form_end_hour').val(currentHour + 1);

    function isFacebookBrowser() {

        var ua = navigator.userAgent || navigator.vendor || window.opera;

        return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
    }

    if (isFacebookBrowser()) {

        $('#facebook-browser').removeClass("d-none");
        $('#allow-page-load').addClass("d-none");
    }

    function populateOnSameAddress(data) {

        data.form_city = "";
        data.form_county = "";
        data.form_street = "";
        data.form_street_no = "";
        data.form_building = "";
        data.form_building_entrance = "";
        data.form_building_floor = "";
        data.form_appartment_no = "";

        return data;
    }

    function getFormData($form) {

        let data = $form.serializeArray();
        let json = {};

        $.map(data, function (item) {
            json[item.name] = item.value;
        });

        let isSameAddressChecked = formAddressSameInput.is(':checked');

        if (isSameAddressChecked) {
            json = populateOnSameAddress(json)
        }

        return json;
    }

    function createSignaturePad() {

        let canvas = $('canvas').get(0);

        return new SignaturePad(canvas);
    }

    function resizeSignaturePad(signaturePad) {

        let canvas = $('canvas').get(0);
        let ratio = Math.max(window.devicePixelRatio || 1, 1);

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);

        signaturePad.clear();
    }

    function downloadDoc(data) {
        Promise.all(
            [
                new Promise(function (resolve) {
                    let iframe = document.createElement('iframe');
                    iframe.id = 'pdfContainer';
                    $('body').append($(iframe));

                    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    $('body', $(iframeDoc)).html(templateString);

                    html2canvas(iframeDoc.body, {
                        onrendered: function (canvas) {
                            resolve(canvas.toDataURL('image/png', 1));
                            $(iframe).remove();
                        },
                    });
                })
            ])
            .then(function (templateImage) {

                let doc = new jsPDF();

                doc.addImage(templateImage[0], 'PNG', 15, 15);
                doc.save('declaratie_pe_propria_raspundere.pdf');
            });


    }
});
