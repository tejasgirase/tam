function getAge(date) {
    var months    = [];
    months["Jan"] = '01';
    months["Feb"] = '02';
    months["Mar"] = '03';
    months["Apr"] = '04';
    months["May"] = '05';
    months["Jun"] = '06';
    months["Jul"] = '07';
    months["Aug"] = '08';
    months["Sep"] = '09';
    months["Oct"] = '10';
    months["Nov"] = '11';
    months["Dec"] = '12';

    date_valid    = months[date.substring(3, 6)]+'/'+date.substring(0, 2)+'/'+date.substring(7, 11);
    var lre       = /^\s*/;
    var datemsg   = "";
    var inputDate = date_valid;
    inputDate     = inputDate.replace(lre, "");

    birth = new Date(inputDate);

    var today      = new Date();
    var nowyear    = today.getFullYear();
    var nowmonth   = today.getMonth();
    var nowday     = today.getDate();
    var birthyear  = birth.getFullYear();
    var birthmonth = birth.getMonth();
    var birthday   = birth.getDate();
    var age        = nowyear - birthyear;
    var age_month  = nowmonth - birthmonth;
    var age_day    = nowday - birthday;
    
    if(age_month < 0 || (age_month == 0 && age_day <0)) {
        age = parseInt(age) -1;
    }
    
    return age;
}

// Gte : Greater Than or Equals
function isGte(d1, d2) {
    d1 = d1.split("-");
    d2 = d2.split("-");
    d1 = new Date(d1[0], d1[1], d1[2]);
    d2 = new Date(d2[0], d2[1], d2[2]);
    return d1 > d2;
}