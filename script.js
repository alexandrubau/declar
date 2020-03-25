$(document).ready(function () {

    let signaturePad = createSignaturePad();
    resizeSignaturePad(signaturePad);

    let reasons = {
        reason_1: 'deplasarea intre domiciliu si locul de munca, atunci cand activitatea profesionala este esentiala si nu poate fi organizata sub forma de lucru la distanta sau deplasarea in interes profesional care nu poate fi amanata',
        reason_2: 'consult medical de specialitate care nu poate fi amanat',
        reason_3: 'deplasare pentru cumparaturi de prima necesitate la unitati comerciale din zona de domiciliu',
        reason_4: 'deplasare pentru asigurarea asistentei pentru persoane in varsta, vulnerabile sau pentru insotirea copiilor',
        reason_5: 'deplasare scurta, langa domiciliu, pentru desfasurarea de activitati fizice individuale, in aer liber, cu excluderea oricarei forme de activitate sportiva colectiva',
        reason_6: 'deplasare scurta, langa domiciliu, legata de nevoile animalelor de companie',
        reason_other: 'deplasare pentru rezolvarea urmatoarei situatii urgente:',
    }

    $('#form_address_same').on('change', function (event) {
        
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
        
        createPdfDoc(data);
    });

    $(window).on('resize', resizeSignaturePad);

    function getFormData($form) {

        var data = $form.serializeArray();
        var json = {};
    
        $.map(data, function(item){
            json[item.name] = item.value;
        });
    
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
        canvas.getContext("2d").scale(ratio, ratio);
      
        signaturePad.clear();
      }

    function createPdfDoc(data) {

        let doc = new jsPDF()

        doc.setFontSize(12);
 
        doc.text('Declaratie pe proprie raspundere,', 105, 30, { align: 'center' });
        doc.text('Subsemnatul(a) _________________________, fiul/fica lui __________ si al __________,', 25, 50);
        doc.text('domiciliat(a) in __________________________, judet/sectorul __________________________,', 15, 60);
        doc.text('strada _______________________, numar ___, bloc ___, scara ___, etaj ___, apartament ___,', 15, 70);
        doc.text('avand CNP ___________________________________, BI/CI serie _____, numar __________,', 15, 80);
        doc.text('Locuind(1) in fapt in _________________________, judet/sectorul _______________________,', 15, 100);
        doc.text('strada _______________________, numar ___, bloc ___, scara ___, etaj ___, apartament ___,', 15, 110);
        doc.text('Cunoscand prevederile art. 326, referitoare la falsul in declaratii(2), precum si ale art. 352', 15, 130);
        doc.text('referitoare la zadarnicirea combaterii bolilor din Noul Cod Penal, declar pe proprie raspundere', 15, 140);
        doc.text('faptul ca ma deplasez in interes personal/profesional, intre orele ________________________,', 15, 150);
        doc.text('de la _______________________________________________________________________', 15, 160);
        doc.text('pana la _____________________________________________________________________', 15, 170);
        doc.text('pentru:', 15, 180);
        doc.text('Atat declar, sustin si semnez.', 15, 220);
        doc.text('Data:', 15, 230);
        doc.text('Semnatura:', 140, 230);

        doc.setFontSize(8);

        doc.text('(1) Se declara situatia in care persoana nu locuieste la domiciliul prevazut în actul de identitate.', 15, 265, { maxWidth: 185 });
        doc.text('(2) Declararea necorespunzatoare a adevarului, facuta unei persoane dintre cele prevazute in art. 175 sau unei unitati in care aceasta isi desfasoara activitatea in vederea producerii unei consecinte juridice, pentru sine sau pentru altul, atunci cand, potrivit legii ori imprejurarilor, declaratia facuta serveste la producerea acelei consecinte, se pedepseste cu inchisoare de la 3 luni la 2 ani sau cu amenda.', 15, 270, { maxWidth: 185 });

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

        doc.text('10.02.2020', 30, 230);

        let signatureImage = signaturePad.toDataURL();

        doc.addImage(signatureImage, 'PNG', 135, 235, 50, 25);

        doc.save('a4.pdf');
    }
});