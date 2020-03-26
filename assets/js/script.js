$(document).ready(function () {

    let signaturePad = createSignaturePad();
    resizeSignaturePad(signaturePad);

    let reasons = {
        reason_1: 'deplasarea între domiciliu și locul de muncă, atunci când activitatea profesională este esențială și nu poate fi organizată sub formă de lucru la distanță sau deplasarea în interes profesional care nu poate fi amanată',
        reason_2: 'consult medical de specialitate care nu poate fi amânat',
        reason_3: 'deplasare pentru cumpărături de primă necesitate la unități comerciale din zona de domiciliu',
        reason_4: 'deplasare pentru asigurarea asistenței pentru persoane în varstă, vulnerabile sau pentru insoțirea copiilor',
        reason_5: 'deplasare scurtă, lângă domiciliu, pentru desfășurarea de activități fizice individuale, în aer liber, cu excluderea oricărei forme de activitate sportivă colectivă',
        reason_6: 'deplasare scurtă, lângă domiciliu, legată de nevoile animalelor de companie',
        reason_other: 'deplasare pentru rezolvarea urmatoarei situații urgente:',
    };

    let formAddressSameInput = $('#form_address_same');

    formAddressSameInput.on('change', function (event) {

        let isChecked = $(this).is(':checked');

        $('.js-form-residence :input:not(#form_address_same)').prop('disabled', isChecked);
    });

    $('input[name="form_reason"]').on('change', function (event) {

        let selectedVal = $(this).val();

        let isOther = selectedVal === 'reason_other';

        $('#form_emergency_details').prop('disabled', !isOther);
    });

    $('#form-signature-clear').on('click', function () {

        signaturePad.clear();
    });

    $('#download').on('click', function (event) {

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