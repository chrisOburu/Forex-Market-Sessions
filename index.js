document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    updateDigitalClock();
    createTwentyFourHourClock();
    createGrids();
    getSessionRange();
    //getOffset("Africa/Nairobi");
});



const sessionsTimezones = {
    "Sydney": [10, 7],
    "Tokyo": [9, 9],
    "London": [1, 8],
    "New York": [-4, 8]
}


let offset = 0;
function updateClock(selector, utczone = 0) {
    const digital = document.querySelector(selector);
    const hourEl = digital.querySelector("#hour");
    const minuteEl = digital.querySelector("#minutes");


    if (selector !== ".digital-clock") {
        const dateArray = addHoursToDateTime(utczone);
        digital.querySelector("#day").innerText = dateArray[0];
        digital.querySelector("#month").innerText = dateArray[1];
        digital.querySelector("#date").innerText = dateArray[2];
    }

    if (selector === ".digital-clock") {
        const secondEl = digital.querySelector("#seconds");
    }
    const secondEl = digital.querySelector("#seconds");
    const ampmEl = digital.querySelector("#ampm");

    if (selector === ".digital-clock") {
        utczone = offset;
    }

    const hourAhead = addHoursToDateTime(utczone);
    let h = hourAhead[3];
    let m = new Date().getUTCMinutes();
    let s = new Date().getUTCSeconds();
    let ampm = "AM";
    if (h === 24) {
        h = 12;
        ampm = "AM";
    } else if (h === 12) {
        ampm = "PM";
    }
    else if (h > 12) {
        h = h - 12;
        ampm = "PM";
    }

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;


    hourEl.innerText = h;
    minuteEl.innerText = m;

    ampmEl.innerText = ampm;
    if (selector === ".digital-clock") {
        s = s < 10 ? "0" + s : s;
        secondEl.innerText = s;
    }
}

setInterval(updateClock, 1000, ".digital-clock")
setInterval(updateClock, 1000, "#Sydney", sessionsTimezones["Sydney"][0])
setInterval(updateClock, 1000, "#Tokyo", sessionsTimezones["Tokyo"][0])
setInterval(updateClock, 1000, "#London", sessionsTimezones["London"][0])
setInterval(updateClock, 1000, "#NewYork", sessionsTimezones["New York"][0])


const sydneyHours = document.querySelector("#Sydney").querySelector(".hour");
const tokyoHours = document.querySelector("#Tokyo").querySelector(".hour");
const londonHours = document.querySelector("#London").querySelector(".hour");
const newYorkHours = document.querySelector("#NewYork").querySelector(".hour");

const hours = document.querySelectorAll(".hour");
const minutes = document.querySelectorAll(".minute");
const seconds = document.querySelectorAll(".second");

function setDate() {
    const now = new Date();


    const getSecond = now.getUTCSeconds();
    const getMinute = now.getUTCMinutes();
    const getHour = now.getUTCHours();

    const secondDegree = (getSecond / 60) * 360;
    const minuteDegree = (getMinute / 60) * 360;
    function hourDegree(getHour) {
        return (getHour / 12) * 360;
    }

    for (let second of seconds) {
        second.style.transform = `rotate(${secondDegree}deg)`
    }

    for (let minute of minutes) {
        minute.style.transform = `rotate(${minuteDegree}deg)`
    }


    sydneyHours.style.transform = `rotate(${hourDegree(getHour + sessionsTimezones["Sydney"][0])}deg)`;
    tokyoHours.style.transform = `rotate(${hourDegree(getHour + sessionsTimezones["Tokyo"][0])}deg)`;
    londonHours.style.transform = `rotate(${hourDegree(getHour + sessionsTimezones["London"][0])}deg)`;
    newYorkHours.style.transform = `rotate(${hourDegree(getHour + sessionsTimezones["New York"][0])}deg)`;
}

setInterval(setDate, 1000);



// fetch data from API

function fetchData() {
    fetch("https://worldtimeapi.org/api/timezone/")
        .then((response) => response.json())
        .then((timeZones) => {
            const region = document.querySelector("#region").value;
            changeCity(timeZones, region);
            changeRegion(timeZones);
        })
        .catch((error) => {
            console.log(error);
        });
}

function changeCity(timeZones, region) {
    const africaCities = [];

    // Iterate through the array of time zones
    for (const timeZone of timeZones) {
        // Check if the time zone starts with "Africa/"
        if (timeZone.startsWith(region)) {
            // Extract the city name by removing "Africa/" from the beginning
            const city = timeZone.substring((region + "/").length);
            africaCities.push(city);
        }
    }
    const city = document.querySelector("#city");

    // Clear the existing options
    while (city.options.length > 0) {
        city.remove(0);
    }
    // Create an <option> element for each city
    for (const city of africaCities) {
        const option = document.createElement("option");
        option.value = city;
        option.text = city;
        // make the default city

        if (city === "Nairobi") option.selected = true;
        document.getElementById("city").appendChild(option);
    }

    if (africaCities.includes("Nairobi")) {
        getOffset("Africa/Nairobi");
    } else {
        const subUrl = region + "/" + africaCities[0];
        getOffset(subUrl);
    }
}

function changeRegion(timeZones) {
    const region = document.getElementById('region');

    region.addEventListener('click', () => {
        const selected = region.options[region.selectedIndex].text;
        changeCity(timeZones, selected);
    })
}

