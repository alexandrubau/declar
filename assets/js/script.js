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

    $('form').on('submit', function (event) {

        event.preventDefault();

        let data = getFormData($('form'));

        let doc = createDoc(data);

        downloadDoc(doc);
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

        $.map(data, function(item){
            json[item.name] = item.value;
        });

        let isSameAddressChecked = formAddressSameInput.is(':checked');

        if(isSameAddressChecked) {
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
        let ratio =  Math.max(window.devicePixelRatio || 1, 1);

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);

        signaturePad.clear();
    }

    function createDoc(data) {

        let doc = new jsPDF();

        doc.setFontSize(12);
        doc.setFont('Roboto', 'normal');

        doc.text('Declarație pe proprie răspundere,', 105, 30, { align: 'center' });
        doc.text('Subsemnatul(a) _______________________________, fiul/fiica lui ____________ și al ____________,', 25, 50);
        doc.text('domiciliat(ă) în ________________________________, județ/sectorul ________________________________,', 15, 60);
        doc.text('stradă _____________________________, număr ____, bloc ____, scară ____, etaj ____, apartament ____,', 15, 70);
        doc.text('având CNP _________________________________________, BI/CI serie _________, număr _____________,', 15, 80);
        doc.text('Locuind(1) în fapt în ______________________________, județ/sectorul ____________________________,', 15, 100);
        doc.text('stradă _____________________________, număr ____, bloc ____, scară ____, etaj ____, apartament ____,', 15, 110);
        doc.text('Cunoscând prevederile art. 326, referitoare la falsul în declarații(2), precum și ale art. 352', 15, 130);
        doc.text('referitoare la zădarnicirea combaterii bolilor din Noul Cod Penal, declar pe proprie răspundere', 15, 140);
        doc.text('faptul că mă deplasez în interes personal/profesional, între orele ___________________________,', 15, 150);
        doc.text('de la ______________________________________________________________________________________', 15, 160);
        doc.text('pana la ___________________________________________________________________________________', 15, 170);
        doc.text('pentru:', 15, 180);
        doc.text('Atât declar, susțin și semnez.', 15, 220);
        doc.text('Data:', 15, 230);
        doc.text('Semnatura:', 140, 230);

        doc.setFontSize(8);

        doc.text('(1) Se declară situația în care persoana nu locuiește la domiciliul prevăzut în actul de identitate.', 15, 265, { maxWidth: 185 });
        doc.text('(2) Declararea necorespunzătoare a adevarului, facută unei persoane dintre cele prevăzute în art. 175 sau unei unităti în care aceasta își desfășoară activitatea în vederea producerii unei consecințe juridice, pentru sine sau pentru altul, atunci când, potrivit legii ori împrejurărilor, declarația făcută servește la producerea acelei consecințe, se pedepsește cu închisoare de la 3 luni la 2 ani sau cu amendă.', 15, 270, { maxWidth: 185 });

        doc.setFontSize(10);

        doc.text(data.form_id_lastname + ' ' + data.form_id_firstname, 86, 49, { align: 'center' });
        doc.text(data.form_fathername, 149, 49, { align: 'center' });
        doc.text(data.form_mothername, 182, 49, { align: 'center' });

        doc.text(data.form_id_city, 76, 59, { align: 'center' });
        doc.text(data.form_id_county, 165, 59, { align: 'center' });

        doc.text(data.form_id_street, 56, 69, { align: 'center' });
        doc.text(data.form_id_street_no, 101, 69, { align: 'center' });
        doc.text(data.form_id_building, 120, 69, { align: 'center' });
        doc.text(data.form_id_building_entrance, 140, 69, { align: 'center' });
        doc.text(data.form_id_building_floor, 158, 69, { align: 'center' });
        doc.text(data.form_id_appartment_no, 190, 69, { align: 'center' });

        doc.text(data.form_pnc, 80, 79, { align: 'center' });
        doc.text(data.form_id_series, 150, 79, { align: 'center' });
        doc.text(data.form_id_number, 181, 79, { align: 'center' });

        doc.text(data.form_city, 85, 99, { align: 'center' });
        doc.text(data.form_county, 170, 99, { align: 'center' });

        doc.text(data.form_street, 56, 109, { align: 'center' });
        doc.text(data.form_street_no, 101, 109, { align: 'center' });
        doc.text(data.form_building, 120, 109, { align: 'center' });
        doc.text(data.form_building_entrance, 140, 109, { align: 'center' });
        doc.text(data.form_building_floor, 158, 109, { align: 'center' });
        doc.text(data.form_appartment_no, 190, 109, { align: 'center' });

        doc.text(data.form_start_hour + ':' + data.form_start_minute + ' - ' + data.form_end_hour + ':' + data.form_end_minute, 165, 149, { align: 'center' });

        doc.text(data.form_from, 30, 159);
        doc.text(data.form_to, 35, 169);

        doc.text(reasons[data.form_reason] ? reasons[data.form_reason] : '', 20, 190, { maxWidth: 180 });
        doc.text(data.form_emergency_details ? data.form_emergency_details : '', 20, 195, { maxWidth: 180 });

        doc.text(data.form_date, 30, 230);

        let signatureImage = signaturePad.toDataURL();

        doc.addImage(signatureImage, 'PNG', 135, 235, 50, 25);

        return doc.output('datauristring');
    }

    function downloadDoc(content) {

        const downloadLink = document.createElement('a');
        const fileName = 'declaratie_pe_propria_raspundere.pdf';
    
        downloadLink.href = content;
        downloadLink.download = fileName;
        downloadLink.click();
    }
});