const showHome = () => {
    document.getElementById("HomeSection").style.display = "block";
    document.getElementById("StaffSection").style.display = "none";

    document.getElementById("Home").style.backgroundColor = "lightGrey";
    document.getElementById("Staff").style.backgroundColor = "transparent";
}

const showStaff = () => {
    document.getElementById("HomeSection").style.display = "none";
    document.getElementById("StaffSection").style.display = "block";

    document.getElementById("Home").style.backgroundColor = "transparent";
    document.getElementById("Staff").style.backgroundColor = "lightGrey";
}

// Once the Web Page refreshes, it will automatically go to Home Section
window.onload = showHome;


// Staff Section information
const showStaffInfo = (data) => {
    let StaffInfo = document.getElementById("StaffInfo");
    let content = "";
    let upi = "";
    if(typeof(data) === "string"){
        data = JSON.parse(data);
    }
    
    const addRecord = (record) => {
        upi = record.profileUrl[1];
        // title + firstname + lastname
        if (record.title !== undefined) {
            content += "<div id=name>" + record.title + " " + record.firstname + " " + record.lastname + "</div><br>";
        }
        else {
            content += "<div id=name>" + record.firstname + " " + record.lastname + "</div><br>";
        }
        // profilePhoto
        if (record.imageId !== undefined) {
            content += "<img id=imageIdImg src=https://dividni.com/cors/CorsProxyService.svc/proxy?url=https://unidirectory.auckland.ac.nz/people/imageraw/"+ upi + "/" + record.imageId + "/biggest>" + "<br>";
        }
        else {
            content += "<img id=undefinedImage title='profile imageId is undefined - convert graph which found in the UOA directory' src=https://dividni.com/cors/CorsProxyService.svc/proxy?url=https://unidirectory.auckland.ac.nz/static/g5Km3OjLZuWCA8w7PdOyS4j603aTN0QC7X2gk6kRhEs.png>" + "<br>";
        }
        content += "<div id=titleTowhenLastUpdated>" + "Title: " + record.jobtitles + "<br>Org Unit Name: " + record.orgunitnames + "<br>Extn: " + record.extn + "<br>WhenLastUpdated: " + record.whenLastUpdated + "<br></div>";
        // vcard - tel, adr and email
        if (upi === "smau002") {
            content += "";
        }
        else if (upi !== "smau002") {
            content += "<pre id='" + upi + "'></pre>";
            getVcardInfo(upi);
        }
        // a hr at the bottom of the profile to separate
        content += "<hr class=hrline>";

    }
    data.list.forEach(addRecord);
    StaffInfo.innerHTML = content;
}

const getStaffInfo = () => {
    const url = "https://dividni.com/cors/CorsProxyService.svc/proxy?url=https://unidirectory.auckland.ac.nz/rest/search?orgFilter=MATHS";
    const fetchPromise = fetch(url, {
        headers: {
            "Accept": "application/json",
        }
    });
    const streamPromise = fetchPromise.then((response) => {
        return response.text();
    });
    streamPromise.then((d) => showStaffInfo(d));
}


// Information inside Vcard - email, phone and address
const showVcardInfo = (info,upi) => {
    let arr = info.split('\n');
    let arrNew = [];
    let dic = {};
    let vcard = document.getElementById(upi);
    let VcardContent = "";
    
    const addArr = (item) => {
        if (item.includes("TEL:") || item.includes("TEL;") || item.includes("ADR:") || item.includes("ADR;") || item.includes("EMAIL:") || item.includes("EMAIL;")) {
            arrNew += [item];
            let lastIndex = item.lastIndexOf(":");
            let s1 = item.substring(0, lastIndex);
            let s2 = item.substring(lastIndex + 1);
            dic[s1] = s2;
        }
    }
    arr.forEach(addArr);
    
    let arr1 = Object.keys(dic);

    let tel = "";
    let adr = "";
    let email = "";
    
    if (arr1.length === 3) {
        if (arr1[0].includes("TEL")) {
            tel = dic[arr1[0]];
        } else if (arr1[1].includes("TEL")) {
            tel = dic[arr1[1]];
        } else if (arr1[2].includes("TEL")) {
            tel = dic[arr1[2]];
        }
        
        if (arr1[0].includes("ADR")) {
            adr = dic[arr1[0]];
        } else if (arr1[1].includes("ADR")) {
            adr = dic[arr1[1]];
        } else if (arr1[2].includes("ADR")) {
            adr = dic[arr1[2]];
        }
    
        if (arr1[0].includes("EMAIL")) {
            email = dic[arr1[0]];
        } else if (arr1[1].includes("EMAIL")) {
            email = dic[arr1[1]];
        } else if (arr1[2].includes("EMAIL")) {
            email = dic[arr1[2]];
        }

        VcardContent += "<div id=phEmAr>Phone: " + "<a href=tel:" + tel + ">" + tel + "</a><br>Email: " + "<a href=mailto:" + email + ">" + email + "</a><br>Address: " + adr.replace(/;/g, "") + "</div>";
    }
    else if (arr1.length === 2) {
        if (arr1[0].includes("TEL")) {
            tel = dic[arr1[0]];
        } else if (arr1[1].includes("TEL")) {
            tel = dic[arr1[1]];
        }
        
        if (arr1[0].includes("ADR")) {
            adr = dic[arr1[0]];
        } else if (arr1[1].includes("ADR")) {
            adr = dic[arr1[1]];
        }
    
        if (arr1[0].includes("EMAIL")) {
            email = dic[arr1[0]];
        } else if (arr1[1].includes("EMAIL")) {
            email = dic[arr1[1]];
        }
        
        VcardContent += "<div id=phEmAr>Phone: " + "<a href=tel:" + tel + ">" + tel + "</a><br>Email: " + "<a href=mailto:" + email + ">" + email + "</a><br>Address: " + adr.replace(/;/g, "") + "</div>";
    }
    else if (arr1.length === 1) {
        if (arr1[0].includes("TEL")) {
            tel = dic[arr1[0]];
        }
        
        if (arr1[0].includes("ADR")) {
            adr = dic[arr1[0]];
        }
    
        if (arr1[0].includes("EMAIL")) {
            email = dic[arr1[0]];
        }

        VcardContent += "<div id=phEmAr>Phone: " + "<a href=tel:" + tel + ">" + tel + "</a><br>Email: " + "<a href=mailto:" + email + ">" + email + "</a><br>Address: " + adr.replace(/;/g, "") + "</div>";
    }

    vcard.innerHTML = VcardContent;
}


const getVcardInfo = (upi) => {
    const fetchPromise = fetch('https://dividni.com/cors/CorsProxyService.svc/proxy?url=https://unidirectory.auckland.ac.nz/people/vcard/' + upi + '', {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then( (data) => showVcardInfo(data,upi) );
}

getStaffInfo();