// function to change digital clock time to timezones

function updateDigitalClock() {
    const region = document.querySelector("#region");
    const city = document.querySelector("#city");

    city.addEventListener("change", () => {
        timeZone = region.value + "/" + city.value;

        getOffset(timeZone);

    })
}

function getOffset(timeZone) {
    const url = `https://worldtimeapi.org/api/timezone/${timeZone}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const utcOffset = data.utc_offset;
            const offsetHours = parseInt(utcOffset.substring(1, 3)); // Extract hours part and convert to integer
            const offsetSign = utcOffset[0] === '+' ? 1 : -1; // Determine the sign based on the first character

            offset = offsetSign * offsetHours;
            //console.log(offset);
        })
        .catch((error) => {
            console.log(error);
        });
}

function addHoursToDateTime(hoursToAdd) {
    function getUTCDate() {
        return new Date(Date.now());
    }
    const dateTime = getUTCDate();
    //console.log(dateTime)
    // Add the specified number of hours
    dateTime.setHours(dateTime.getHours() + hoursToAdd);
    //console.log(dateTime)
    // Format the date in the desired format: "Tue Apr. 9th"
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayOfWeek = daysOfWeek[dateTime.getUTCDay()];
    const monthOfYear = monthsOfYear[dateTime.getUTCMonth()];
    const dayOfMonth = dateTime.getUTCDate();
    const hour = dateTime.getUTCHours();

    let daySuffix = 'th';
    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
        daySuffix = 'st';
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
        daySuffix = 'nd';
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
        daySuffix = 'rd';
    }

    return [dayOfWeek, `${monthOfYear}.`, `${dayOfMonth}${daySuffix}`, hour];
}


function createTwentyFourHourClock() {
    let gridContainer = document.querySelector(".grid-container");
    let grid = document.createElement("div");
    grid.className = "grid";
    gridContainer.appendChild(grid);

    let containerWidth = gridContainer.clientWidth;
    let cellWidth = containerWidth / 24;

    for (let i = 0; i < 24; i++) {
        let cell = document.createElement("div");
        cell.className = "grid-cell";
        cell.style.width = cellWidth + "px";
        cell.textContent = i;
        grid.appendChild(cell);
    }
}

function createGrids() {
    let gridContainer = document.querySelector(".grid-table");
    let containerWidth = gridContainer.clientWidth;
    let cellWidth = containerWidth / 24;

    for (let i = 0; i < 24; i++) {
        let cell = document.createElement("div");
        cell.className = "grid-item";
        cell.style.width = cellWidth - 1.5 + "px";
        gridContainer.appendChild(cell);
    }
}

setInterval(movePointer, 1000);

function movePointer() {
    table = document.querySelector(".grid-table");
    let recTable = table.getBoundingClientRect();
    const pointer = document.getElementById("line");
    const currentTime = new Date();
    const hours = parseInt(document.querySelector(".digital-clock").querySelector("#hour").textContent);
    const minutes = parseInt(document.querySelector(".digital-clock").querySelector("#minutes").textContent);
    const ampm = document.querySelector(".digital-clock").querySelector("#ampm").textContent;
    let totalMinutes = hours * 60 + minutes;
    if (ampm === "PM") {
        totalMinutes += 12 * 60;
    }
    const pixels = (totalMinutes / (24 * 60)) * (recTable.width) + recTable.left - 280 + 2;
    pointer.style.left = `${pixels}px`;
}

function getSessionRange() {
    let gridContainer = document.querySelector(".grid-table");
    let containerWidth = gridContainer.getBoundingClientRect().width;
    const containerLeft = gridContainer.getBoundingClientRect().left;
    let cellWidth = containerWidth * 9 / 24;
    let sessions = document.querySelectorAll(".session-range");
    for (let i = 0; i < sessions.length; i++) {
        sessions[i].style.width = cellWidth + "px";
    }

    function calculateRange(tzone, id, selctor, index, colour, myZone = 3) {
        const timezone = tzone[id][0];
        const open = tzone[id][1];

        const openTime = myZone - timezone + open;

        auPixels = openTime / 24;

        const infoContainer = document.querySelectorAll(".info-container")[index];
        const infoContainerWidth = infoContainer.getBoundingClientRect().right;
        const country = document.querySelector(selctor);
        const difference = auPixels * containerWidth + containerLeft - infoContainerWidth;
        country.style.marginLeft = `${difference}px`;
        country.style.transform = `translateX(0%)`;
        country.style.left = `${difference}px`;
        country.style.background = colour;

        function getOpeningHours() {
            const hourAhead = addHoursToDateTime(timezone)[3];
            const close = open + 8;

            if (open <= hourAhead && close >= hourAhead) {
                return "OPEN";
            } else {
                return "CLOSED";
            }

        }

        const sessionState = getOpeningHours();
        country.textContent = sessionState;

    }


    calculateRange(sessionsTimezones, "Sydney", "#Australia", 0, "#6b22b3");
    calculateRange(sessionsTimezones, "Tokyo", "#Japan", 1, "#ce2e71");
    calculateRange(sessionsTimezones, "London", "#UK", 2, "#0bbfff");
    calculateRange(sessionsTimezones, "New York", "#USA", 3, "#56c51f");
}

