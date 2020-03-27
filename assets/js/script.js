$(document).ready(function () {

    const templateVariables = [
        'firstName',
        'lastName',
        'birthDay',
        'birthMonth',
        'birthYear',
        'city',
        'county',
        'streetName',
        'streetNo',
        'building',
        'buildingEntrance',
        'floor',
        'apartmentNo',
        'destinations',
        'date',
        'signatureSrc',
        'reason_1',
        'reason_2',
        'reason_3',
        'reason_4',
        'reason_5',
        'reason_6',
        'reason_7',
        'reason_8',
        'reason_9',
        'reason_10',
    ];

    let signaturePad = createSignaturePad();
    resizeSignaturePad(signaturePad);

    $('#form-signature-clear').on('click', function () {
        signaturePad.clear();
    });

    $('#download').on('submit', function (event) {

        event.preventDefault();

        let data = getFormData($('form'));

        let preparedTemplateString = prepareTemplate(templateString, data);

        downloadDoc(preparedTemplateString);
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

    function isFacebookBrowser() {

        var ua = navigator.userAgent || navigator.vendor || window.opera;

        return (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1);
    }

    if (isFacebookBrowser()) {

        $('#facebook-browser').removeClass('d-none');
        $('#allow-page-load').addClass('d-none');
    }

    function getFormData($form) {

        let data = $form.serializeArray();
        let json = {};

        $.map(data, function (item) {
            json[item.name] = item.value;
        });

        return json;
    }

    function prepareTemplate(str, data) {
        let regExStr = '{{' + templateVariables.join('}}|{{') + '}}';
        const regExpPattern = new RegExp(regExStr, 'gi');
        let explodedBirthDay = data.form_birth_date.split('.');
        let mapObj = {
            firstName: data.form_firstname,
            lastName: data.form_lastname,
            birthDay: explodedBirthDay[0],
            birthMonth: explodedBirthDay[1],
            birthYear: explodedBirthDay[2],
            city: data.form_city,
            county: data.form_county,
            streetName: data.form_street,
            streetNo: data.form_street_no,
            building: data.form_building ? 'Bloc ' + data.form_building + ',' : '',
            buildingEntrance: data.form_building_entrance ? 'Sc. ' + data.form_building_entrance + ',' : '',
            floor: data.form_building_floor ? 'Et. ' + data.form_building_floor + ',' : '',
            apartmentNo: data.form_appartment_no ? 'Ap. ' + data.form_appartment_no : '',
            destinations: data.form_destinations,
            date: data.form_date,
            signatureSrc: signaturePad.toDataURL()
        };
        mapObj[data.form_reason] = 'selected';

        str = str.replace(regExpPattern, function (matched) {
            let variableName = matched.substring(2, matched.length - 2);
            return mapObj[variableName] ? mapObj[variableName] : ''
        });
        return str;
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

    function downloadDoc(htmlString) {
        Promise.all(
            [
                new Promise(function (resolve) {
                    let iframe = document.createElement('iframe');
                    iframe.id = 'pdfContainer';
                    $('body').append($(iframe));

                    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    $('body', $(iframeDoc)).html(htmlString);

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
